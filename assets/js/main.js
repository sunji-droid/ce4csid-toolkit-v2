/* ============================================================
   CE4CSID Toolkit v2 — shared site behaviour
   Mobile nav, active link, sticky header shadow, footer year,
   scroll reveal, and a reusable toast helper.
   ============================================================ */

(function () {
  "use strict";

  function initMobileNav() {
    var toggle = document.querySelector(".nav-toggle");
    var nav = document.querySelector(".primary-nav");
    if (!toggle || !nav) return;

    function close() {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    }

    toggle.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", close);
    });

    document.addEventListener("keydown", function (evt) {
      if (evt.key === "Escape") close();
    });

    document.addEventListener("click", function (evt) {
      if (nav.classList.contains("is-open") &&
          !nav.contains(evt.target) && !toggle.contains(evt.target)) {
        close();
      }
    });
  }

  function markActiveNavLink() {
    var current = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".primary-nav a[data-page]").forEach(function (link) {
      if (link.getAttribute("data-page") === current) {
        link.classList.add("is-active");
        link.setAttribute("aria-current", "page");
      }
    });
  }

  function initHeaderShadow() {
    var header = document.querySelector(".site-header");
    if (!header) return;
    function update() {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    }
    window.addEventListener("scroll", update, { passive: true });
    update();
  }

  function initReveal() {
    var els = document.querySelectorAll(".reveal");
    if (!els.length) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
        !("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -30px 0px" });
    els.forEach(function (el) { io.observe(el); });
  }

  function setFooterYear() {
    document.querySelectorAll("[data-current-year]").forEach(function (el) {
      el.textContent = new Date().getFullYear();
    });
  }

  window.CE4CSID = window.CE4CSID || {};
  window.CE4CSID.showToast = function (message) {
    var toast = document.querySelector(".toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.className = "toast";
      toast.setAttribute("role", "status");
      toast.setAttribute("aria-live", "polite");
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add("is-visible");
    window.clearTimeout(toast._timer);
    toast._timer = window.setTimeout(function () {
      toast.classList.remove("is-visible");
    }, 2800);
  };

  document.addEventListener("DOMContentLoaded", function () {
    initMobileNav();
    markActiveNavLink();
    initHeaderShadow();
    initReveal();
    setFooterYear();
  });
})();
