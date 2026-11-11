import { test, after } from "node:test";
import assert from "node:assert/strict";
import { loadPage, cleanup } from "./helpers/dom.js";

loadPage("downloads.html");
const { CATEGORIES, RESOURCES } = await import("../assets/js/resources-data.js");
const { filterDownloads, buildDownloadsRowsHTML, initDownloads } =
  await import("../assets/js/downloads.js");

after(cleanup);

test("filterDownloads matches title/category/type across all words", () => {
  assert.equal(filterDownloads(RESOURCES, CATEGORIES, "").length, RESOURCES.length);
  assert.equal(filterDownloads(RESOURCES, CATEGORIES, "   ").length, RESOURCES.length);
  const pdf = filterDownloads(RESOURCES, CATEGORIES, "pdf");
  assert.ok(pdf.every((r) => r.type === "PDF"));
  assert.equal(filterDownloads(RESOURCES, CATEGORIES, "zzzznope").length, 0);
});

test("buildDownloadsRowsHTML renders rows and an empty state", () => {
  const rows = buildDownloadsRowsHTML(RESOURCES, CATEGORIES);
  assert.ok(rows.includes("<tr>"));
  assert.ok(rows.includes('href="' + RESOURCES[0].file + '"'));
  assert.ok(buildDownloadsRowsHTML([], CATEGORIES).includes("No files match"));
});

test("initDownloads renders the table and filters on input (debounced)", (t) => {
  t.mock.timers.enable({ apis: ["setTimeout"], now: 0 });
  loadPage("downloads.html");
  initDownloads();
  const tbody = document.getElementById("downloads-tbody");
  assert.equal(tbody.querySelectorAll("tr").length, RESOURCES.length);
  assert.ok(document.getElementById("downloads-count").textContent.includes("All"));

  const input = document.getElementById("downloads-search");
  input.value = "template";
  input.dispatchEvent(new window.Event("input", { bubbles: true }));
  t.mock.timers.tick(120);
  assert.ok(document.getElementById("downloads-count").textContent.includes("found"));
});
