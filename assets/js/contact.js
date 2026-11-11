/* ============================================================
   CE4CSID Toolkit v2 — Contact form
   Works out of the box with zero backend: if no Formspree
   endpoint is configured, the form composes a pre-filled email
   in the visitor's own mail app (mailto). To collect submissions
   silently instead, set FORM_ENDPOINT to a live Formspree URL.
   ============================================================ */

(function () {
  "use strict";

  // Optional: replace with BSHD's live Formspree endpoint, e.g.
  // "https://formspree.io/f/xxxxxxxx". Leave as-is to use mailto.
  var FORM_ENDPOINT = "";
  var CONTACT_EMAIL = "contactus@bshdngo.org";

  document.addEventListener("DOMContentLoaded", function () {
    var form = document.getElementById("contact-form");
    if (!form) return;

    var statusEl = document.getElementById("form-status");
    var submitBtn = form.querySelector("[type='submit']");

    function setStatus(msg, ok) {
      statusEl.textContent = msg;
      statusEl.className = "form-note " + (ok ? "is-ok" : "is-err");
    }

    form.addEventListener("submit", function (evt) {
      evt.preventDefault();
      var data = new FormData(form);

      if (!FORM_ENDPOINT) {
        var subject = "[CE4CSID Toolkit] " + (data.get("reason") || "General question");
        var body =
          "Name: " + (data.get("name") || "") + "\n" +
          "Email: " + (data.get("email") || "") + "\n" +
          "Organisation: " + (data.get("organisation") || "—") + "\n" +
          "Reason: " + (data.get("reason") || "") + "\n\n" +
          (data.get("message") || "");
        window.location.href =
          "mailto:" + CONTACT_EMAIL +
          "?subject=" + encodeURIComponent(subject) +
          "&body=" + encodeURIComponent(body);
        setStatus("Your email app should now open with the message ready to send. If it did not open, email " + CONTACT_EMAIL + " directly.", true);
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = "Sending…";
      setStatus("", true);

      fetch(FORM_ENDPOINT, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" }
      })
        .then(function (response) {
          if (response.ok) {
            form.reset();
            setStatus("Thank you. Your message has been sent, and BSHD will respond as soon as possible.", true);
            if (window.CE4CSID) window.CE4CSID.showToast("Message sent successfully.");
          } else {
            setStatus("Something went wrong sending your message. Please email " + CONTACT_EMAIL + " directly.", false);
          }
        })
        .catch(function () {
          setStatus("Something went wrong sending your message. Please email " + CONTACT_EMAIL + " directly.", false);
        })
        .finally(function () {
          submitBtn.disabled = false;
          submitBtn.textContent = "Send message";
        });
    });
  });
})();
