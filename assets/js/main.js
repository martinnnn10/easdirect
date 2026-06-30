/* EAS site interactions — progressive enhancement only.
   All content works without JS; this adds the mobile menu, scroll reveals,
   and friendly client-side form feedback. */
(function () {
  "use strict";

  /* ---- Mobile navigation ---------------------------------------------- */
  var toggle = document.querySelector(".nav__toggle");
  var links = document.getElementById("nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.getAttribute("data-open") === "true";
      links.setAttribute("data-open", String(!open));
      toggle.setAttribute("aria-expanded", String(!open));
    });
    // Close the menu when a link is tapped
    links.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        links.setAttribute("data-open", "false");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---- Reveal on scroll ----------------------------------------------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---- Forms ----------------------------------------------------------
     The form posts to its `action` (Formspree by default) via fetch, so the
     visitor stays on the page. Until a real endpoint is configured in
     scripts/build.mjs the action still contains "your-form-id"; in that case
     we skip the network call and just show the confirmation, so the form is
     never broken during setup. See README.md. */
  function showSuccess(form) {
    var success = form.querySelector(".form-success");
    var fields = form.querySelector(".form__fields");
    var error = form.querySelector(".form-error");
    if (error) error.classList.remove("show");
    if (fields) fields.style.display = "none";
    if (success) {
      success.classList.add("show");
      success.setAttribute("role", "status");
      success.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }
  function showError(form) {
    var error = form.querySelector(".form-error");
    if (error) {
      error.classList.add("show");
      error.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  document.querySelectorAll("form[data-form]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      var action = form.getAttribute("action") || "";
      var configured = action && action.indexOf("your-form-id") === -1;

      // Endpoint not configured yet → friendly demo confirmation.
      if (!configured) {
        showSuccess(form);
        form.reset();
        return;
      }

      var submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) submitBtn.setAttribute("aria-busy", "true");

      fetch(action, {
        method: form.getAttribute("method") || "post",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      })
        .then(function (res) {
          if (res.ok) {
            showSuccess(form);
            form.reset();
          } else {
            showError(form);
          }
        })
        .catch(function () {
          showError(form);
        })
        .finally(function () {
          if (submitBtn) submitBtn.removeAttribute("aria-busy");
        });
    });
  });

  /* ---- Footer year ----------------------------------------------------- */
  var yr = document.getElementById("yr");
  if (yr) {
    // Date.now is fine in the browser; only the build script is restricted.
    yr.textContent = new Date().getFullYear();
  }
})();
