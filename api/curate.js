// POST /api/curate — runs the curation step on the configured AI "brain".
// Body: { system, user, schema, passcode?, apiKey?, provider? }
//   - apiKey: the visitor's own key (used once for this request, never stored or logged)
//   - passcode: unlocks the owner's key (DEMO_PASSCODE / ANTHROPIC_API_KEY env vars)
import { getProvider, BrainError } from '../lib/brain/index.js';
import { timingSafeEqual } from 'node:crypto';

const MAX_PROMPT = 400_000; // characters; a 1,000-song year is ~100k

const sameSecret = (a, b) => {
  const x = Buffer.from(String(a)), y = Buffer.from(String(b));
  return x.length === y.length && timingSafeEqual(x, y);
};

export default async function handler(req, res) {
  if (req.method === 'GET') return res.status(200).json({ ok: true, passcode: !!process.env.DEMO_PASSCODE });
  if (req.method !== 'POST') return res.status(405).json({ error: 'Use POST.' });
  try {
    const { system, user, schema, passcode, apiKey, provider } = req.body || {};
    if (typeof system !== 'string' || typeof user !== 'string' || !system || !user) throw new BrainError(400, 'Missing prompt.');
    if (system.length + user.length > MAX_PROMPT) throw new BrainError(413, 'That playlist is too big for one run.');

    let brain, key;
    if (apiKey) {
      brain = getProvider(provider || 'anthropic'); // visitor brings their own key
      key = String(apiKey);
    } else if (process.env.DEMO_PASSCODE && passcode && sameSecret(passcode, process.env.DEMO_PASSCODE)) {
      brain = getProvider(process.env.BRAIN_PROVIDER || 'anthropic'); // owner's brain
    } else {
      throw new BrainError(401, passcode ? 'That passcode isn\'t right.' : 'Enter a guest passcode or your own AI key.');
    }
    const text = await brain.curate({ system, user, schema, apiKey: key });
    return res.status(200).json({ text });
  } catch (e) {
    const status = e instanceof BrainError ? e.status : 500;
    if (status === 500) console.error('curate failed:', e?.message);
    return res.status(status).json({ error: e instanceof BrainError ? e.message : 'Something went wrong on the server.' });
  }
}
