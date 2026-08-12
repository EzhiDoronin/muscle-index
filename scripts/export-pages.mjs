import { cp, mkdir, rm, writeFile } from "node:fs/promises";

const output = new URL("../pages-dist/", import.meta.url);
const client = new URL("../dist/client/", import.meta.url);
const workerUrl = new URL("../dist/server/index.js", import.meta.url);
workerUrl.searchParams.set("pages-export", Date.now().toString());

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await cp(client, output, { recursive: true });

const { default: worker } = await import(workerUrl.href);
const response = await worker.fetch(
  new Request("https://example.github.io/", { headers: { accept: "text/html" } }),
  { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
  { waitUntil() {}, passThroughOnException() {} },
);

if (!response.ok) throw new Error(`Static render failed with HTTP ${response.status}`);

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
let html = await response.text();
if (basePath) {
  html = html.replaceAll('="/assets/', `="${basePath}/assets/`);
}

await writeFile(new URL("index.html", output), html, "utf8");
await writeFile(new URL("404.html", output), html, "utf8");
await writeFile(new URL(".nojekyll", output), "", "utf8");

console.log(`GitHub Pages export ready in ${output.pathname}`);
