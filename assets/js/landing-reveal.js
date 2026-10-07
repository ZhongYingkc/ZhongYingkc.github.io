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
    var x = event.clientX - bounds.left;
    var y = event.clientY - bounds.top;

    portrait.style.setProperty("--reveal-x", x + "px");
    portrait.style.setProperty("--reveal-y", y + "px");
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
  });

  portrait.addEventListener("focus", function () {
    portrait.classList.add("is-interacting");
  });

  portrait.addEventListener("blur", function () {
    portrait.classList.remove("is-interacting");
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
  });
})();
