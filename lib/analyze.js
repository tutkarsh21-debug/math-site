// Asks the AI to write the report on a test. Server only: used by app/api/analyze/route.js.
// It needs the Worker secret ANTHROPIC_API_KEY, the same one that the Ask a Doubt drafts use. Without it, the report button shows a
// friendly message and the instant analysis under the test still works.
import Anthropic from '@anthropic-ai/sdk';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { SYSTEM, buildUserMessage, parseReport } from '@/lib/report';

const MODEL = 'claude-sonnet-5-5';

// p: the checked data (see validatePayload). Returns { report } or { error, status, off }.
export async function writeReport(p, lang) {
  const key = getCloudflareContext().env.ANTHROPIC_API_KEY;
  if (!key) return { error: 'The AI report is not switched on yet. The analysis above is still complete.', status: 503, off: true };
  const client = new Anthropic({ apiKey: key });
  try {
    const message = await client.messages.create({ model: MODEL, max_tokens: 1500, system: SYSTEM, messages: [{ role: 'user', content: buildUserMessage(p, lang) }] });
    if (message.stop_reason === 'refusal') return { error: 'The AI could not write a report for this test. The analysis above is still complete.', status: 502 };
    const report = parseReport(message.content.filter(b => b.type === 'text').map(b => b.text).join(''));
    return report ? { report } : { error: 'The AI returned an empty report. Please try again.', status: 502 };
  } catch (e) {
    if (e instanceof Anthropic.AuthenticationError) return { error: 'The AI report is not available right now.', status: 503, off: true };
    if (e instanceof Anthropic.RateLimitError) return { error: 'The AI service is busy. Please try again in a minute.', status: 503 };
    if (e instanceof Anthropic.APIError) return { error: 'The AI service had a problem. Please try again.', status: 502 };
    return { error: 'Could not reach the AI service. Please try again.', status: 502 };
  }
}
