// @ts-check
/**
 * Shared site behaviour: mobile nav, active link, sticky header shadow,
 * footer year, and scroll reveal.
 */

/** @returns {void} */
export function initMobileNav() {
  const toggle = /** @type {HTMLButtonElement | null} */ (document.querySelector(".nav-toggle"));
  const nav = document.querySelector(".primary-nav");
  if (!toggle || !nav) return;

  function close() {
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  }

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", close));
  document.addEventListener("keydown", (evt) => {
    if (evt.key === "Escape") close();
  });
  document.addEventListener("click", (evt) => {
    const target = evt.target;
    if (nav.classList.contains("is-open") && target instanceof Node && !nav.contains(target) && !toggle.contains(target)) {
      close();
    }
  });
}

/** @returns {void} */
export function markActiveNavLink() {
  const current = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".primary-nav a[data-page]").forEach((link) => {
    if (link.getAttribute("data-page") === current) {
      link.classList.add("is-active");
      link.setAttribute("aria-current", "page");
    }
  });
}

/** @returns {void} */
export function initHeaderShadow() {
  const header = document.querySelector(".site-header");
  if (!header) return;
  function update() {
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  }
  window.addEventListener("scroll", update, { passive: true });
  update();
}

/** @returns {void} */
export function initReveal() {
  const els = document.querySelectorAll(".reveal");
  if (!els.length) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
    els.forEach((el) => el.classList.add("is-visible"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -30px 0px" }
  );
  els.forEach((el) => io.observe(el));
}

/** @returns {void} */
export function setFooterYear() {
  document.querySelectorAll("[data-current-year]").forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });
}

/** @returns {void} */
export function initSite() {
  initMobileNav();
  markActiveNavLink();
  initHeaderShadow();
  initReveal();
  setFooterYear();
}

document.addEventListener("DOMContentLoaded", initSite);
