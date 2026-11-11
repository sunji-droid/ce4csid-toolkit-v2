// @ts-check
/**
 * Downloads page: full file table with a live filter box.
 * Renders from the same data source as the Resources page.
 */
import { CATEGORIES, RESOURCES } from "./resources-data.js";
import { esc, getCategory } from "./util.js";

/** @typedef {import("./util.js").Category} Category */
/** @typedef {import("./util.js").Resource} Resource */

/** @type {Record<string, string>} */
const COLOR_VAR = {
  lime: "var(--csid-lime)",
  blue: "var(--csid-blue)",
  purple: "var(--csid-purple)",
  yellow: "var(--csid-yellow)",
};

/**
 * Filter resources by a free-text query.
 * @param {Resource[]} data
 * @param {Category[]} categories
 * @param {string} query
 * @returns {Resource[]}
 */
export function filterDownloads(data, categories, query) {
  const q = query.trim().toLowerCase();
  if (!q) return data.slice();
  const words = q.split(/\s+/).filter(Boolean);
  return data.filter((res) => {
    const hay = (res.title + " " + getCategory(categories, res.category).title + " " + res.type).toLowerCase();
    return words.every((w) => hay.includes(w));
  });
}

/**
 * Build table rows HTML for the given resources.
 * @param {Resource[]} rows
 * @param {Category[]} categories
 * @returns {string}
 */
export function buildDownloadsRowsHTML(rows, categories) {
  if (!rows.length) {
    return (
      '<tr><td colspan="5" style="text-align:center; padding:40px 20px; color:var(--ink-soft);">' +
      "No files match your search. Try a different word.</td></tr>"
    );
  }
  return rows
    .map((res) => {
      const cat = getCategory(categories, res.category);
      return (
        "<tr>" +
          '<td class="dl-title">' + esc(res.title) + "</td>" +
          '<td class="dl-soft"><span class="dl-cat-dot" style="background:' + (COLOR_VAR[cat.color] || COLOR_VAR.lime) + '"></span>' + esc(cat.title) + "</td>" +
          '<td class="dl-soft">' + esc(res.type) + "</td>" +
          '<td class="dl-soft">' + esc(res.size) + "</td>" +
          '<td><a class="btn btn-ghost btn-sm" href="' + esc(res.file) + '" download aria-label="Download ' + esc(res.title) + '">Download</a></td>' +
        "</tr>"
      );
    })
    .join("");
}

/**
 * Initialise the downloads page. Safe to call when the table body is absent.
 * @returns {void}
 */
export function initDownloads() {
  const tbody = document.getElementById("downloads-tbody");
  if (!tbody) return;
  const countEl = document.getElementById("downloads-count");
  const input = /** @type {HTMLInputElement | null} */ (document.getElementById("downloads-search"));

  /** @param {string} query */
  function render(query) {
    const rows = filterDownloads(RESOURCES, CATEGORIES, query);
    if (countEl) {
      countEl.textContent = query.trim()
        ? rows.length + (rows.length === 1 ? " file" : " files") + " found"
        : "All " + RESOURCES.length + " toolkit files";
    }
    tbody.innerHTML = buildDownloadsRowsHTML(rows, CATEGORIES);
  }

  render("");
  if (input) {
    /** @type {ReturnType<typeof setTimeout> | null} */
    let timer = null;
    input.addEventListener("input", () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => render(input.value), 120);
    });
  }
}

document.addEventListener("DOMContentLoaded", initDownloads);
