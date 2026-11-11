/* ============================================================
   CE4CSID Toolkit v2 — Resources page
   Live search + category filters over CE4CSID_RESOURCES.
   Grouped browse view by default; flat results while searching
   or filtering. Deep-linkable via ?category= and ?q=.
   ============================================================ */

(function () {
  "use strict";

  var DATA = window.CE4CSID_RESOURCES || [];
  var CATS = window.CE4CSID_CATEGORIES || [];
  var state = { q: "", category: "all" };

  function catById(id) {
    for (var i = 0; i < CATS.length; i++) if (CATS[i].id === id) return CATS[i];
    return { title: id, color: "lime" };
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function matches(res) {
    if (state.category !== "all" && res.category !== state.category) return false;
    if (!state.q) return true;
    var hay = (res.title + " " + res.description + " " + catById(res.category).title + " " + res.type).toLowerCase();
    return state.q.toLowerCase().split(/\s+/).every(function (word) {
      return hay.indexOf(word) !== -1;
    });
  }

  function cardHTML(res) {
    var cat = catById(res.category);
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

  function render() {
    var root = document.getElementById("resources-root");
    var countEl = document.getElementById("result-count");
    if (!root) return;

    var visible = DATA.filter(matches);
    var browsing = !state.q && state.category === "all";

    if (countEl) {
      countEl.textContent = browsing
        ? DATA.length + " resources across " + CATS.length + " categories"
        : visible.length + (visible.length === 1 ? " resource" : " resources") + " found";
    }

    if (!visible.length) {
      root.innerHTML =
        '<div class="no-results">' +
          "<h3>No resources match your search</h3>" +
          "<p>Try a different word, or clear the filters to browse everything.</p>" +
          '<button type="button" class="btn btn-primary btn-sm" id="clear-filters">Clear search and filters</button>' +
        "</div>";
      var clearBtn = document.getElementById("clear-filters");
      if (clearBtn) clearBtn.addEventListener("click", function () {
        state.q = ""; state.category = "all";
        var input = document.getElementById("resource-search");
        if (input) input.value = "";
        syncUI(); render();
      });
      return;
    }

    var html = "";
    if (browsing) {
      CATS.forEach(function (cat) {
        var items = visible.filter(function (r) { return r.category === cat.id; });
        if (!items.length) return;
        html +=
          '<section class="resource-group" id="' + esc(cat.id) + '" aria-labelledby="' + esc(cat.id) + '-heading">' +
            '<div class="resource-group-head">' +
              '<h2 id="' + esc(cat.id) + '-heading">' + esc(cat.title) + "</h2>" +
              '<span class="count">' + items.length + " resources</span>" +
            "</div>" +
            '<p class="resource-group-desc">' + esc(cat.description) + "</p>" +
            '<div class="resource-grid">' + items.map(cardHTML).join("") + "</div>" +
          "</section>";
      });
    } else {
      html = '<div class="resource-grid">' + visible.map(cardHTML).join("") + "</div>";
    }
    root.innerHTML = html;
  }

  function syncUI() {
    document.querySelectorAll(".filter-pill[data-category]").forEach(function (pill) {
      pill.setAttribute("aria-pressed", pill.getAttribute("data-category") === state.category ? "true" : "false");
    });
    var clear = document.getElementById("search-clear");
    if (clear) clear.classList.toggle("is-visible", !!state.q);

    var params = new URLSearchParams();
    if (state.category !== "all") params.set("category", state.category);
    if (state.q) params.set("q", state.q);
    var qs = params.toString();
    var url = window.location.pathname + (qs ? "?" + qs : "");
    try { window.history.replaceState(null, "", url); } catch (e) { /* file:// */ }
  }

  document.addEventListener("DOMContentLoaded", function () {
    var root = document.getElementById("resources-root");
    if (!root) return;

    var params = new URLSearchParams(window.location.search);
    state.q = (params.get("q") || "").trim();
    var cat = params.get("category");
    state.category = (cat && catById(cat).title !== cat) ? cat : "all";

    var input = document.getElementById("resource-search");
    if (input) {
      input.value = state.q;
      var timer;
      input.addEventListener("input", function () {
        window.clearTimeout(timer);
        timer = window.setTimeout(function () {
          state.q = input.value.trim();
          syncUI(); render();
        }, 120);
      });
    }

    var clear = document.getElementById("search-clear");
    if (clear) clear.addEventListener("click", function () {
      state.q = "";
      if (input) { input.value = ""; input.focus(); }
      syncUI(); render();
    });

    document.querySelectorAll(".filter-pill[data-category]").forEach(function (pill) {
      pill.addEventListener("click", function () {
        state.category = pill.getAttribute("data-category");
        syncUI(); render();
      });
    });

    syncUI();
    render();
  });
})();
