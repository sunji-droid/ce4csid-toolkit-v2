import { test, after } from "node:test";
import assert from "node:assert/strict";
import { loadHTML, cleanup } from "./helpers/dom.js";

loadHTML("<body></body>");
const { esc, getCategory, isRecord, on, showToast } = await import("../assets/js/util.js");

after(cleanup);

test("esc escapes all HTML-sensitive characters", () => {
  assert.equal(esc(`<a href="x">&'</a>`), "&lt;a href=&quot;x&quot;&gt;&amp;&#39;&lt;/a&gt;");
  assert.equal(esc(42), "42");
  assert.equal(esc(null), "null");
});

test("getCategory finds a known category and falls back safely", () => {
  const cats = [{ id: "templates", title: "Templates", color: "yellow", description: "d" }];
  assert.equal(getCategory(cats, "templates").title, "Templates");
  const fallback = getCategory(cats, "unknown");
  assert.equal(fallback.id, "unknown");
  assert.equal(fallback.color, "lime");
});

test("isRecord distinguishes plain objects from arrays/null/primitives", () => {
  assert.equal(isRecord({}), true);
  assert.equal(isRecord({ a: 1 }), true);
  assert.equal(isRecord([]), false);
  assert.equal(isRecord(null), false);
  assert.equal(isRecord("x"), false);
  assert.equal(isRecord(3), false);
});

test("on attaches a listener only when the element exists", () => {
  document.body.innerHTML = '<button id="b">x</button>';
  let clicks = 0;
  on("#b", "click", () => clicks++);
  on("#missing", "click", () => clicks++);
  document.getElementById("b").dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
  assert.equal(clicks, 1);
});

test("showToast creates a live-region toast and auto-hides (mocked clock)", (t) => {
  t.mock.timers.enable({ apis: ["setTimeout"], now: 0 });
  document.body.innerHTML = "";
  showToast("Hello");
  const toast = document.querySelector(".toast");
  assert.ok(toast);
  assert.equal(toast.getAttribute("role"), "status");
  assert.equal(toast.textContent, "Hello");
  assert.equal(toast.classList.contains("is-visible"), true);
  showToast("Again"); // reuses the same node, resets the timer
  assert.equal(document.querySelectorAll(".toast").length, 1);
  t.mock.timers.tick(2800);
  assert.equal(toast.classList.contains("is-visible"), false);
});
