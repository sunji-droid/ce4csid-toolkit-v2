/* ============================================================
   CE4CSID Toolkit v2 — Community Engagement Checklist
   Five stages, twenty actions. Progress + notes + project name
   persist in localStorage. New in v2: expand/collapse all,
   JSON backup export and import, project name on the printed
   record, and a completion celebration.
   ============================================================ */

(function () {
  "use strict";

  var STORAGE_KEY = "ce4csid_checklist_v2";

  var STAGES = [
    {
      id: "design",
      title: "Project Design",
      description: "Lay the foundation for engagement before fieldwork or study design is finalised.",
      items: [
        { id: "design_scope", label: "Define the CSID issue and geographic scope in plain, non technical language", desc: "Write a short summary of the research question that a community member with no scientific background could understand and react to." },
        { id: "design_intent", label: "State why community engagement is needed for this specific project", desc: "Be explicit about what engagement is expected to change, inform, or improve, rather than treating it as a formality." },
        { id: "design_budget", label: "Set aside a dedicated budget and timeline for engagement activities", desc: "Engagement done at the last minute, with no funding of its own, is the most common cause of tokenistic involvement." },
        { id: "design_risks", label: "Identify risks of excluding affected communities from early design decisions", desc: "Consider reputational, ethical, and scientific risks, including blind spots the research team may not see on its own." }
      ]
    },
    {
      id: "stakeholders",
      title: "Stakeholder Identification",
      description: "Map who is affected, who represents them, and who holds influence or trust.",
      items: [
        { id: "stake_map", label: "Create a stakeholder map covering directly affected residents, local leaders, and service providers", desc: "Go beyond formal leadership structures. Include informal community networks, youth groups, and marginalised voices." },
        { id: "stake_gatekeepers", label: "Identify legitimate community gatekeepers and entry points", desc: "Confirm the correct protocol for approaching a community, including any traditional or local government authorities that expect to be consulted first." },
        { id: "stake_vulnerable", label: "Flag groups at heightened CSID risk who are often underrepresented", desc: "For example, informal settlement residents, outdoor workers, subsistence farmers, or people with limited access to health services." },
        { id: "stake_conflicts", label: "Note any existing tensions or history between the community and past research or health projects", desc: "Past negative experiences with researchers or government programmes will shape how the community responds to this project." }
      ]
    },
    {
      id: "planning",
      title: "Engagement Planning",
      description: "Decide how, when, and through which channels engagement will actually happen.",
      items: [
        { id: "plan_methods", label: "Select engagement methods appropriate to the context", desc: "Consider community meetings, household visits, radio, local language materials, or existing community structures such as health committees." },
        { id: "plan_schedule", label: "Build an engagement schedule aligned with the research timeline", desc: "Include time for community feedback to actually influence decisions, not only for announcing decisions already made." },
        { id: "plan_consent", label: "Prepare consent and information materials in the language and literacy level of the community", desc: "Materials should explain the CSID issue, what participation involves, and how data will be used and protected." },
        { id: "plan_feedbackloop", label: "Design a clear feedback loop for how community input will be recorded and acted on", desc: "Decide in advance who is responsible for reviewing community input and how decisions arising from it will be communicated back." }
      ]
    },
    {
      id: "implementation",
      title: "Implementation",
      description: "Carry out engagement activities and keep the relationship active throughout the project.",
      items: [
        { id: "impl_intro", label: "Hold an initial community introduction session before data collection begins", desc: "Use this session to explain the project, answer questions honestly, and confirm community willingness to proceed." },
        { id: "impl_training", label: "Brief all field staff on engagement protocols and cultural expectations", desc: "Everyone representing the project in the field should be able to explain the study and engagement process consistently." },
        { id: "impl_records", label: "Keep a running record of engagement activities, attendance, and issues raised", desc: "This record supports accountability and provides evidence for the evaluation stage." },
        { id: "impl_grievance", label: "Set up a simple channel for community members to raise concerns during the project", desc: "This can be as simple as a named contact person and phone number shared at every engagement activity." }
      ]
    },
    {
      id: "evaluation",
      title: "Feedback and Evaluation",
      description: "Close the loop with the community and capture lessons for future CSID work.",
      items: [
        { id: "eval_share", label: "Share findings back with the community in accessible, non technical form", desc: "Consider a short community meeting, a plain language summary, or a local radio segment ahead of, or alongside, any academic publication." },
        { id: "eval_input", label: "Collect community feedback on the engagement process itself", desc: "Ask what worked, what felt excluded, and what should be done differently next time." },
        { id: "eval_lessons", label: "Document lessons learned for future CSID engagement work", desc: "Add these lessons to internal guidance so the next project team does not start from zero." },
        { id: "eval_continuity", label: "Agree on how the relationship with the community will continue after the project ends", desc: "Communities frequently host repeated research. Ending well protects trust for future engagement." }
      ]
    }
  ];

  var state = { project: "", items: {}, openStages: [STAGES[0].id], celebrated: false };

  /* ---------- persistence ---------- */
  function loadState() {
    try {
      var raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        var parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object") {
          state.project = typeof parsed.project === "string" ? parsed.project : "";
          state.items = parsed.items && typeof parsed.items === "object" ? parsed.items : {};
          state.openStages = Array.isArray(parsed.openStages) ? parsed.openStages : [STAGES[0].id];
          state.celebrated = !!parsed.celebrated;
        }
      }
    } catch (err) { /* corrupted or unavailable storage: start fresh */ }
  }

  function saveState() {
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (err) { /* private mode */ }
  }

  function getItem(id) { return state.items[id] || { checked: false, note: "" }; }

  /* ---------- stats ---------- */
  function stageStats(stage) {
    var done = stage.items.filter(function (i) { return getItem(i.id).checked; }).length;
    return { total: stage.items.length, done: done };
  }

  function overallStats() {
    var total = 0, done = 0;
    STAGES.forEach(function (s) { var st = stageStats(s); total += st.total; done += st.done; });
    return { total: total, done: done, pct: total ? Math.round((done / total) * 100) : 0 };
  }

  /* ---------- rendering ---------- */
  function render() {
    var root = document.getElementById("checklist-root");
    if (!root) return;
    root.innerHTML = "";

    STAGES.forEach(function (stage, idx) {
      var stats = stageStats(stage);
      var isOpen = state.openStages.indexOf(stage.id) !== -1;

      var stageEl = document.createElement("section");
      stageEl.className = "checklist-stage" + (isOpen ? " is-open" : "");
      stageEl.dataset.stageId = stage.id;

      var head = document.createElement("button");
      head.type = "button";
      head.className = "stage-head";
      head.setAttribute("aria-expanded", isOpen ? "true" : "false");
      head.setAttribute("aria-controls", "stage-body-" + stage.id);
      head.innerHTML =
        "<h3><span class=\"stage-number\">" + (idx + 1) + "</span>" + stage.title + "</h3>" +
        "<span class=\"stage-head-right\">" +
          "<span class=\"stage-progress" + (stats.done === stats.total ? " is-complete" : "") + "\">" +
            (stats.done === stats.total ? "Complete ✓" : stats.done + " of " + stats.total) +
          "</span>" +
          '<svg class="stage-caret" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>' +
        "</span>";
      head.addEventListener("click", function () {
        var i = state.openStages.indexOf(stage.id);
        if (i === -1) state.openStages.push(stage.id); else state.openStages.splice(i, 1);
        saveState();
        stageEl.classList.toggle("is-open");
        head.setAttribute("aria-expanded", stageEl.classList.contains("is-open") ? "true" : "false");
      });

      var body = document.createElement("div");
      body.className = "stage-body";
      body.id = "stage-body-" + stage.id;

      var desc = document.createElement("p");
      desc.className = "stage-desc";
      desc.textContent = stage.description;
      body.appendChild(desc);

      stage.items.forEach(function (item) {
        var itemState = getItem(item.id);
        var itemEl = document.createElement("div");
        itemEl.className = "check-item" + (itemState.checked ? " is-checked" : "");

        var checkboxId = "check_" + item.id;
        var checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = checkboxId;
        checkbox.checked = itemState.checked;

        var bodyDiv = document.createElement("div");
        bodyDiv.className = "check-item-body";

        var label = document.createElement("label");
        label.setAttribute("for", checkboxId);
        label.textContent = item.label;

        var descP = document.createElement("p");
        descP.className = "item-desc";
        descP.textContent = item.desc;

        var noteField = document.createElement("textarea");
        noteField.className = "note-field no-print";
        noteField.placeholder = "Add a note for this item (optional)";
        noteField.rows = 1;
        noteField.value = itemState.note;
        noteField.setAttribute("aria-label", "Notes for: " + item.label);

        var printNote = document.createElement("p");
        printNote.className = "print-note" + (itemState.note ? " has-note" : "");
        printNote.textContent = itemState.note ? "Note: " + itemState.note : "";

        checkbox.addEventListener("change", function () {
          var s = getItem(item.id);
          s.checked = checkbox.checked;
          state.items[item.id] = s;
          saveState();
          itemEl.classList.toggle("is-checked", checkbox.checked);
          refreshProgress();
        });

        noteField.addEventListener("input", function () {
          var s = getItem(item.id);
          s.note = noteField.value;
          state.items[item.id] = s;
          saveState();
          printNote.textContent = noteField.value ? "Note: " + noteField.value : "";
          printNote.classList.toggle("has-note", !!noteField.value);
        });

        bodyDiv.appendChild(label);
        bodyDiv.appendChild(descP);
        bodyDiv.appendChild(noteField);
        bodyDiv.appendChild(printNote);
        itemEl.appendChild(checkbox);
        itemEl.appendChild(bodyDiv);
        body.appendChild(itemEl);
      });

      stageEl.appendChild(head);
      stageEl.appendChild(body);
      root.appendChild(stageEl);
    });

    refreshProgress();
  }

  function refreshProgress() {
    var stats = overallStats();
    var fill = document.querySelector(".progress-fill");
    var count = document.querySelector("[data-progress-count]");
    var pct = document.querySelector("[data-progress-pct]");
    if (fill) {
      fill.style.width = stats.pct + "%";
      fill.classList.toggle("is-complete", stats.pct === 100);
    }
    if (count) count.textContent = stats.done + " of " + stats.total + " actions complete";
    if (pct) pct.textContent = stats.pct + "%";

    STAGES.forEach(function (stage) {
      var st = stageStats(stage);
      var el = document.querySelector('.checklist-stage[data-stage-id="' + stage.id + '"] .stage-progress');
      if (el) {
        el.textContent = st.done === st.total ? "Complete ✓" : st.done + " of " + st.total;
        el.classList.toggle("is-complete", st.done === st.total);
      }
    });

    if (stats.pct === 100 && !state.celebrated) {
      state.celebrated = true;
      saveState();
      toast("All 20 actions complete — engagement plan ready. 🎉");
    }
    if (stats.pct < 100 && state.celebrated) {
      state.celebrated = false;
      saveState();
    }
  }

  function toast(msg) {
    if (window.CE4CSID && window.CE4CSID.showToast) window.CE4CSID.showToast(msg);
  }

  /* ---------- toolbar actions ---------- */
  function setAllStages(open) {
    state.openStages = open ? STAGES.map(function (s) { return s.id; }) : [];
    saveState();
    document.querySelectorAll(".checklist-stage").forEach(function (el) {
      el.classList.toggle("is-open", open);
      var head = el.querySelector(".stage-head");
      if (head) head.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  function resetChecklist() {
    if (!window.confirm("This will clear every checked item, note, and the project name on this device. Continue?")) return;
    state = { project: "", items: {}, openStages: [STAGES[0].id], celebrated: false };
    saveState();
    var projectInput = document.getElementById("project-name");
    if (projectInput) projectInput.value = "";
    render();
    toast("Checklist has been reset.");
  }

  function exportJSON() {
    var payload = {
      app: "ce4csid-community-engagement-checklist",
      version: 2,
      exportedAt: new Date().toISOString(),
      project: state.project,
      items: state.items
    };
    var blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    var a = document.createElement("a");
    var slug = (state.project || "engagement-checklist").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "engagement-checklist";
    a.href = URL.createObjectURL(blob);
    a.download = slug + "-backup.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(a.href);
    toast("Backup downloaded. Keep it safe or move it to another device.");
  }

  function importJSON(file) {
    var reader = new FileReader();
    reader.onload = function () {
      try {
        var parsed = JSON.parse(reader.result);
        if (!parsed || parsed.app !== "ce4csid-community-engagement-checklist" || typeof parsed.items !== "object") {
          throw new Error("not a checklist backup");
        }
        state.project = typeof parsed.project === "string" ? parsed.project : "";
        state.items = parsed.items || {};
        state.celebrated = false;
        saveState();
        var projectInput = document.getElementById("project-name");
        if (projectInput) projectInput.value = state.project;
        render();
        toast("Backup restored successfully.");
      } catch (err) {
        toast("That file is not a valid checklist backup.");
      }
    };
    reader.readAsText(file);
  }

  function initToolbar() {
    var projectInput = document.getElementById("project-name");
    if (projectInput) {
      projectInput.value = state.project;
      projectInput.addEventListener("input", function () {
        state.project = projectInput.value;
        saveState();
      });
    }

    on("[data-action='reset-checklist']", "click", resetChecklist);
    on("[data-action='print-checklist']", "click", function () { window.print(); });
    on("[data-action='expand-all']", "click", function () { setAllStages(true); });
    on("[data-action='collapse-all']", "click", function () { setAllStages(false); });
    on("[data-action='export-json']", "click", exportJSON);

    var importInput = document.getElementById("import-file");
    on("[data-action='import-json']", "click", function () {
      if (importInput) importInput.click();
    });
    if (importInput) {
      importInput.addEventListener("change", function () {
        if (importInput.files && importInput.files[0]) importJSON(importInput.files[0]);
        importInput.value = "";
      });
    }

    window.addEventListener("beforeprint", function () { setAllStages(true); });
  }

  function on(selector, evt, fn) {
    var el = document.querySelector(selector);
    if (el) el.addEventListener(evt, fn);
  }

  document.addEventListener("DOMContentLoaded", function () {
    if (!document.getElementById("checklist-root")) return;
    loadState();
    render();
    initToolbar();
  });
})();
