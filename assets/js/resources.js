// @ts-check
/**
 * Resources page: live search + category filters.
 * Grouped browse view by default; flat results while searching/filtering.
 * Deep-linkable via ?category= and ?q=.
 */
import { CATEGORIES, RESOURCES } from "./resources-data.js";
import { esc, getCategory } from "./util.js";

/** @typedef {import("./util.js").Category} Category */
/** @typedef {import("./util.js").Resource} Resource */

/**
 * @typedef {Object} FilterState
 * @property {string} q
 * @property {string} category
 */

/**
 * Validate a raw category query param against known categories.
 * @param {string | null} raw
 * @param {Category[]} categories
 * @returns {string}
 */
export function validateCategory(raw, categories) {
  return raw && categories.some((c) => c.id === raw) ? raw : "all";
}

/**
 * Whether a resource matches the current search + category state.
 * @param {Resource} res
 * @param {Category[]} categories
 * @param {FilterState} state
 * @returns {boolean}
 */
export function matches(res, categories, state) {
  if (state.category !== "all" && res.category !== state.category) return false;
  if (!state.q) return true;
  const hay = (
    res.title + " " + res.description + " " +
    getCategory(categories, res.category).title + " " + res.type
  ).toLowerCase();
  return state.q
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((word) => hay.includes(word));
}

/**
 * Filter resources by state.
 * @param {Resource[]} data
 * @param {Category[]} categories
 * @param {FilterState} state
 * @returns {Resource[]}
 */
export function filterResources(data, categories, state) {
  return data.filter((res) => matches(res, categories, state));
}

/**
 * Build the HTML for one resource card.
 * @param {Resource} res
 * @param {Category[]} categories
 * @returns {string}
 */
export function resourceCardHTML(res, categories) {
  const cat = getCategory(categories, res.category);
  return (
    '<article class="resource-card" data-category="' + esc(res.category) + '">' +
      '<div class="resource-card-top">' +
        '<span class="resource-cat cat-' + esc(cat.color) + '">' + esc(cat.title) + "</span>" +
        '<span class="file-badge' + (res.type === "DOCX" ? " badge-docx" : "") + '" aria-label="' + esc(res.type) + ' format">' + esc(res.type) + "</span>" +
      "</div>" +
      "<h3>" + esc(res.title) + "</h3>" +
      '<p class="resource-desc">' + esc(res.description) + "</p>" +
      '<div class="resource-card-foot">' +
        '<span class="resource-meta">' + esc(res.type === "DOCX" ? "Word document" : "PDF document") + " · " + esc(res.size) + "</span>" +
        '<a class="btn btn-ghost btn-sm" href="' + esc(res.file) + '" download aria-label="Download ' + esc(res.title) + '">Download</a>' +
      "</div>" +
    "</article>"
  );
}

/**
 * Build the full resources HTML (grouped browse, flat results, or empty state).
 * @param {Resource[]} visible
 * @param {Category[]} categories
 * @param {boolean} browsing
 * @returns {string}
 */
export function buildResourcesHTML(visible, categories, browsing) {
  if (!visible.length) {
    return (
      '<div class="no-results">' +
        "<h3>No resources match your search</h3>" +
        "<p>Try a different word, or clear the filters to browse everything.</p>" +
        '<button type="button" class="btn btn-primary btn-sm" id="clear-filters">Clear search and filters</button>' +
      "</div>"
    );
  }
  if (!browsing) {
    return '<div class="resource-grid">' + visible.map((r) => resourceCardHTML(r, categories)).join("") + "</div>";
  }
  let html = "";
  for (const cat of categories) {
    const items = visible.filter((r) => r.category === cat.id);
    if (!items.length) continue;
    html +=
      '<section class="resource-group" id="' + esc(cat.id) + '" aria-labelledby="' + esc(cat.id) + '-heading">' +
        '<div class="resource-group-head">' +
          '<h2 id="' + esc(cat.id) + '-heading">' + esc(cat.title) + "</h2>" +
          '<span class="count">' + items.length + " resources</span>" +
        "</div>" +
        '<p class="resource-group-desc">' + esc(cat.description) + "</p>" +
        '<div class="resource-grid">' + items.map((r) => resourceCardHTML(r, categories)).join("") + "</div>" +
      "</section>";
  }
  return html;
}

/**
 * Initialise the resources page. Safe to call when the root is absent.
 * @returns {void}
 */
export function initResources() {
  const root = document.getElementById("resources-root");
  if (!root) return;

  const params = new URLSearchParams(window.location.search);
  /** @type {FilterState} */
  const state = {
    q: (params.get("q") || "").trim(),
    category: validateCategory(params.get("category"), CATEGORIES),
  };

  const input = /** @type {HTMLInputElement | null} */ (document.getElementById("resource-search"));
  const clear = document.getElementById("search-clear");
  const countEl = document.getElementById("result-count");
  const pills = document.querySelectorAll(".filter-pill[data-category]");

  function syncUI() {
    pills.forEach((pill) => {
      pill.setAttribute("aria-pressed", pill.getAttribute("data-category") === state.category ? "true" : "false");
    });
    if (clear) clear.classList.toggle("is-visible", Boolean(state.q));
    const next = new URLSearchParams();
    if (state.category !== "all") next.set("category", state.category);
    if (state.q) next.set("q", state.q);
    const qs = next.toString();
    try {
      window.history.replaceState(null, "", window.location.pathname + (qs ? "?" + qs : ""));
    } catch {
      /* file:// or sandboxed context */
    }
  }

  function render() {
    const visible = filterResources(RESOURCES, CATEGORIES, state);
    const browsing = !state.q && state.category === "all";
    if (countEl) {
      countEl.textContent = browsing
        ? RESOURCES.length + " resources across " + CATEGORIES.length + " categories"
        : visible.length + (visible.length === 1 ? " resource" : " resources") + " found";
    }
    root.innerHTML = buildResourcesHTML(visible, CATEGORIES, browsing);
    const clearFilters = document.getElementById("clear-filters");
    if (clearFilters) {
      clearFilters.addEventListener("click", () => {
        state.q = "";
        state.category = "all";
        if (input) input.value = "";
        syncUI();
        render();
      });
    }
  }

  if (input) {
    input.value = state.q;
    /** @type {ReturnType<typeof setTimeout> | null} */
    let timer = null;
    input.addEventListener("input", () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        state.q = input.value.trim();
        syncUI();
        render();
      }, 120);
    });
  }

  if (clear) {
    clear.addEventListener("click", () => {
      state.q = "";
      if (input) {
        input.value = "";
        input.focus();
      }
      syncUI();
      render();
    });
  }

  pills.forEach((pill) => {
    pill.addEventListener("click", () => {
      state.category = validateCategory(pill.getAttribute("data-category"), CATEGORIES);
      syncUI();
      render();
    });
  });

  syncUI();
  render();
}

document.addEventListener("DOMContentLoaded", initResources);
