(function () {
  "use strict";

  var portrait = document.querySelector("[data-landing-reveal]");

  if (!portrait) {
    return;
  }

  var touchArmed = false;

  function moveReveal(event) {
    if (event.pointerType === "touch") {
      return;
    }

    var bounds = portrait.getBoundingClientRect();
    var rawX = event.clientX - bounds.left;
    var rawY = event.clientY - bounds.top;
    var x = Math.max(bounds.width * 0.04, Math.min(rawX, bounds.width * 0.96));
    var y = Math.max(bounds.height * 0.16, Math.min(rawY, bounds.height * 0.84));
    var horizontal = (rawX / bounds.width) - 0.5;
    var vertical = (rawY / bounds.height) - 0.5;

    portrait.style.setProperty("--reveal-x", x + "px");
    portrait.style.setProperty("--reveal-y", y + "px");
    portrait.style.setProperty("--line-shift-x", (horizontal * -7).toFixed(2) + "px");
    portrait.style.setProperty("--line-shift-y", (vertical * -5).toFixed(2) + "px");
    portrait.style.setProperty("--line-rotate", (horizontal * -0.7).toFixed(2) + "deg");
    portrait.style.setProperty("--photo-shift-x", (horizontal * 10).toFixed(2) + "px");
    portrait.style.setProperty("--photo-shift-y", (vertical * 7).toFixed(2) + "px");
    portrait.style.setProperty("--photo-rotate", (horizontal * 1.1).toFixed(2) + "deg");
  }

  function resetLayers() {
    portrait.style.setProperty("--line-shift-x", "0px");
    portrait.style.setProperty("--line-shift-y", "0px");
    portrait.style.setProperty("--line-rotate", "0deg");
    portrait.style.setProperty("--photo-shift-x", "0px");
    portrait.style.setProperty("--photo-shift-y", "0px");
    portrait.style.setProperty("--photo-rotate", "0deg");
  }

  portrait.addEventListener("pointerenter", function (event) {
    if (event.pointerType === "touch") {
      return;
    }

    moveReveal(event);
    portrait.classList.add("is-interacting");
  });

  portrait.addEventListener("pointermove", moveReveal);

  portrait.addEventListener("pointerleave", function () {
    portrait.classList.remove("is-interacting");
    resetLayers();
  });

  portrait.addEventListener("focus", function () {
    portrait.classList.add("is-interacting");
  });

  portrait.addEventListener("blur", function () {
    portrait.classList.remove("is-interacting");
    resetLayers();
  });

  portrait.addEventListener("click", function (event) {
    if (!window.matchMedia("(hover: none)").matches || touchArmed) {
      return;
    }

    event.preventDefault();
    touchArmed = true;
    portrait.classList.add("is-interacting");
  });

  document.addEventListener("pointerdown", function (event) {
    if (!touchArmed || portrait.contains(event.target)) {
      return;
    }

    touchArmed = false;
    portrait.classList.remove("is-interacting");
    resetLayers();
  });
})();
