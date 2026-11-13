// Regression suite: one test per bug fixed in the Stage-1 audit (F1 to F15).
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

test("Layout guide: six parts and sixteen chapters are present as content spaces", () => {
  const html = read("resources.html");
  const parts = [
    "Foundations of Community Engagement",
    "Planning and Co-Design",
    "Responsible and Inclusive Engagement",
    "Communication and Knowledge Translation",
    "Policy Engagement, Monitoring and Sustainability",
    "Practical Application and Lessons Learned",
  ];
  const chapters = [
    "Introduction to the CE4CSID Toolkit",
    "Understanding Communities and Their Contexts",
    "Principles of Meaningful Community Engagement",
    "Community Engagement Planning and Project Design",
    "Participatory Communication and Co-Design",
    "Community Engagement Methods, Activities and Tools",
    "Ethical and Inclusive Community Engagement",
    "Environmental Considerations",
    "Responsible Data Management and Use",
    "Communicating CSID Data and Scientific Evidence",
    "Risk Communication, Misinformation and Trust",
    "Communicating Research Findings and Facilitating Community Feedback",
    "From Research to Policy and Practice",
    "Monitoring, Evaluation, Learning and Sustainability",
    "CE4CSID Implementation Checklist",
    "Piloting the Toolkit: Experiences and Lessons Learned",
  ];
  for (const part of parts) assert.ok(html.includes(part), "missing part: " + part);
  for (const chapter of chapters) assert.ok(html.includes(chapter), "missing chapter: " + chapter);
  assert.equal((html.match(/data-chapter="/g) || []).length, 16);
  assert.ok(html.includes('id="toolkit-outline"'));
  assert.ok(html.includes('id="resource-library"'));
});

test("Public contact email is the CE4CSID Working Group address", () => {
  const email = "wg-ce4csid@csidnet.org";
  for (const f of [
    "assets/js/contact.js",
    "contact.html",
    "index.html",
    "about.html",
    "resources.html",
    "downloads.html",
    "checklist.html",
    "404.html",
    ".github/ISSUE_TEMPLATE/config.yml",
    "CONTRIBUTING.md",
    "SECURITY.md",
    "CODE_OF_CONDUCT.md",
  ]) {
    const src = read(f);
    assert.ok(src.includes(email), f + " should use the Working Group email");
    assert.ok(!src.includes("mkonamile@gmail.com"), f + " should not use the old personal email");
  }
});

test("Copy polish: public pages and scripts avoid em/en dashes and formulaic filler", () => {
  const files = [
    "index.html",
    "about.html",
    "resources.html",
    "downloads.html",
    "checklist.html",
    "contact.html",
    "404.html",
    "assets/js/contact.js",
    "assets/js/checklist.js",
    "README.md",
    "CHANGELOG.md",
    "CONTRIBUTING.md",
  ];
  for (const f of files) {
    const src = read(f);
    assert.ok(!/[\u2014\u2013\u2015]/.test(src), f + " should not contain em/en dashes");
    assert.ok(
      !/free and open access, always|ready when you are|wandered off the map|in today's fast|delve into|tapestry/i.test(
        src
      ),
      f + " should avoid formulaic filler"
    );
  }
});

test("Body paragraphs are justified with hyphenation, while short UI text stays left-aligned", () => {
  const css = read("assets/css/style.css");
  assert.ok(/p\s*\{[^}]*text-align:\s*justify[^}]*hyphens:\s*auto/s.test(css));
  assert.ok(/\.form-note,[\s\S]*?text-align:\s*left;/.test(css));
});
