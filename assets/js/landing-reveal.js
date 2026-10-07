(function () {
  "use strict";

  var portrait = document.querySelector("[data-landing-reveal]");

  if (!portrait) {
    return;
  }

  var canvas = portrait.querySelector(".landing-portrait__canvas");
  var photo = portrait.querySelector(".landing-portrait__source");
  var context = canvas && canvas.getContext ? canvas.getContext("2d") : null;

  if (!canvas || !photo || !context) {
    return;
  }

  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var touchArmed = false;
  var animationFrame = null;
  var width = 0;
  var height = 0;
  var pixelRatio = 1;

  var state = {
    x: 0.5,
    y: 0.36,
    xVelocity: 0,
    yVelocity: 0,
    targetX: 0.5,
    targetY: 0.36,
    open: 0,
    openVelocity: 0,
    targetOpen: 0
  };

  function clamp(value, minimum, maximum) {
    return Math.max(minimum, Math.min(value, maximum));
  }

  function resizeCanvas() {
    var bounds = portrait.getBoundingClientRect();
    var nextWidth = Math.max(1, bounds.width);
    var nextHeight = Math.max(1, bounds.height);
    var nextRatio = Math.min(window.devicePixelRatio || 1, 2);

    if (nextWidth === width && nextHeight === height && nextRatio === pixelRatio) {
      return;
    }

    width = nextWidth;
    height = nextHeight;
    pixelRatio = nextRatio;
    canvas.width = Math.round(width * pixelRatio);
    canvas.height = Math.round(height * pixelRatio);
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  }

  function spring(valueKey, velocityKey, target, stiffness, damping) {
    state[velocityKey] += (target - state[valueKey]) * stiffness;
    state[velocityKey] *= damping;
    state[valueKey] += state[velocityKey];
  }

  function createFluidPath(centerX, centerY, halfWidth, halfHeight, time, phaseOffset) {
    var phase = (time * 0.0018) + phaseOffset;
    var left = centerX - halfWidth;
    var right = centerX + halfWidth;
    var topWaveA = Math.sin(phase) * halfHeight * 0.13;
    var topWaveB = Math.sin((phase * 1.37) + 1.1) * halfHeight * 0.1;
    var bottomWaveA = Math.sin((phase * 1.19) + 2.2) * halfHeight * 0.12;
    var bottomWaveB = Math.sin((phase * 1.53) + 3.4) * halfHeight * 0.09;
    var sideWave = Math.sin((phase * 0.83) + 0.7) * halfHeight * 0.1;
    var path = new Path2D();

    path.moveTo(left, centerY + sideWave);
    path.bezierCurveTo(
      left + (halfWidth * 0.12), centerY - (halfHeight * 0.72) + topWaveA,
      centerX - (halfWidth * 0.48), centerY - halfHeight + topWaveB,
      centerX, centerY - halfHeight - topWaveA
    );
    path.bezierCurveTo(
      centerX + (halfWidth * 0.46), centerY - halfHeight + topWaveA,
      right - (halfWidth * 0.1), centerY - (halfHeight * 0.68) - topWaveB,
      right, centerY - sideWave
    );
    path.bezierCurveTo(
      right - (halfWidth * 0.1), centerY + (halfHeight * 0.7) + bottomWaveA,
      centerX + (halfWidth * 0.48), centerY + halfHeight - bottomWaveB,
      centerX, centerY + halfHeight + bottomWaveA
    );
    path.bezierCurveTo(
      centerX - (halfWidth * 0.46), centerY + halfHeight - bottomWaveA,
      left + (halfWidth * 0.12), centerY + (halfHeight * 0.72) + bottomWaveB,
      left, centerY + sideWave
    );
    path.closePath();

    return path;
  }

  function drawReveal(time) {
    var visibleOpen = clamp(state.open, 0, 1.06);

    if (visibleOpen < 0.002 || !photo.complete) {
      return;
    }

    var easedOpen = visibleOpen < 1
      ? 1 - Math.pow(1 - visibleOpen, 3)
      : visibleOpen;
    var centerX = state.x * width;
    var centerY = state.y * height;
    var halfWidth = width * (0.012 + (easedOpen * 0.238));
    var halfHeight = height * (0.003 + (easedOpen * 0.072));
    var motionTime = reducedMotion ? 0 : time;
    var revealPath = createFluidPath(centerX, centerY, halfWidth, halfHeight, motionTime, 0);

    context.save();
    context.clip(revealPath);
    context.globalAlpha = clamp(easedOpen * 1.08, 0, 1);
    context.drawImage(photo, 0, 0, width, height);
    context.restore();

    var edgePath = createFluidPath(
      centerX,
      centerY,
      halfWidth + (2.5 * easedOpen),
      halfHeight + (1.5 * easedOpen),
      motionTime,
      1.6
    );

    context.save();
    context.strokeStyle = "rgba(24, 35, 45, " + (0.11 * clamp(easedOpen, 0, 1)) + ")";
    context.lineWidth = 1;
    context.stroke(edgePath);
    context.restore();
  }

  function render(time) {
    resizeCanvas();

    if (reducedMotion) {
      state.x = state.targetX;
      state.y = state.targetY;
      state.open = state.targetOpen;
      state.xVelocity = 0;
      state.yVelocity = 0;
      state.openVelocity = 0;
    } else {
      spring("x", "xVelocity", state.targetX, 0.055, 0.82);
      spring("y", "yVelocity", state.targetY, 0.055, 0.82);
      spring("open", "openVelocity", state.targetOpen, 0.07, 0.79);
    }

    context.clearRect(0, 0, width, height);
    drawReveal(time || 0);

    var unsettled = Math.abs(state.open - state.targetOpen) > 0.001
      || Math.abs(state.openVelocity) > 0.001
      || Math.abs(state.x - state.targetX) > 0.001
      || Math.abs(state.y - state.targetY) > 0.001
      || Math.abs(state.xVelocity) > 0.001
      || Math.abs(state.yVelocity) > 0.001;

    if (state.targetOpen > 0 || unsettled) {
      animationFrame = window.requestAnimationFrame(render);
    } else {
      animationFrame = null;
      context.clearRect(0, 0, width, height);
    }
  }

  function startAnimation() {
    if (animationFrame === null) {
      animationFrame = window.requestAnimationFrame(render);
    }
  }

  function setPointer(event) {
    var bounds = portrait.getBoundingClientRect();

    state.targetX = clamp((event.clientX - bounds.left) / bounds.width, 0.2, 0.8);
    state.targetY = clamp((event.clientY - bounds.top) / bounds.height, 0.22, 0.62);
    startAnimation();
  }

  function openReveal() {
    state.targetOpen = 1;
    portrait.classList.add("is-interacting");
    startAnimation();
  }

  function closeReveal() {
    state.targetOpen = 0;
    state.targetX = 0.5;
    state.targetY = 0.36;
    portrait.classList.remove("is-interacting");
    startAnimation();
  }

  portrait.addEventListener("pointerenter", function (event) {
    if (event.pointerType === "touch") {
      return;
    }

    setPointer(event);
    openReveal();
  });

  portrait.addEventListener("pointermove", function (event) {
    if (event.pointerType !== "touch") {
      setPointer(event);
    }
  });

  portrait.addEventListener("pointerleave", closeReveal);

  portrait.addEventListener("focus", function () {
    state.targetX = 0.5;
    state.targetY = 0.36;
    openReveal();
  });

  portrait.addEventListener("blur", closeReveal);

  portrait.addEventListener("click", function (event) {
    if (!window.matchMedia("(hover: none)").matches || touchArmed) {
      return;
    }

    event.preventDefault();
    touchArmed = true;
    state.targetX = 0.5;
    state.targetY = 0.36;
    openReveal();
  });

  document.addEventListener("pointerdown", function (event) {
    if (!touchArmed || portrait.contains(event.target)) {
      return;
    }

    touchArmed = false;
    closeReveal();
  });

  if (window.ResizeObserver) {
    new ResizeObserver(function () {
      resizeCanvas();
      startAnimation();
    }).observe(portrait);
  } else {
    window.addEventListener("resize", function () {
      resizeCanvas();
      startAnimation();
    });
  }

  if (photo.complete) {
    resizeCanvas();
  } else {
    photo.addEventListener("load", resizeCanvas);
  }
})();
