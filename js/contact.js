/**
 * Contact page form behavior. This site has no backend, so the form either
 * opens a pre-filled email draft (when SITE_CONFIG.contact.email is set)
 * or clearly tells the visitor it is a demonstration only.
 */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("contactForm");
    if (!form) return;

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      const status = document.getElementById("formStatus");
      const name = document.getElementById("contactName").value.trim();
      const email = document.getElementById("contactEmail").value.trim();
      const message = document.getElementById("contactMessage").value.trim();

      const destinationEmail = typeof SITE_CONFIG !== "undefined" && SITE_CONFIG.contact
        ? SITE_CONFIG.contact.email
        : "";

      if (destinationEmail) {
        const subject = encodeURIComponent("Message from " + name + " via Kevin's Panciteria website");
        const body = encodeURIComponent(message + "\n\nReply to: " + email);
        window.location.href = "mailto:" + destinationEmail + "?subject=" + subject + "&body=" + body;
        if (status) status.textContent = "Opening your email app to send this message…";
      } else {
        if (status) {
          status.textContent = "This form is a demonstration only. No contact email is configured yet — please check back soon or reach us via social media.";
        }
      }
    });
  });
})();
