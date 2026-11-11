import { test, after } from "node:test";
import assert from "node:assert/strict";
import { loadPage, cleanup, FakeIntersectionObserver } from "./helpers/dom.js";

loadPage("index.html", "https://example.test/index.html");
const { initMobileNav, markActiveNavLink, initHeaderShadow, initReveal, setFooterYear, initSite } =
  await import("../assets/js/main.js");

after(cleanup);

test("initMobileNav toggles, closes on link/escape/outside click", () => {
  loadPage("index.html");
  initMobileNav();
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".primary-nav");
  toggle.dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
  assert.equal(nav.classList.contains("is-open"), true);
  assert.equal(toggle.getAttribute("aria-expanded"), "true");

  nav.querySelector("a").dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
  assert.equal(nav.classList.contains("is-open"), false);

  toggle.dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
  document.dispatchEvent(new window.KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
  assert.equal(nav.classList.contains("is-open"), false);

  toggle.dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
  document.body.dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
  assert.equal(nav.classList.contains("is-open"), false);
});

test("markActiveNavLink flags the current page", () => {
  loadPage("resources.html", "https://example.test/resources.html");
  markActiveNavLink();
  const active = document.querySelector('.primary-nav a[data-page="resources.html"]');
  assert.equal(active.getAttribute("aria-current"), "page");
});

test("initHeaderShadow reacts to scroll position", () => {
  loadPage("index.html");
  initHeaderShadow();
  const header = document.querySelector(".site-header");
  window.scrollY = 100;
  window.dispatchEvent(new window.Event("scroll"));
  assert.equal(header.classList.contains("is-scrolled"), true);
  window.scrollY = 0;
  window.dispatchEvent(new window.Event("scroll"));
  assert.equal(header.classList.contains("is-scrolled"), false);
});

test("initReveal observes elements and reveals them on intersection", () => {
  loadPage("index.html");
  initReveal();
  const io = FakeIntersectionObserver.instances.at(-1);
  assert.ok(io);
  assert.ok(io.targets.length > 0);
  io.trigger();
  assert.ok(document.querySelector(".reveal").classList.contains("is-visible"));
});

test("initReveal falls back to visible when reduced motion is preferred", () => {
  loadPage("index.html");
  window.matchMedia = () => ({ matches: true, addEventListener() {}, removeEventListener() {} });
  initReveal();
  assert.ok(document.querySelector(".reveal").classList.contains("is-visible"));
  window.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {} });
});

test("setFooterYear writes the (mocked) current year", (t) => {
  t.mock.timers.enable({ apis: ["Date"], now: Date.UTC(2026, 0, 15) });
  loadPage("index.html");
  setFooterYear();
  assert.equal(document.querySelector("[data-current-year]").textContent, "2026");
});

test("initSite wires the whole page without throwing", () => {
  loadPage("index.html");
  assert.doesNotThrow(() => initSite());
});
