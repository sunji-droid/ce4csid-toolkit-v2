// @ts-check
/**
 * Community Engagement Checklist.
 * Five stages, twenty actions. Progress + notes + project name persist in
 * localStorage. Includes expand/collapse all, JSON backup export/import,
 * a project name on the printed record, and a completion celebration.
 */
import { STAGES, ACTION_COUNT } from "./checklist-data.js";
import { esc, isRecord, on, showToast } from "./util.js";

/** @typedef {import("./checklist-data.js").Stage} Stage */
/** @typedef {import("./checklist-data.js").ChecklistItem} ChecklistItem */

/**
 * @typedef {Object} ItemState
 * @property {boolean} checked
 * @property {string} note
 */

/**
 * @typedef {Object} ChecklistState
 * @property {string} project
 * @property {Record<string, ItemState>} items
 * @property {string[]} openStages
 * @property {boolean} celebrated
 */

/**
 * @typedef {Object} ChecklistHandlers
 * @property {(id: string) => void} onToggleStage
 * @property {(id: string, checked: boolean) => void} onToggleItem
 * @property {(id: string, note: string) => void} onNote
 */

export const STORAGE_KEY = "ce4csid_checklist_v2";
export const BACKUP_APP = "ce4csid-community-engagement-checklist";

/** @returns {ChecklistState} */
export function defaultState() {
  return { project: "", items: {}, openStages: [STAGES[0].id], celebrated: false };
}

/**
 * Get a valid item state, falling back to an empty one.
 * @param {Record<string, ItemState>} items
 * @param {string} id
 * @returns {ItemState}
 */
export function getItem(items, id) {
  const raw = items[id];
  if (raw && typeof raw.checked === "boolean" && typeof raw.note === "string") {
    return { checked: raw.checked, note: raw.note };
  }
  return { checked: false, note: "" };
}

/**
 * Sanitise an arbitrary items object into valid ItemState entries.
 * @param {unknown} raw
 * @returns {Record<string, ItemState>}
 */
export function sanitizeItems(raw) {
  /** @type {Record<string, ItemState>} */
  const items = {};
  if (!isRecord(raw)) return items;
  for (const [key, value] of Object.entries(raw)) {
    if (isRecord(value) && typeof value.checked === "boolean" && typeof value.note === "string") {
      items[key] = { checked: value.checked, note: value.note };
    }
  }
  return items;
}

/**
 * Parse and validate a backup file payload.
 * @param {unknown} parsed
 * @returns {{ project: string, items: Record<string, ItemState> } | null}
 */
export function parseBackup(parsed) {
  if (!isRecord(parsed) || parsed.app !== BACKUP_APP || !isRecord(parsed.items)) return null;
  return {
    project: typeof parsed.project === "string" ? parsed.project : "",
    items: sanitizeItems(parsed.items),
  };
}

/**
 * Completion stats for one stage.
 * @param {Stage} stage
 * @param {Record<string, ItemState>} items
 * @returns {{ total: number, done: number }}
 */
export function stageStats(stage, items) {
  const done = stage.items.filter((item) => getItem(items, item.id).checked).length;
  return { total: stage.items.length, done };
}

/**
 * Completion stats across all stages.
 * @param {Stage[]} stages
 * @param {Record<string, ItemState>} items
 * @returns {{ total: number, done: number, pct: number }}
 */
export function overallStats(stages, items) {
  let total = 0;
  let done = 0;
  for (const stage of stages) {
    const stats = stageStats(stage, items);
    total += stats.total;
    done += stats.done;
  }
  return { total, done, pct: total ? Math.round((done / total) * 100) : 0 };
}

/**
 * Build the DOM for one checklist item.
 * @param {ChecklistItem} item
 * @param {ItemState} itemState
 * @param {ChecklistHandlers} handlers
 * @returns {HTMLElement}
 */
export function buildItem(item, itemState, handlers) {
  const itemEl = document.createElement("div");
  itemEl.className = "check-item" + (itemState.checked ? " is-checked" : "");

  const checkboxId = "check_" + item.id;
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.id = checkboxId;
  checkbox.checked = itemState.checked;

  const bodyDiv = document.createElement("div");
  bodyDiv.className = "check-item-body";

  const label = document.createElement("label");
  label.setAttribute("for", checkboxId);
  label.textContent = item.label;

  const descP = document.createElement("p");
  descP.className = "item-desc";
  descP.textContent = item.desc;

  const noteField = document.createElement("textarea");
  noteField.className = "note-field no-print";
  noteField.placeholder = "Add a note for this item (optional)";
  noteField.rows = 1;
  noteField.value = itemState.note;
  noteField.setAttribute("aria-label", "Notes for: " + item.label);

  const printNote = document.createElement("p");
  printNote.className = "print-note" + (itemState.note ? " has-note" : "");
  printNote.textContent = itemState.note ? "Note: " + itemState.note : "";

  checkbox.addEventListener("change", () => {
    itemEl.classList.toggle("is-checked", checkbox.checked);
    handlers.onToggleItem(item.id, checkbox.checked);
  });

  noteField.addEventListener("input", () => {
    printNote.textContent = noteField.value ? "Note: " + noteField.value : "";
    printNote.classList.toggle("has-note", Boolean(noteField.value));
    handlers.onNote(item.id, noteField.value);
  });

  bodyDiv.appendChild(label);
  bodyDiv.appendChild(descP);
  bodyDiv.appendChild(noteField);
  bodyDiv.appendChild(printNote);
  itemEl.appendChild(checkbox);
  itemEl.appendChild(bodyDiv);
  return itemEl;
}

