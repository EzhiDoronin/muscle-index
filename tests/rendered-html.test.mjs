import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the interactive muscle atlas", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Muscle Index/i);
  assert.match(html, />35<!-- --> <!-- -->мышц</);
  assert.match(html, /Мужская мышечная система/);
  assert.match(html, /aria-label="Тип тела"/);
  assert.match(html, /aria-label="Сторона тела"/);
  assert.match(html, /aria-label="Выбор языка"/);
  assert.match(html, /aria-label="Включить светлую тему"/);
  assert.match(html, /aria-label="Масштаб тела"/);
  assert.match(html, /aria-label="Мышцы на теле"/);
  assert.match(html, /Ещё видео по теме/);
  assert.doesNotMatch(html, /<iframe/i);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape/);
});

test("keeps every anatomy view available locally", async () => {
  const imageNames = [
    "muscle-anatomy-front.png",
    "muscle-anatomy-flexed.png",
    "muscle-anatomy-arms-out.png",
    "muscle-anatomy-male-back.png",
    "muscle-anatomy-female-front.png",
    "muscle-anatomy-female-back.png",
  ];

  await Promise.all(
    imageNames.map((name) => access(new URL(`../public/${name}`, import.meta.url))),
  );

  const [page, layout, css] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);

  assert.match(page, /muscle-anatomy-\$\{bodyType\}-back\.png/);
  assert.match(page, /muscle-anatomy-female-front\.png/);
  assert.match(page, /muscle-anatomy-flexed\.png/);
  assert.match(page, /muscle-anatomy-arms-out\.png/);
  assert.match(layout, /title:\s*"Muscle Index/);
  assert.doesNotMatch(layout, /Starter Project|codex-preview|_sites-preview/);
  assert.doesNotMatch(css, /fonts\.googleapis\.com/);
});
