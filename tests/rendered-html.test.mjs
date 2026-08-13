import assert from "node:assert/strict";
import { access, readFile, stat } from "node:fs/promises";
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
    "muscle-anatomy-front.webp",
    "muscle-anatomy-flexed.png",
    "muscle-anatomy-arms-out.png",
    "muscle-anatomy-male-back.webp",
    "muscle-anatomy-female-front.webp",
    "muscle-anatomy-female-back.webp",
  ];

  await Promise.all(
    imageNames.map((name) => access(new URL(`../public/${name}`, import.meta.url))),
  );

  const [page, layout, css] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);

  assert.match(page, /muscle-anatomy-\$\{bodyType\}-back\.webp/);
  assert.match(page, /muscle-anatomy-female-front\.webp/);
  assert.match(page, /muscle-anatomy-front\.webp/);
  assert.doesNotMatch(page, /chooseNearestHotspot|poseHotspots|flexedPoseProfiles|extendedPoseProfiles/);
  assert.match(page, /setPointerCapture/);
  assert.match(page, /aria-live="polite"/);
  assert.match(css, /min-width:\s*44px;\s*min-height:\s*44px/);
  assert.match(css, /height:\s*calc\(100dvh - 62px\)/);
  assert.doesNotMatch(css, /--responsive-body-scale:\s*2(?:[;\s])/);
  assert.match(layout, /title:\s*"Muscle Index/);
  assert.doesNotMatch(layout, /Starter Project|codex-preview|_sites-preview/);
  assert.doesNotMatch(css, /fonts\.googleapis\.com/);
});

test("ships lazy desktop and mobile 3D models with every catalog muscle", async () => {
  const modelUrl = new URL("../public/muscle-model.glb", import.meta.url);
  const mobileModelUrl = new URL("../public/muscle-model-mobile.glb", import.meta.url);
  const [model, mobileModel, modelStats, mobileModelStats, component, page, css] = await Promise.all([
    readFile(modelUrl),
    readFile(mobileModelUrl),
    stat(modelUrl),
    stat(mobileModelUrl),
    readFile(new URL("../app/MuscleModel3D.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);

  assert.equal(model.readUInt32LE(0), 0x46546c67, "asset must be a binary glTF file");
  assert.ok(modelStats.size < 7_000_000, `3D asset is too large for mobile: ${modelStats.size} bytes`);
  assert.equal(mobileModel.readUInt32LE(0), 0x46546c67, "mobile asset must be a binary glTF file");
  assert.ok(mobileModelStats.size < 3_500_000, `mobile 3D asset is too large: ${mobileModelStats.size} bytes`);
  const jsonLength = model.readUInt32LE(12);
  const json = JSON.parse(model.subarray(20, 20 + jsonLength).toString("utf8").trim());
  const muscleIds = new Set(
    (json.nodes ?? [])
      .map((node) => /^muscle__(.+?)__/.exec(node.name ?? "")?.[1])
      .filter(Boolean),
  );

  assert.equal(muscleIds.size, 35);
  const mobileJsonLength = mobileModel.readUInt32LE(12);
  const mobileJson = JSON.parse(mobileModel.subarray(20, 20 + mobileJsonLength).toString("utf8").trim());
  const mobileMuscleIds = new Set(
    (mobileJson.nodes ?? [])
      .map((node) => /^muscle__(.+?)__/.exec(node.name ?? "")?.[1])
      .filter(Boolean),
  );
  assert.equal(mobileMuscleIds.size, 35);
  assert.match(component, /import\("three"\)/);
  assert.match(component, /Raycaster/);
  assert.match(component, /muscle-model\.glb/);
  assert.match(component, /muscle-model-mobile\.glb/);
  assert.match(component, /onSelectRef\.current\(id\)/);
  assert.doesNotMatch(component, /requestAnimationFrame|transparent:\s*true/);
  assert.match(page, /<MuscleModel3D/);
  assert.match(page, /nearestHotspot/);
  assert.match(page, /\(max-width: 820px\), \(pointer: coarse\)/);
  assert.doesNotMatch(page, /muscle-glow/);
  assert.match(css, /content-visibility:\s*auto/);
  assert.match(css, /grid-template-columns:\s*minmax\(0, 1fr\)/);
  assert.match(css, /\.model3d-section\s*\{\s*display:\s*none;\s*\}/);
  assert.match(css, /\.tutorial-block li\s*\{\s*grid-template-columns:\s*32px minmax\(0, 1fr\)/);
  assert.doesNotMatch(css, /@keyframes muscleGlow|\.muscle-glow/);
});