/**
 * Build the DOM for one stage. The heading wraps the button so the
 * accordion stays valid HTML (button content must be phrasing content).
 * @param {Stage} stage
 * @param {number} idx
 * @param {ChecklistState} state
 * @param {ChecklistHandlers} handlers
 * @returns {HTMLElement}
 */
export function buildStage(stage, idx, state, handlers) {
  const stats = stageStats(stage, state.items);
  const isOpen = state.openStages.includes(stage.id);

  const stageEl = document.createElement("section");
  stageEl.className = "checklist-stage" + (isOpen ? " is-open" : "");
  stageEl.dataset.stageId = stage.id;

  const heading = document.createElement("h3");
  heading.className = "stage-heading";

  const head = document.createElement("button");
  head.type = "button";
  head.className = "stage-head";
  head.setAttribute("aria-expanded", isOpen ? "true" : "false");
  head.setAttribute("aria-controls", "stage-body-" + stage.id);
  head.innerHTML =
    '<span class="stage-title"><span class="stage-number">' +
    (idx + 1) +
    "</span>" +
    esc(stage.title) +
    "</span>" +
    '<span class="stage-head-right">' +
    '<span class="stage-progress' +
    (stats.done === stats.total ? " is-complete" : "") +
    '">' +
    (stats.done === stats.total ? "Complete ✓" : stats.done + " of " + stats.total) +
    "</span>" +
    '<svg class="stage-caret" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>' +
    "</span>";
  head.addEventListener("click", () => {
    const open = stageEl.classList.toggle("is-open");
    head.setAttribute("aria-expanded", open ? "true" : "false");
    handlers.onToggleStage(stage.id);
  });
  heading.appendChild(head);

  const body = document.createElement("div");
  body.className = "stage-body";
  body.id = "stage-body-" + stage.id;

  const desc = document.createElement("p");
  desc.className = "stage-desc";
  desc.textContent = stage.description;
  body.appendChild(desc);

  for (const item of stage.items) {
    body.appendChild(buildItem(item, getItem(state.items, item.id), handlers));
  }

  stageEl.appendChild(heading);
  stageEl.appendChild(body);
  return stageEl;
}

/**
 * Render all stages into a root element.
 * @param {HTMLElement} root
 * @param {Stage[]} stages
 * @param {ChecklistState} state
 * @param {ChecklistHandlers} handlers
 * @returns {void}
 */
export function renderChecklist(root, stages, state, handlers) {
  root.innerHTML = "";
  stages.forEach((stage, idx) => root.appendChild(buildStage(stage, idx, state, handlers)));
}

/**
 * Update progress bar, counts, and per-stage completion labels.
 * @param {ChecklistState} state
 * @returns {void}
 */
export function updateProgressUI(state) {
  const stats = overallStats(STAGES, state.items);
  const fill = /** @type {HTMLElement | null} */ (document.querySelector(".progress-fill"));
  const count = document.querySelector("[data-progress-count]");
  const pct = document.querySelector("[data-progress-pct]");
  if (fill) {
    fill.style.width = stats.pct + "%";
    fill.classList.toggle("is-complete", stats.pct === 100);
  }
  if (count) count.textContent = stats.done + " of " + stats.total + " actions complete";
  if (pct) pct.textContent = stats.pct + "%";

  for (const stage of STAGES) {
    const st = stageStats(stage, state.items);
    const el = document.querySelector(
      '.checklist-stage[data-stage-id="' + stage.id + '"] .stage-progress'
    );
    if (el) {
      el.textContent = st.done === st.total ? "Complete" : st.done + " of " + st.total;
      el.classList.toggle("is-complete", st.done === st.total);
    }
  }

  if (stats.pct === 100 && !state.celebrated) {
    state.celebrated = true;
    showToast("All " + ACTION_COUNT + " actions complete. Engagement plan ready.");
  }
  if (stats.pct < 100 && state.celebrated) {
    state.celebrated = false;
  }
}

/**
 * Build a backup payload.
 * @param {ChecklistState} state
 * @returns {Record<string, unknown>}
 */
export function buildBackup(state) {
  return {
    app: BACKUP_APP,
    version: 2,
    exportedAt: new Date().toISOString(),
    project: state.project,
    items: state.items,
  };
}

