import { test, after } from "node:test";
import assert from "node:assert/strict";
import { loadPage, cleanup } from "./helpers/dom.js";

loadPage("checklist.html");
const { STAGES, ACTION_COUNT } = await import("../assets/js/checklist-data.js");
const {
  STORAGE_KEY,
  BACKUP_APP,
  defaultState,
  getItem,
  sanitizeItems,
  parseBackup,
  stageStats,
  overallStats,
  buildItem,
  buildStage,
  renderChecklist,
  updateProgressUI,
  buildBackup,
  initChecklist,
} = await import("../assets/js/checklist.js");

after(cleanup);

const noopHandlers = { onToggleStage() {}, onToggleItem() {}, onNote() {} };

test("defaultState opens the first stage and is otherwise empty", () => {
  const s = defaultState();
  assert.equal(s.project, "");
  assert.deepEqual(s.openStages, [STAGES[0].id]);
  assert.equal(s.celebrated, false);
});

test("getItem returns valid state and falls back for malformed entries", () => {
  const items = { a: { checked: true, note: "hi" }, bad: { checked: "yes", note: 1 } };
  assert.deepEqual(getItem(items, "a"), { checked: true, note: "hi" });
  assert.deepEqual(getItem(items, "bad"), { checked: false, note: "" });
  assert.deepEqual(getItem(items, "missing"), { checked: false, note: "" });
});

test("sanitizeItems keeps only well-formed entries", () => {
  const out = sanitizeItems({
    ok: { checked: false, note: "" },
    badType: { checked: 1, note: "" },
    badNote: { checked: true, note: null },
    notObj: 5,
  });
  assert.deepEqual(Object.keys(out), ["ok"]);
  assert.deepEqual(sanitizeItems(null), {});
  assert.deepEqual(sanitizeItems([]), {});
});

test("parseBackup validates the app marker and item shape", () => {
  assert.equal(parseBackup(null), null);
  assert.equal(parseBackup({ app: "other", items: {} }), null);
  assert.equal(parseBackup({ app: BACKUP_APP }), null);
  const good = parseBackup({
    app: BACKUP_APP,
    project: "P",
    items: { x: { checked: true, note: "n" } },
  });
  assert.equal(good.project, "P");
  assert.deepEqual(good.items.x, { checked: true, note: "n" });
});

test("stageStats and overallStats compute completion correctly", () => {
  const items = {};
  items[STAGES[0].items[0].id] = { checked: true, note: "" };
  assert.deepEqual(stageStats(STAGES[0], items), { total: 4, done: 1 });
  const all = overallStats(STAGES, items);
  assert.equal(all.total, ACTION_COUNT);
  assert.equal(all.done, 1);
  assert.equal(overallStats(STAGES, {}).pct, 0);
});

test("buildItem wires checkbox and note callbacks", () => {
  loadPage("checklist.html");
  /** @type {unknown[]} */
  const toggles = [];
  /** @type {unknown[]} */
  const notes = [];
  const handlers = {
    onToggleStage() {},
    onToggleItem: (id, checked) => toggles.push([id, checked]),
    onNote: (id, note) => notes.push([id, note]),
  };
  const item = STAGES[0].items[0];
  const el = buildItem(item, { checked: false, note: "" }, handlers);
  const box = el.querySelector("input[type=checkbox]");
  box.checked = true;
  box.dispatchEvent(new window.Event("change", { bubbles: true }));
  assert.deepEqual(toggles.at(-1), [item.id, true]);
  const note = el.querySelector("textarea");
  note.value = "a note";
  note.dispatchEvent(new window.Event("input", { bubbles: true }));
  assert.deepEqual(notes.at(-1), [item.id, "a note"]);
  assert.ok(el.querySelector(".print-note").textContent.includes("a note"));
});

test("buildStage wraps the button in an h3 (valid accordion markup)", () => {
  loadPage("checklist.html");
  const state = defaultState();
  const el = buildStage(STAGES[0], 0, state, noopHandlers);
  const heading = el.querySelector("h3.stage-heading");
  assert.ok(heading);
  const button = heading.querySelector("button.stage-head");
  assert.ok(button, "button must be inside the h3, not the other way round");
  assert.equal(button.querySelector("h3"), null);
  assert.equal(button.getAttribute("aria-expanded"), "true");
});

test("renderChecklist renders every stage and item", () => {
  loadPage("checklist.html");
  const root = document.getElementById("checklist-root");
  renderChecklist(root, STAGES, defaultState(), noopHandlers);
  assert.equal(root.querySelectorAll(".checklist-stage").length, STAGES.length);
  assert.equal(root.querySelectorAll(".check-item").length, ACTION_COUNT);
});

