/**
 * Shared navigation, footer, and branding interactions used on every page.
 * Depends on SITE_CONFIG from js/config.js (load config.js before this file).
 */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    initMobileNav();
    initBranding();
    initFooterContact();
    initActiveNavLink();
    initSmoothAnchors();
    initCurrentYear();
  });

  /** Accessible hamburger menu: toggles on click, closes on Escape / outside click / link choice. */
  function initMobileNav() {
    const toggle = document.getElementById("navToggle");
    const nav = document.getElementById("primaryNav");
    if (!toggle || !nav) return;

    function closeNav() {
      toggle.setAttribute("aria-expanded", "false");
      nav.classList.remove("is-open");
      document.body.classList.remove("nav-open");
    }

    function openNav() {
      toggle.setAttribute("aria-expanded", "true");
      nav.classList.add("is-open");
      document.body.classList.add("nav-open");
    }

    toggle.addEventListener("click", function () {
      const isOpen = toggle.getAttribute("aria-expanded") === "true";
      if (isOpen) {
        closeNav();
      } else {
        openNav();
      }
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeNav);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        closeNav();
        toggle.focus();
      }
    });

    document.addEventListener("click", function (event) {
      const isOpen = toggle.getAttribute("aria-expanded") === "true";
      if (!isOpen) return;
      if (!nav.contains(event.target) && event.target !== toggle) {
        closeNav();
      }
    });

    // Reset nav state when resizing back up to desktop.
    window.addEventListener("resize", function () {
      if (window.innerWidth > 860) {
        closeNav();
      }
    });
  }

  /** Shows the configured logo image when available, otherwise keeps the text wordmark visible. */
  function initBranding() {
    if (typeof SITE_CONFIG === "undefined") return;
    const logoImg = document.getElementById("brandLogoImg");
    const wordmark = document.querySelectorAll(".brand-wordmark");

    if (SITE_CONFIG.logo && SITE_CONFIG.logo.imagePath && logoImg) {
      logoImg.src = SITE_CONFIG.logo.imagePath;
      logoImg.alt = SITE_CONFIG.logo.altText || SITE_CONFIG.restaurantName;
      logoImg.hidden = false;
      logoImg.addEventListener("error", function () {
        logoImg.hidden = true;
      });
      wordmark.forEach(function (el) {
        el.hidden = true;
      });
    }

    document.querySelectorAll("[data-restaurant-name]").forEach(function (el) {
      el.textContent = SITE_CONFIG.restaurantName;
    });
  }

  /**
   * Populates every contact/social/hours placeholder on the page from SITE_CONFIG.
   * Uses data-attributes (rather than fixed IDs) so the same placeholders can
   * appear more than once per page (e.g. homepage preview + footer).
   */
  function initFooterContact() {
    if (typeof SITE_CONFIG === "undefined") return;
    const contact = SITE_CONFIG.contact || {};
    const social = SITE_CONFIG.social || {};

    setContactRows("address", contact.address);
    setContactRows("phone", contact.phone, function (value) {
      return "tel:" + value.replace(/[^\d+]/g, "");
    });
    setContactRows("email", contact.email, function (value) {
      return "mailto:" + value;
    });

    const hasContact = !!(contact.address || contact.phone || contact.email);
    toggleAll("[data-contact-placeholder]", hasContact);

    const socialEntries = [
      { key: "facebook", url: social.facebook },
      { key: "instagram", url: social.instagram },
      { key: "tiktok", url: social.tiktok }
    ];
    let hasSocial = false;
    socialEntries.forEach(function (entry) {
      document.querySelectorAll('[data-social-link="' + entry.key + '"]').forEach(function (el) {
        if (entry.url) {
          el.href = entry.url;
          el.hidden = false;
          hasSocial = true;
        } else {
          el.hidden = true;
        }
      });
    });
    toggleAll("[data-social-placeholder]", hasSocial);

    document.querySelectorAll("[data-map-link]").forEach(function (el) {
      if (contact.mapUrl) {
        el.href = contact.mapUrl;
        el.hidden = false;
      } else {
        el.hidden = true;
      }
    });

    renderHours();
  }

  function setContactRows(type, value, hrefBuilder) {
    document.querySelectorAll('[data-contact-row="' + type + '"]').forEach(function (row) {
      if (!value) {
        row.hidden = true;
        return;
      }
      row.hidden = false;
      const valueEl = row.querySelector("[data-contact-value]");
      if (!valueEl) return;
      if (hrefBuilder && valueEl.tagName === "A") {
        valueEl.href = hrefBuilder(value);
      }
      valueEl.textContent = value;
    });
  }

  function toggleAll(selector, isResolved) {
    document.querySelectorAll(selector).forEach(function (el) {
      el.hidden = isResolved;
    });
  }

  function renderHours() {
    const hours = (typeof SITE_CONFIG !== "undefined" && SITE_CONFIG.hours) || [];
    document.querySelectorAll("[data-hours-list]").forEach(function (list) {
      list.innerHTML = "";
      hours.forEach(function (entry) {
        const li = document.createElement("li");
        const dayEl = document.createElement("span");
        dayEl.textContent = entry.day;
        const timeEl = document.createElement("span");
        timeEl.textContent = entry.time || "Hours coming soon";
        li.appendChild(dayEl);
        li.appendChild(timeEl);
        list.appendChild(li);
      });
    });
  }

  /** Marks the nav link matching the current page as active for sighted and assistive-tech users. */
  function initActiveNavLink() {
    const current = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".primary-nav a").forEach(function (link) {
      const href = link.getAttribute("href").split("#")[0] || "index.html";
      if (href === current) {
        link.classList.add("is-active");
        link.setAttribute("aria-current", "page");
      }
    });
  }

  /** Smooth-scrolls same-page hash links while respecting reduced-motion preference. */
  function initSmoothAnchors() {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.querySelectorAll('a[href*="#"]').forEach(function (link) {
      link.addEventListener("click", function (event) {
        const [path, hash] = link.getAttribute("href").split("#");
        if (!hash) return;
        const currentPage = window.location.pathname.split("/").pop() || "index.html";
        const targetsThisPage = !path || path === currentPage || path === "";
        if (!targetsThisPage) return;
        const target = document.getElementById(hash);
        if (!target) return;
        event.preventDefault();
        target.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });
        target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll: true });
      });
    });
  }

  function initCurrentYear() {
    const yearEl = document.getElementById("currentYear");
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  }
})();
