// @ts-check
/**
 * Shared utilities for the CE4CSID Toolkit.
 * Zero runtime dependencies; safe to import from any page module.
 */

/**
 * @typedef {Object} Category
 * @property {string} id
 * @property {string} title
 * @property {string} color
 * @property {string} description
 */

/**
 * @typedef {Object} Resource
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {string} category
 * @property {string} type
 * @property {string} size
 * @property {string} file
 */

/**
 * Escape a value for safe insertion into HTML.
 * @param {unknown} value
 * @returns {string}
 */
export function esc(value) {
  return String(value).replace(/[&<>"']/g, (c) => {
    switch (c) {
      case "&": return "&amp;";
      case "<": return "&lt;";
      case ">": return "&gt;";
      case '"': return "&quot;";
      case "'": return "&#39;";
      default: return c;
    }
  });
}

/**
 * Look up a category by id, with a safe fallback.
 * @param {Category[]} categories
 * @param {string} id
 * @returns {Category}
 */
export function getCategory(categories, id) {
  for (const cat of categories) {
    if (cat.id === id) return cat;
  }
  return { id, title: id, color: "lime", description: "" };
}

/** @type {ReturnType<typeof setTimeout> | null} */
let toastTimer = null;

/**
 * Show a small transient toast message.
 * @param {string} message
 * @returns {void}
 */
export function showToast(message) {
  let toast = document.querySelector(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");
    document.body.appendChild(toast);
  }
  const el = toast;
  el.textContent = message;
  el.classList.add("is-visible");
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    el.classList.remove("is-visible");
  }, 2800);
}

/**
 * Attach an event listener to the first matching element, if present.
 * @param {string} selector
 * @param {string} event
 * @param {(evt: Event) => void} handler
 * @returns {void}
 */
export function on(selector, event, handler) {
  const el = document.querySelector(selector);
  if (el) el.addEventListener(event, handler);
}

/**
 * Type guard for plain objects.
 * @param {unknown} value
 * @returns {value is Record<string, unknown>}
 */
export function isRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
