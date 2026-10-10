import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import kvIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/kv-incremental-cache";

// Pages that are built ahead of time are remembered in a Cloudflare KV store (binding NEXT_INC_CACHE_KV, see wrangler.jsonc).
// The first visit to a page builds it; every later visit is served from the store, so the server does not render the page again
// and each request stays well inside Cloudflare's processing-time limit.
export default defineCloudflareConfig({ incrementalCache: kvIncrementalCache });
