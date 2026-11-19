// Self-hosted provider: any model served by Ollama (https://ollama.com) on your own machine or server.
import { BrainError } from '../index.js';

export async function curate({ system, user, schema }) {
  const base = process.env.OLLAMA_URL || 'http://localhost:11434';
  const model = process.env.OLLAMA_MODEL || 'llama3.1';
  let res;
  try {
    res = await fetch(`${base}/api/chat`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        model, stream: false, format: schema || 'json',
        messages: [{ role: 'system', content: system }, { role: 'user', content: user }],
      }),
    });
  } catch {
    throw new BrainError(502, `Can't reach the self-hosted model at ${base}.`);
  }
  if (!res.ok) throw new BrainError(502, `Self-hosted model error (${res.status}).`);
  const body = await res.json();
  return body?.message?.content || '';
}
