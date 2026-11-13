import { test, after } from "node:test";
import assert from "node:assert/strict";
import { loadPage, cleanup } from "./helpers/dom.js";

loadPage("contact.html");
const { buildMailto, readContactFields, initContactForm } = await import("../assets/js/contact.js");

after(cleanup);

const fields = {
  name: "Kabo",
  email: "kabo@example.test",
  organisation: "CSID Network",
  reason: "Feedback on a resource",
  message: "Please add a consent template.",
};

test("buildMailto encodes subject and body and defaults the reason", () => {
  const url = buildMailto(fields);
  assert.ok(url.startsWith("mailto:wg-ce4csid@csidnet.org?"));
  assert.ok(
    url.includes("subject=" + encodeURIComponent("[CE4CSID Toolkit] Feedback on a resource"))
  );
  assert.ok(url.includes(encodeURIComponent("Kabo")));
  const noReason = buildMailto({ ...fields, reason: "" });
  assert.ok(noReason.includes(encodeURIComponent("[CE4CSID Toolkit] General question")));
  const custom = buildMailto(fields, "other@example.test");
  assert.ok(custom.startsWith("mailto:other@example.test?"));
});

test("readContactFields pulls every named field from the form", () => {
  loadPage("contact.html");
  const form = document.getElementById("contact-form");
  form.elements.name.value = fields.name;
  form.elements.email.value = fields.email;
  form.elements.organisation.value = fields.organisation;
  form.elements.reason.value = fields.reason;
  form.elements.message.value = fields.message;
  assert.deepEqual(readContactFields(form), fields);
});

/** @param {import("jsdom").JSDOM} _dom */
function fillForm(_dom) {
  const form = document.getElementById("contact-form");
  form.elements.name.value = fields.name;
  form.elements.email.value = fields.email;
  form.elements.reason.value = fields.reason;
  form.elements.message.value = fields.message;
  return form;
}

test("initContactForm composes a mailto and shows guidance on submit", () => {
  loadPage("contact.html");
  initContactForm();
  const form = fillForm();
  form.dispatchEvent(new window.Event("submit", { bubbles: true, cancelable: true }));
  const status = document.getElementById("form-status");
  assert.ok(status.textContent.includes("email app"));
  assert.ok(status.className.includes("is-ok"));
});

test("initContactForm posts to a configured endpoint (stubbed fetch, success)", async () => {
  loadPage("contact.html");
  /** @type {unknown[]} */
  const calls = [];
  global.fetch = async (url, opts) => {
    calls.push({ url, opts });
    return { ok: true };
  };
  initContactForm("https://endpoint.test/submit");
  const form = fillForm();
  form.dispatchEvent(new window.Event("submit", { bubbles: true, cancelable: true }));
  await new Promise((r) => setImmediate(r));
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, "https://endpoint.test/submit");
  assert.ok(document.getElementById("form-status").textContent.includes("Thank you"));
});

test("initContactForm surfaces a failure from the endpoint (stubbed fetch)", async () => {
  loadPage("contact.html");
  global.fetch = async () => ({ ok: false });
  initContactForm("https://endpoint.test/submit");
  const form = fillForm();
  form.dispatchEvent(new window.Event("submit", { bubbles: true, cancelable: true }));
  await new Promise((r) => setImmediate(r));
  assert.ok(document.getElementById("form-status").className.includes("is-err"));
});

test("initContactForm handles a network rejection (stubbed fetch)", async () => {
  loadPage("contact.html");
  global.fetch = async () => {
    throw new Error("offline");
  };
  initContactForm("https://endpoint.test/submit");
  const form = fillForm();
  form.dispatchEvent(new window.Event("submit", { bubbles: true, cancelable: true }));
  await new Promise((r) => setImmediate(r));
  assert.ok(document.getElementById("form-status").className.includes("is-err"));
});
