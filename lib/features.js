// Switches for parts of the site that are built but not turned on.
// AI_REPORTS: the "Get my AI report" box under tests and on the dashboard, and its server route. It is OFF for now.
// To turn it on later: set this to true, and add the ANTHROPIC_API_KEY secret in Cloudflare (Workers > math-site > Settings > Variables and Secrets).
export const AI_REPORTS = false;
