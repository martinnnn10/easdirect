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

      // No form backend configured yet → fall back to a pre-filled email so the
      // request still reaches the team. Set FORM.endpoint (Formspree) for
      // seamless one-click delivery instead — see README.
      if (!configured) {
        var to = form.getAttribute("data-mailto");
        if (to) {
          var data = new FormData(form);
          var lines = [];
          data.forEach(function (val, key) {
            if (key.charAt(0) === "_" || !String(val).trim()) return;
            var label = key.charAt(0).toUpperCase() + key.slice(1);
            lines.push(label + ": " + val);
          });
          var subject = "Candidate request from " + (data.get("company") || "website");
          var href =
            "mailto:" + to +
            "?subject=" + encodeURIComponent(subject) +
            "&body=" + encodeURIComponent(lines.join("\n"));
          window.location.href = href;
        }
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

  /* ---- Image fallback --------------------------------------------------
     If any image fails to load (e.g. a dead stock URL), hide it so it
     degrades to a clean dark panel instead of a broken-image icon. */
  window.addEventListener(
    "error",
    function (e) {
      var t = e.target;
      if (t && t.tagName === "IMG") { t.style.visibility = "hidden"; }
    },
    true
  );

  /* ---- Footer year ----------------------------------------------------- */
  var yr = document.getElementById("yr");
  if (yr) {
    // Date.now is fine in the browser; only the build script is restricted.
    yr.textContent = new Date().getFullYear();
  }
})();