/**
 * Initialise the checklist page. Safe to call when the root is absent.
 * @returns {void}
 */
export function initChecklist() {
  const root = document.getElementById("checklist-root");
  if (!root) return;

  let state = defaultState();

  function saveState() {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* private mode or unavailable storage */
    }
  }

  function loadState() {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (!isRecord(parsed)) return;
      state.project = typeof parsed.project === "string" ? parsed.project : "";
      state.items = sanitizeItems(parsed.items);
      state.openStages = Array.isArray(parsed.openStages)
        ? parsed.openStages.filter((id) => typeof id === "string")
        : [STAGES[0].id];
      state.celebrated = Boolean(parsed.celebrated);
    } catch {
      state = defaultState();
    }
  }

  /** @type {ChecklistHandlers} */
  const handlers = {
    onToggleStage(id) {
      const i = state.openStages.indexOf(id);
      if (i === -1) state.openStages.push(id);
      else state.openStages.splice(i, 1);
      saveState();
    },
    onToggleItem(id, checked) {
      const item = getItem(state.items, id);
      item.checked = checked;
      state.items[id] = item;
      saveState();
      updateProgressUI(state);
      saveState();
    },
    onNote(id, note) {
      const item = getItem(state.items, id);
      item.note = note;
      state.items[id] = item;
      saveState();
    },
  };

  const render = () => {
    renderChecklist(root, STAGES, state, handlers);
    updateProgressUI(state);
  };

  function syncOpenStages() {
    document.querySelectorAll(".checklist-stage").forEach((el) => {
      const id = el instanceof HTMLElement ? el.dataset.stageId || "" : "";
      const open = state.openStages.includes(id);
      el.classList.toggle("is-open", open);
      const head = el.querySelector(".stage-head");
      if (head) head.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  /** @param {boolean} open */
  function setAllStages(open) {
    state.openStages = open ? STAGES.map((s) => s.id) : [];
    saveState();
    syncOpenStages();
  }

  function resetChecklist() {
    if (
      !window.confirm(
        "This will clear every checked item, note, and the project name on this device. Continue?"
      )
    )
      return;
    state = defaultState();
    saveState();
    const projectInput = /** @type {HTMLInputElement | null} */ (
      document.getElementById("project-name")
    );
    if (projectInput) projectInput.value = "";
    render();
    showToast("Checklist has been reset.");
  }

  function exportJSON() {
    const blob = new Blob([JSON.stringify(buildBackup(state), null, 2)], {
      type: "application/json",
    });
    const slug =
      (state.project || "engagement-checklist")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "") || "engagement-checklist";
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = slug + "-backup.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    showToast("Backup downloaded. Keep it safe or move it to another device.");
  }

  /** @param {File} file */
  function importJSON(file) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = parseBackup(JSON.parse(String(reader.result)));
        if (!parsed) throw new Error("invalid backup");
        state.project = parsed.project;
        state.items = parsed.items;
        state.celebrated = false;
        saveState();
        const projectInput = /** @type {HTMLInputElement | null} */ (
          document.getElementById("project-name")
        );
        if (projectInput) projectInput.value = state.project;
        render();
        showToast("Backup restored successfully.");
      } catch {
        showToast("That file is not a valid checklist backup.");
      }
    };
    reader.onerror = () => showToast("Could not read that file. Please try again.");
    reader.readAsText(file);
  }

  loadState();
  render();

  const projectInput = /** @type {HTMLInputElement | null} */ (
    document.getElementById("project-name")
  );
  if (projectInput) {
    projectInput.value = state.project;
    projectInput.addEventListener("input", () => {
      state.project = projectInput.value;
      saveState();
    });
  }

  on("[data-action='reset-checklist']", "click", resetChecklist);
  on("[data-action='print-checklist']", "click", () => window.print());
  on("[data-action='expand-all']", "click", () => setAllStages(true));
  on("[data-action='collapse-all']", "click", () => setAllStages(false));
  on("[data-action='export-json']", "click", exportJSON);

  const importInput = /** @type {HTMLInputElement | null} */ (
    document.getElementById("import-file")
  );
  on("[data-action='import-json']", "click", () => {
    if (importInput) importInput.click();
  });
  if (importInput) {
    importInput.addEventListener("change", () => {
      if (importInput.files && importInput.files[0]) importJSON(importInput.files[0]);
      importInput.value = "";
    });
  }

  /** @type {string[] | null} */
  let beforePrintOpen = null;
  window.addEventListener("beforeprint", () => {
    beforePrintOpen = state.openStages.slice();
    setAllStages(true);
  });
  window.addEventListener("afterprint", () => {
    if (beforePrintOpen) {
      state.openStages = beforePrintOpen;
      beforePrintOpen = null;
      saveState();
      syncOpenStages();
    }
  });
}

document.addEventListener("DOMContentLoaded", initChecklist);
