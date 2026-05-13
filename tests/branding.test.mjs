import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = fileURLToPath(new URL("..", import.meta.url));
const indexHtml = readFileSync(join(rootDir, "index.html"), "utf8");

test("index.html declares Macadent-owned logo assets for crawlers and app icons", () => {
  assert.match(
    indexHtml,
    /<meta property="og:image" content="https:\/\/macadent\.com\.my\/macadent-logo-hd\.png" \/>/
  );
  assert.match(
    indexHtml,
    /<meta name="twitter:image" content="https:\/\/macadent\.com\.my\/macadent-logo-hd\.png" \/>/
  );
  assert.match(indexHtml, /<link rel="icon" href="\/macadent-mark-32\.png" \/>/);
  assert.match(indexHtml, /<link rel="icon" type="image\/png" sizes="32x32" href="\/macadent-mark-32\.png" \/>/);
  assert.match(indexHtml, /<link rel="icon" type="image\/png" sizes="16x16" href="\/macadent-mark-16\.png" \/>/);
  assert.match(indexHtml, /<link rel="icon" type="image\/png" sizes="128x128" href="\/macadent-mark-128\.png" \/>/);
  assert.match(indexHtml, /<link rel="shortcut icon" href="\/macadent-mark-32\.png" \/>/);
  assert.match(indexHtml, /<link rel="apple-touch-icon" sizes="180x180" href="\/macadent-apple-touch-icon\.png" \/>/);
  assert.doesNotMatch(indexHtml, /href="\/favicon-32\.png"/);
  assert.doesNotMatch(indexHtml, /href="\/favicon-16\.png"/);
});

test("organization schema advertises the canonical Macadent logo", () => {
  const schemaMatch = indexHtml.match(/<script type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/);
  assert.ok(schemaMatch, "Expected organization schema");

  const payload = JSON.parse(schemaMatch[1]);
  assert.equal(payload["@type"], "Organization");
  assert.equal(payload.url, "https://macadent.com.my");
  assert.equal(payload.logo, "https://macadent.com.my/macadent-logo-hd.png");
  assert.equal(payload.image, "https://macadent.com.my/macadent-logo-hd.png");
});
