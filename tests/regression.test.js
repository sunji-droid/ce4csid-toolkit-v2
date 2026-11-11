// Regression suite: one test per bug fixed in the Stage-1 audit (F1–F15).
// Each test is named after its finding so a future change that reintroduces
// the bug fails loudly with the finding id.
import { test, after } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { loadPage, loadHTML, cleanup } from "./helpers/dom.js";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (f) => readFileSync(path.join(ROOT, f), "utf8");

loadPage("checklist.html");
const { STAGES, ACTION_COUNT } = await import("../assets/js/checklist-data.js");
const { CATEGORIES, RESOURCES, RESOURCE_COUNT } = await import("../assets/js/resources-data.js");
const checklist = await import("../assets/js/checklist.js");
const resources = await import("../assets/js/resources.js");
const util = await import("../assets/js/util.js");

after(cleanup);

test("F1: checklist accordion heading wraps the button (no button>h3)", () => {
  loadPage("checklist.html");
  const el = checklist.buildStage(STAGES[0], 0, checklist.defaultState(), {
    onToggleStage() {},
    onToggleItem() {},
    onNote() {},
  });
  assert.ok(el.querySelector("h3.stage-heading > button.stage-head"));
  assert.equal(el.querySelector("button h3"), null);
  assert.ok(!/createElement\("button"\)[\s\S]{0,400}<h3>/.test(read("assets/js/checklist.js")));
});

test("F2: unknown category query params fall back to 'all'", () => {
  assert.equal(resources.validateCategory("__proto__", CATEGORIES), "all");
  assert.equal(resources.validateCategory("planning-guidance", CATEGORIES), "planning-guidance");
});

test("F3/F4: no hardcoded action/resource counts remain in generated pages", () => {
  const index = read("index.html");
  const checklistHtml = read("checklist.html");
  const downloadsHtml = read("downloads.html");
  assert.ok(!index.includes("total = 20"));
  assert.ok(index.includes("ACTION_COUNT"));
  assert.ok(!checklistHtml.includes("0 of 20 actions"));
  assert.ok(!downloadsHtml.includes("All eight"));
  assert.equal(
    ACTION_COUNT,
    STAGES.reduce((n, s) => n + s.items.length, 0)
  );
  assert.equal(RESOURCE_COUNT, RESOURCES.length);
});

test("F7: FileReader errors surface a toast instead of failing silently", async () => {
  loadPage("checklist.html");
  window.localStorage.clear();
  checklist.initChecklist();
  class ErrorReader {
    readAsText() {
      this.onerror();
    }
  }
  global.FileReader = ErrorReader;
  const input = document.getElementById("import-file");
  Object.defineProperty(input, "files", {
    value: [new window.File(["x"], "b.json")],
    configurable: true,
  });
  input.dispatchEvent(new window.Event("change", { bubbles: true }));
  await new Promise((r) => setImmediate(r));
  assert.ok(document.querySelector(".toast").textContent.includes("Could not read"));
});

test("F8: malformed backup items are dropped, never trusted", () => {
  const parsed = checklist.parseBackup({
    app: checklist.BACKUP_APP,
    items: {
      good: { checked: true, note: "ok" },
      evil: { checked: "true", note: "<script>" },
      arr: [1, 2],
    },
  });
  assert.deepEqual(Object.keys(parsed.items), ["good"]);
  assert.equal(checklist.parseBackup({ app: "wrong", items: {} }), null);
});

test("F9: escaping/category lookup live only in util.js (no duplicates)", () => {
  for (const f of ["assets/js/resources.js", "assets/js/downloads.js", "assets/js/checklist.js"]) {
    const src = read(f);
    assert.ok(!/function esc\(/.test(src), f + " must not redefine esc");
    assert.ok(!/function catById\(/.test(src), f + " must not redefine catById");
  }
  assert.equal(typeof util.esc, "function");
  assert.equal(typeof util.getCategory, "function");
});

test("F10: checklist rendering is split into buildStage/buildItem/renderChecklist", () => {
  assert.equal(typeof checklist.buildItem, "function");
  assert.equal(typeof checklist.buildStage, "function");
  assert.equal(typeof checklist.renderChecklist, "function");
  loadPage("checklist.html");
  checklist.renderChecklist(
    document.getElementById("checklist-root"),
    STAGES,
    checklist.defaultState(),
    {
      onToggleStage() {},
      onToggleItem() {},
      onNote() {},
    }
  );
  assert.equal(document.querySelectorAll(".checklist-stage").length, STAGES.length);
});

test("F15: hero blur is tamed on small screens and removed for reduced motion", () => {
  const css = read("assets/css/style.css");
  assert.ok(/@media \(max-width: 640px\)\s*\{\s*\.hero-blob\s*\{\s*filter: blur\(45px\)/.test(css));
  assert.ok(
    /prefers-reduced-motion: reduce[\s\S]{0,400}\.hero-blob\s*\{\s*display: none;/.test(css)
  );
});

test("F11/F12: governance and tooling files exist", () => {
  for (const f of [
    "SECURITY.md",
    "CODE_OF_CONDUCT.md",
    ".editorconfig",
    ".env.example",
    ".github/PULL_REQUEST_TEMPLATE.md",
    ".github/CODEOWNERS",
    ".github/ISSUE_TEMPLATE/bug_report.md",
    ".github/ISSUE_TEMPLATE/feature_request.md",
    ".github/ISSUE_TEMPLATE/config.yml",
    "package.json",
    "eslint.config.js",
    "tsconfig.json",
  ]) {
    assert.ok(read(f).length > 0, f + " should exist");
  }
});

test("F5: pages load scripts as ES modules (no classic-script/export mismatch)", () => {
  for (const f of [
    "index.html",
    "checklist.html",
    "resources.html",
    "downloads.html",
    "contact.html",
  ]) {
    const html = read(f);
    assert.ok(
      !/<script src="assets\/js\/[^"]+"><\/script>/.test(html),
      f + " still has a classic script"
    );
  }
  loadHTML("<body></body>");
  assert.equal(util.esc("<"), "&lt;");
});
