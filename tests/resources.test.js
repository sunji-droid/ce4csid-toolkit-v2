import { test, after } from "node:test";
import assert from "node:assert/strict";
import { loadPage, cleanup } from "./helpers/dom.js";

loadPage("resources.html");
const { CATEGORIES, RESOURCES, RESOURCE_COUNT } = await import("../assets/js/resources-data.js");
const {
  validateCategory,
  matches,
  filterResources,
  resourceCardHTML,
  buildResourcesHTML,
  initResources,
} = await import("../assets/js/resources.js");

after(cleanup);

const sample = RESOURCES[0];

test("validateCategory accepts known ids and rejects everything else", () => {
  assert.equal(validateCategory("templates", CATEGORIES), "templates");
  assert.equal(validateCategory("not-a-category", CATEGORIES), "all");
  assert.equal(validateCategory(null, CATEGORIES), "all");
  assert.equal(validateCategory("", CATEGORIES), "all");
});

test("matches filters by category and by every search word", () => {
  const state = { q: "", category: sample.category };
  assert.equal(matches(sample, CATEGORIES, state), true);
  assert.equal(matches(sample, CATEGORIES, { q: "", category: "all" }), true);
  const word = sample.title.split(" ")[0].toLowerCase();
  assert.equal(matches(sample, CATEGORIES, { q: word, category: "all" }), true);
  assert.equal(matches(sample, CATEGORIES, { q: "zzzznope", category: "all" }), false);
});

test("filterResources returns the matching subset", () => {
  const all = filterResources(RESOURCES, CATEGORIES, { q: "", category: "all" });
  assert.equal(all.length, RESOURCE_COUNT);
  const one = filterResources(RESOURCES, CATEGORIES, { q: "", category: CATEGORIES[0].id });
  assert.ok(one.every((r) => r.category === CATEGORIES[0].id));
});

test("resourceCardHTML escapes content and links the file", () => {
  const html = resourceCardHTML(sample, CATEGORIES);
  assert.ok(html.includes('href="' + sample.file + '"'));
  assert.ok(html.includes("resource-card"));
  const evil = { ...sample, title: '<img src=x onerror="alert(1)">' };
  assert.ok(!resourceCardHTML(evil, CATEGORIES).includes("<img"));
});

test("buildResourcesHTML handles empty, flat and grouped views", () => {
  assert.ok(buildResourcesHTML([], CATEGORIES, true).includes("no-results"));
  const flat = buildResourcesHTML(RESOURCES, CATEGORIES, false);
  assert.ok(flat.includes("resource-grid"));
  assert.ok(!flat.includes("resource-group"));
  const grouped = buildResourcesHTML(RESOURCES, CATEGORIES, true);
  assert.ok(grouped.includes("resource-group"));
});

test("initResources renders, searches (debounced), filters and clears", (t) => {
  t.mock.timers.enable({ apis: ["setTimeout"], now: 0 });
  loadPage("resources.html", "https://example.test/resources.html?category=templates");
  initResources();
  const root = document.getElementById("resources-root");
  assert.ok(root.querySelectorAll(".resource-card").length > 0);
  assert.equal(
    document.querySelector('.filter-pill[data-category="templates"]').getAttribute("aria-pressed"),
    "true"
  );

  const input = document.getElementById("resource-search");
  input.value = "consent";
  input.dispatchEvent(new window.Event("input", { bubbles: true }));
  t.mock.timers.tick(120);
  assert.ok(document.getElementById("result-count").textContent.includes("found"));

  // clear via the search-clear button
  document
    .getElementById("search-clear")
    .dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
  assert.equal(input.value, "");

  // force an empty result then use the clear-filters button
  input.value = "zzzznope";
  input.dispatchEvent(new window.Event("input", { bubbles: true }));
  t.mock.timers.tick(120);
  const clearFilters = document.getElementById("clear-filters");
  assert.ok(clearFilters);
  clearFilters.dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
  assert.ok(root.querySelectorAll(".resource-card").length > 0);
});
