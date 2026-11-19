// The "brain": one interface, swappable providers.
// Every provider takes the same input and returns the model's raw text reply (expected to be JSON).
//
//   curate({ system, user, schema, apiKey }) -> Promise<string>
//
// To add a provider (OpenAI, Gemini, a fine-tuned model…), create providers/<name>.js exporting
// `curate`, then register it below. The front end never changes.
import * as anthropic from './providers/anthropic.js';
import * as ollama from './providers/ollama.js';
import * as mock from './providers/mock.js';

const PROVIDERS = { anthropic, ollama, mock };

export function getProvider(name) {
  const p = PROVIDERS[String(name || '').toLowerCase()];
  if (!p) throw new BrainError(400, `Unknown AI provider "${name}".`);
  return p;
}

export const providerNames = Object.keys(PROVIDERS);

export class BrainError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}
