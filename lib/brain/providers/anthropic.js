// Anthropic provider (Claude). Streams the request so long, 300-song replies don't time out.
import Anthropic from '@anthropic-ai/sdk';
import { BrainError } from '../index.js';

const MODEL = process.env.ANTHROPIC_MODEL || 'claude-opus-5-5';

export async function curate({ system, user, schema, apiKey }) {
  const key = apiKey || process.env.ANTHROPIC_API_KEY;
  if (!key) throw new BrainError(500, 'The server has no Anthropic API key configured.');
  const client = new Anthropic({ apiKey: key });
  try {
    const stream = client.beta.messages.stream({
      model: MODEL,
      max_tokens: 64000,
      system,
      messages: [{ role: 'user', content: user }],
      output_config: { effort: 'medium', ...(schema ? { format: { type: 'json_schema', schema } } : {}) },
      // If the request is declined on safety grounds, retry on the model Anthropic picks for that case.
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
    });
    const msg = await stream.finalMessage();
    if (msg.stop_reason === 'refusal') throw new BrainError(422, 'The AI declined this request.');
    if (msg.stop_reason === 'max_tokens') throw new BrainError(413, 'The playlist is too long for one request. Try a smaller playlist size.');
    return msg.content.filter((b) => b.type === 'text').map((b) => b.text).join('');
  } catch (e) {
    if (e instanceof BrainError) throw e;
    if (e instanceof Anthropic.AuthenticationError) throw new BrainError(401, 'That AI key was rejected.');
    if (e instanceof Anthropic.RateLimitError) throw new BrainError(429, 'The AI is busy right now. Try again in a minute.');
    if (e instanceof Anthropic.APIError) throw new BrainError(502, `AI service error (${e.status ?? 'network'}).`);
    throw e;
  }
}
