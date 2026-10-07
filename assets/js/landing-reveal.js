(function () {
  "use strict";

  var portrait = document.querySelector("[data-landing-reveal]");

  if (!portrait) {
    return;
  }

  var canvas = portrait.querySelector(".landing-portrait__canvas");
  var photo = portrait.querySelector(".landing-portrait__source");
  var context = canvas && canvas.getContext ? canvas.getContext("2d") : null;
  var layerCanvas = document.createElement("canvas");
  var layerContext = layerCanvas.getContext("2d");
  var maskCanvas = document.createElement("canvas");
  var maskContext = maskCanvas.getContext("2d");

  if (!canvas || !photo || !context || !layerContext || !maskContext) {
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
    layerCanvas.width = canvas.width;
    layerCanvas.height = canvas.height;
    maskCanvas.width = canvas.width;
    maskCanvas.height = canvas.height;
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    layerContext.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    maskContext.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  }

  function spring(valueKey, velocityKey, target, stiffness, damping) {
    state[velocityKey] += (target - state[valueKey]) * stiffness;
    state[velocityKey] *= damping;
    state[valueKey] += state[velocityKey];
  }

  function createFluidPath(centerX, centerY, halfWidth, halfHeight, time, phaseOffset) {
    var phase = (time * 0.0034) + phaseOffset;
    var left = centerX - halfWidth;
    var right = centerX + halfWidth;
    var topWaveA = Math.sin(phase) * halfHeight * 0.24;
    var topWaveB = Math.sin((phase * 1.37) + 1.1) * halfHeight * 0.16;
    var bottomWaveA = Math.sin((phase * 1.19) + 2.2) * halfHeight * 0.22;
    var bottomWaveB = Math.sin((phase * 1.53) + 3.4) * halfHeight * 0.15;
    var sideWave = Math.sin((phase * 0.83) + 0.7) * halfHeight * 0.18;
    var path = new Path2D();

    path.moveTo(left, centerY + sideWave);
    path.bezierCurveTo(
      left + (halfWidth * 0.05), centerY - (halfHeight * 0.58) + topWaveA,
      centerX - (halfWidth * 0.5), centerY - halfHeight + topWaveB,
      centerX, centerY - halfHeight - topWaveA
    );
    path.bezierCurveTo(
      centerX + (halfWidth * 0.5), centerY - halfHeight + topWaveA,
      right - (halfWidth * 0.05), centerY - (halfHeight * 0.58) - topWaveB,
      right, centerY - sideWave
    );
    path.bezierCurveTo(
      right - (halfWidth * 0.05), centerY + (halfHeight * 0.58) + bottomWaveA,
      centerX + (halfWidth * 0.5), centerY + halfHeight - bottomWaveB,
      centerX, centerY + halfHeight + bottomWaveA
    );
    path.bezierCurveTo(
      centerX - (halfWidth * 0.5), centerY + halfHeight - bottomWaveA,
      left + (halfWidth * 0.05), centerY + (halfHeight * 0.58) + bottomWaveB,
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
    var motionTime = reducedMotion ? 0 : time;
    var breathing = reducedMotion ? 0 : Math.sin(time * 0.0024) * 0.045;
    var halfWidth = width * (0.012 + (easedOpen * 0.238)) * (1 + breathing);
    var halfHeight = height * (0.003 + (easedOpen * 0.072)) * (1 + (breathing * 0.7));
    var revealPath = createFluidPath(centerX, centerY, halfWidth, halfHeight, motionTime, 0);

    layerContext.clearRect(0, 0, width, height);
    maskContext.clearRect(0, 0, width, height);

    layerContext.globalCompositeOperation = "source-over";
    layerContext.globalAlpha = clamp(easedOpen * 1.08, 0, 1);
    layerContext.drawImage(photo, 0, 0, width, height);

    maskContext.save();
    maskContext.filter = reducedMotion ? "none" : "blur(4px)";
    maskContext.fillStyle = "#fff";
    maskContext.fill(revealPath);
    maskContext.restore();

    layerContext.globalCompositeOperation = "destination-in";
    layerContext.globalAlpha = 1;
    layerContext.drawImage(
      maskCanvas,
      0,
      0,
      maskCanvas.width,
      maskCanvas.height,
      0,
      0,
      width,
      height
    );
    layerContext.globalCompositeOperation = "source-over";

    context.drawImage(
      layerCanvas,
      0,
      0,
      layerCanvas.width,
      layerCanvas.height,
      0,
      0,
      width,
      height
    );
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

    state.targetX = clamp((event.clientX - bounds.left) / bounds.width, 0.06, 0.94);
    state.targetY = clamp((event.clientY - bounds.top) / bounds.height, 0.06, 0.94);
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
