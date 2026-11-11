/* ============================================================
   CE4CSID Toolkit v2 — Downloads page
   Renders the full file table from CE4CSID_RESOURCES with a
   live filter box. Same data source as the Resources page.
   ============================================================ */

(function () {
  "use strict";

  var DATA = window.CE4CSID_RESOURCES || [];
  var CATS = window.CE4CSID_CATEGORIES || [];
  var COLOR_VAR = {
    lime: "var(--csid-lime)",
    blue: "var(--csid-blue)",
    purple: "var(--csid-purple)",
    yellow: "var(--csid-yellow)"
  };

  function catById(id) {
    for (var i = 0; i < CATS.length; i++) if (CATS[i].id === id) return CATS[i];
    return { title: id, color: "lime" };
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function render(query) {
    var tbody = document.getElementById("downloads-tbody");
    var countEl = document.getElementById("downloads-count");
    if (!tbody) return;
    var q = (query || "").trim().toLowerCase();

    var rows = DATA.filter(function (res) {
      if (!q) return true;
      var hay = (res.title + " " + catById(res.category).title + " " + res.type).toLowerCase();
      return q.split(/\s+/).every(function (w) { return hay.indexOf(w) !== -1; });
    });

    if (countEl) {
      countEl.textContent = q
        ? rows.length + (rows.length === 1 ? " file" : " files") + " found"
        : "All " + DATA.length + " toolkit files";
    }

    if (!rows.length) {
      tbody.innerHTML =
        '<tr><td colspan="5" style="text-align:center; padding:40px 20px; color:var(--ink-soft);">' +
        "No files match your search. Try a different word.</td></tr>";
      return;
    }

    tbody.innerHTML = rows.map(function (res) {
      var cat = catById(res.category);
      return (
        "<tr>" +
          '<td class="dl-title">' + esc(res.title) + "</td>" +
          '<td class="dl-soft"><span class="dl-cat-dot" style="background:' + (COLOR_VAR[cat.color] || COLOR_VAR.lime) + '"></span>' + esc(cat.title) + "</td>" +
          '<td class="dl-soft">' + esc(res.type) + "</td>" +
          '<td class="dl-soft">' + esc(res.size) + "</td>" +
          '<td><a class="btn btn-ghost btn-sm" href="' + esc(res.file) + '" download aria-label="Download ' + esc(res.title) + '">Download</a></td>' +
        "</tr>"
      );
    }).join("");
  }

  document.addEventListener("DOMContentLoaded", function () {
    if (!document.getElementById("downloads-tbody")) return;
    render("");
    var input = document.getElementById("downloads-search");
    if (input) {
      var timer;
      input.addEventListener("input", function () {
        window.clearTimeout(timer);
        timer = window.setTimeout(function () { render(input.value); }, 120);
      });
    }
  });
})();
