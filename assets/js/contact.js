// @ts-check
/**
 * Contact form.
 * Works out of the box with zero backend: if no Formspree endpoint is
 * configured, the form composes a pre-filled email in the visitor's own
 * mail app (mailto). To collect submissions silently instead, set
 * FORM_ENDPOINT to a live Formspree URL.
 */
import { showToast } from "./util.js";

/** Optional live Formspree endpoint, e.g. "https://formspree.io/f/xxxxxxxx". */
const FORM_ENDPOINT = "";
const CONTACT_EMAIL = "wg-ce4csid@csidnet.org";

/**
 * @typedef {Object} ContactFields
 * @property {string} name
 * @property {string} email
 * @property {string} organisation
 * @property {string} reason
 * @property {string} message
 */

/**
 * Build a mailto URL from contact fields.
 * @param {ContactFields} fields
 * @param {string} [contactEmail]
 * @returns {string}
 */
export function buildMailto(fields, contactEmail = CONTACT_EMAIL) {
  const subject = "[CE4CSID Toolkit] " + (fields.reason || "General question");
  const body =
    "Name: " +
    fields.name +
    "\n" +
    "Email: " +
    fields.email +
    "\n" +
    "Organisation: " +
    (fields.organisation || "Not provided") +
    "\n" +
    "Reason: " +
    fields.reason +
    "\n\n" +
    fields.message;
  return (
    "mailto:" +
    contactEmail +
    "?subject=" +
    encodeURIComponent(subject) +
    "&body=" +
    encodeURIComponent(body)
  );
}

/**
 * Read contact fields from a form.
 * @param {HTMLFormElement} form
 * @returns {ContactFields}
 */
export function readContactFields(form) {
  const data = new FormData(form);
  /** @param {string} key */
  const get = (key) => String(data.get(key) || "");
  return {
    name: get("name"),
    email: get("email"),
    organisation: get("organisation"),
    reason: get("reason"),
    message: get("message"),
  };
}

/**
 * Initialise the contact form. Safe to call when the form is absent.
 * @param {string} [endpoint] Override the configured endpoint (used by tests).
 * @returns {void}
 */
export function initContactForm(endpoint = FORM_ENDPOINT) {
  const form = /** @type {HTMLFormElement | null} */ (document.getElementById("contact-form"));
  if (!form) return;
  const statusEl = document.getElementById("form-status");
  const submitBtn = /** @type {HTMLButtonElement | null} */ (form.querySelector("[type='submit']"));

  /** @param {string} msg @param {boolean} ok */
  function setStatus(msg, ok) {
    if (!statusEl) return;
    statusEl.textContent = msg;
    statusEl.className = "form-note " + (ok ? "is-ok" : "is-err");
  }

  form.addEventListener("submit", (evt) => {
    evt.preventDefault();
    const fields = readContactFields(form);

    if (!endpoint) {
      window.location.href = buildMailto(fields);
      setStatus(
        "Your email app should now open with the message ready to send. If it did not open, email " +
          CONTACT_EMAIL +
          " directly.",
        true
      );
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending...";
    }
    setStatus("", true);

    fetch(endpoint, {
      method: "POST",
      body: new FormData(form),
      headers: { Accept: "application/json" },
    })
      .then((response) => {
        if (response.ok) {
          form.reset();
          setStatus(
            "Thank you. Your message has been sent, and the toolkit team will respond as soon as possible.",
            true
          );
          showToast("Message sent successfully.");
        } else {
          setStatus(
            "Something went wrong sending your message. Please email " +
              CONTACT_EMAIL +
              " directly.",
            false
          );
        }
      })
      .catch(() => {
        setStatus(
          "Something went wrong sending your message. Please email " + CONTACT_EMAIL + " directly.",
          false
        );
      })
      .finally(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = "Send message";
        }
      });
  });
}

document.addEventListener("DOMContentLoaded", () => initContactForm());