test("updateProgressUI reflects completion and celebrates at 100% (mocked clock)", (t) => {
  t.mock.timers.enable({ apis: ["setTimeout"], now: 0 });
  loadPage("checklist.html");
  const state = defaultState();
  renderChecklist(document.getElementById("checklist-root"), STAGES, state, noopHandlers);
  for (const stage of STAGES)
    for (const item of stage.items) state.items[item.id] = { checked: true, note: "" };
  updateProgressUI(state);
  assert.equal(document.querySelector("[data-progress-pct]").textContent, "100%");
  assert.equal(state.celebrated, true);
  assert.ok(document.querySelector(".toast"));
});

test("buildBackup produces a versioned payload (mocked clock)", (t) => {
  t.mock.timers.enable({ apis: ["Date"], now: Date.UTC(2026, 0, 15) });
  const state = defaultState();
  state.project = "Demo";
  const backup = buildBackup(state);
  assert.equal(backup.app, BACKUP_APP);
  assert.equal(backup.version, 2);
  assert.equal(backup.project, "Demo");
  assert.equal(backup.exportedAt, "2026-01-15T00:00:00.000Z");
});

test("initChecklist persists toggles and notes to localStorage", () => {
  loadPage("checklist.html");
  window.localStorage.clear();
  initChecklist();
  const first = document.querySelector(".check-item input[type=checkbox]");
  first.checked = true;
  first.dispatchEvent(new window.Event("change", { bubbles: true }));
  const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY));
  assert.equal(
    Object.values(saved.items).some((i) => i.checked),
    true
  );
});

test("initChecklist exports a backup file (stubbed object URL)", () => {
  loadPage("checklist.html");
  window.localStorage.clear();
  initChecklist();
  /** @type {string[]} */
  const downloads = [];
  const origCreate = document.createElement.bind(document);
  document.createElement = (tag) => {
    const el = origCreate(tag);
    if (tag === "a") el.click = () => downloads.push(el.download);
    return el;
  };
  document
    .querySelector("[data-action='export-json']")
    .dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
  document.createElement = origCreate;
  assert.equal(downloads.length, 1);
  assert.ok(downloads[0].endsWith("-backup.json"));
});

test("initChecklist imports a valid backup via a stubbed FileReader", async () => {
  loadPage("checklist.html");
  window.localStorage.clear();
  initChecklist();
  const payload = JSON.stringify({
    app: BACKUP_APP,
    project: "Restored",
    items: { design_scope: { checked: true, note: "n" } },
  });
  class FakeReader {
    readAsText() {
      this.result = payload;
      this.onload();
    }
  }
  global.FileReader = FakeReader;
  const input = document.getElementById("import-file");
  Object.defineProperty(input, "files", {
    value: [new window.File([payload], "b.json")],
    configurable: true,
  });
  input.dispatchEvent(new window.Event("change", { bubbles: true }));
  await new Promise((r) => setImmediate(r));
  assert.equal(document.getElementById("project-name").value, "Restored");
  const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY));
  assert.equal(saved.project, "Restored");
});

test("initChecklist rejects an invalid backup file", async () => {
  loadPage("checklist.html");
  window.localStorage.clear();
  initChecklist();
  class FakeReader {
    readAsText() {
      this.result = "not json";
      this.onload();
    }
  }
  global.FileReader = FakeReader;
  const input = document.getElementById("import-file");
  Object.defineProperty(input, "files", {
    value: [new window.File(["x"], "b.json")],
    configurable: true,
  });
  input.dispatchEvent(new window.Event("change", { bubbles: true }));
  await new Promise((r) => setImmediate(r));
  assert.ok(document.querySelector(".toast").textContent.includes("not a valid"));
});

test("initChecklist reset clears state after confirmation", () => {
  loadPage("checklist.html");
  window.localStorage.clear();
  initChecklist();
  const box = document.querySelector(".check-item input[type=checkbox]");
  box.checked = true;
  box.dispatchEvent(new window.Event("change", { bubbles: true }));
  document
    .querySelector("[data-action='reset-checklist']")
    .dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
  const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY));
  assert.deepEqual(saved.items, {});
});

test("initChecklist expand/collapse all and print round-trip", () => {
  loadPage("checklist.html");
  window.localStorage.clear();
  initChecklist();
  document
    .querySelector("[data-action='expand-all']")
    .dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
  assert.equal(document.querySelectorAll(".checklist-stage.is-open").length, STAGES.length);
  document
    .querySelector("[data-action='collapse-all']")
    .dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
  assert.equal(document.querySelectorAll(".checklist-stage.is-open").length, 0);
  window.dispatchEvent(new window.Event("beforeprint"));
  assert.equal(document.querySelectorAll(".checklist-stage.is-open").length, STAGES.length);
  window.dispatchEvent(new window.Event("afterprint"));
  assert.equal(document.querySelectorAll(".checklist-stage.is-open").length, 0);
});
