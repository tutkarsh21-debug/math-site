import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

// Every page of this site is built ahead of time and never revalidated, so the built pages are shipped with the deploy as
// static assets and read from there. The earlier setup copied every page into Cloudflare KV on each deploy, and the free KV
// plan allows only 1,000 writes a day, so a third deploy in a day failed. This needs no writes at all.
export default defineCloudflareConfig({ incrementalCache: staticAssetsIncrementalCache });
