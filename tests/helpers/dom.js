// Test helper: load a real generated page into jsdom and expose browser globals
// so the ES modules can be imported and initialised under node:test.
// No real network and no real clock are used anywhere in the suite.
import { JSDOM, VirtualConsole } from "jsdom";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");

/** @type {JSDOM | null} */
let current = null;

class FakeIntersectionObserver {
  static instances = [];
  constructor(callback) {
    this.callback = callback;
    this.targets = [];
    FakeIntersectionObserver.instances.push(this);
  }
  observe(el) {
    this.targets.push(el);
  }
  unobserve(el) {
    this.targets = this.targets.filter((t) => t !== el);
  }
  disconnect() {
    this.targets = [];
  }
  trigger() {
    this.callback(
      this.targets.map((target) => ({ isIntersecting: true, target })),
      this
    );
  }
}

function applyGlobals(window) {
  global.window = window;
  global.document = window.document;
  global.Node = window.Node;
  global.HTMLElement = window.HTMLElement;
  global.HTMLInputElement = window.HTMLInputElement;
  global.HTMLFormElement = window.HTMLFormElement;
  global.HTMLButtonElement = window.HTMLButtonElement;
  global.FormData = window.FormData;
  global.FileReader = window.FileReader;
  global.Blob = window.Blob;
  global.localStorage = window.localStorage;
  global.IntersectionObserver = FakeIntersectionObserver;
  window.IntersectionObserver = FakeIntersectionObserver;
  if (!window.matchMedia) {
    window.matchMedia = () => ({
      matches: false,
      addEventListener() {},
      removeEventListener() {},
    });
  }
  // jsdom lacks object URLs; stub them (no real resources are created).
  global.URL.createObjectURL = () => "blob:mock";
  global.URL.revokeObjectURL = () => {};
  window.confirm = () => true;
  window.print = () => {};
}

/**
 * Load one of the repo's generated HTML pages.
 * @param {string} file e.g. "checklist.html"
 * @param {string} [url]
 * @returns {JSDOM}
 */
export function loadPage(file, url = "https://example.test/") {
  const html = readFileSync(path.join(ROOT, file), "utf8");
  return loadHTML(html, url);
}

/**
 * Load an arbitrary HTML string.
 * @param {string} html
 * @param {string} [url]
 * @returns {JSDOM}
 */
export function loadHTML(html, url = "https://example.test/") {
  if (current) current.window.close();
  FakeIntersectionObserver.instances = [];
  const virtualConsole = new VirtualConsole(); // swallow jsdom navigation noise
  virtualConsole.on("jsdomError", () => {});
  const dom = new JSDOM(html, { url, pretendToBeVisual: true, virtualConsole });
  current = dom;
  applyGlobals(dom.window);
  return dom;
}

/** Close the active DOM (call from an after() hook). */
export function cleanup() {
  if (current) {
    current.window.close();
    current = null;
  }
}

export { FakeIntersectionObserver };
