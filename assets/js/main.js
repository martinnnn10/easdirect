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

  /* ---- Forms: client-side confirmation --------------------------------
     There is no backend wired up yet. On submit we show a success message
     so the page feels complete. Replace the handler (or the form action)
     with your real endpoint — see README.md. */
  document.querySelectorAll("form[data-demo]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      var success = form.querySelector(".form-success");
      var fields = form.querySelector(".form__fields");
      if (success) {
        if (fields) fields.style.display = "none";
        success.classList.add("show");
        success.setAttribute("role", "status");
        success.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      form.reset();
    });
  });

  /* ---- Footer year ----------------------------------------------------- */
  var yr = document.getElementById("yr");
  if (yr) {
    // Date.now is fine in the browser; only the build script is restricted.
    yr.textContent = new Date().getFullYear();
  }
})();
