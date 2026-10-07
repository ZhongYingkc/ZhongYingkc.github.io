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
  var pointerTrail = [];
  var followDelay = 110;
  var waterTrail = [];
  var lastWaterTrailPoint = null;
  var waterTrailSequence = 0;
  var waterTrailLifetime = 720;
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

  function updateDelayedPointer(time) {
    var cutoff = time - followDelay;

    if (!pointerTrail.length || pointerTrail[0].time > cutoff) {
      return;
    }

    while (pointerTrail.length > 1 && pointerTrail[1].time <= cutoff) {
      pointerTrail.shift();
    }

    var firstPoint = pointerTrail[0];
    var secondPoint = pointerTrail[1];

    if (!secondPoint) {
      state.targetX = firstPoint.x;
      state.targetY = firstPoint.y;
      return;
    }

    var duration = secondPoint.time - firstPoint.time;
    var progress = duration > 0 ? clamp((cutoff - firstPoint.time) / duration, 0, 1) : 1;

    state.targetX = firstPoint.x + ((secondPoint.x - firstPoint.x) * progress);
    state.targetY = firstPoint.y + ((secondPoint.y - firstPoint.y) * progress);
  }

  function createFluidPath(centerX, centerY, halfWidth, halfHeight, time, phaseOffset, dragStrength) {
    var phase = (time * 0.0022) + phaseOffset;
    var pointCount = 24;
    var points = [];
    var drag = typeof dragStrength === "number" ? dragStrength : 1;
    var velocityX = state.xVelocity * width * drag;
    var velocityY = state.yVelocity * height * drag;
    var velocityLength = Math.sqrt((velocityX * velocityX) + (velocityY * velocityY));
    var directionX = velocityLength > 0.001 ? velocityX / velocityLength : 0;
    var directionY = velocityLength > 0.001 ? velocityY / velocityLength : 0;
    var trailLength = clamp(velocityLength * 7, 0, width * 0.055);
    var path = new Path2D();
    var index;

    for (index = 0; index < pointCount; index += 1) {
      var angle = (Math.PI * 2 * index) / pointCount;
      var cosine = Math.cos(angle);
      var sine = Math.sin(angle);
      var edgeFlow = (Math.sin((angle * 3) + phase) * 0.075)
        + (Math.sin((angle * 5) - (phase * 1.25)) * 0.045)
        + (Math.sin((angle * 2) + (phase * 0.72)) * 0.03);
      var dragDot = (cosine * directionX) + (sine * directionY);
      var trailingEdge = Math.max(0, -dragDot) * trailLength;

      points.push({
        x: centerX + (cosine * halfWidth * (1 + edgeFlow)) - (directionX * trailingEdge),
        y: centerY + (sine * halfHeight * (1 + (edgeFlow * 1.25))) - (directionY * trailingEdge)
      });
    }

    var lastPoint = points[pointCount - 1];
    var firstPoint = points[0];
    path.moveTo(
      (lastPoint.x + firstPoint.x) * 0.5,
      (lastPoint.y + firstPoint.y) * 0.5
    );

    for (index = 0; index < pointCount; index += 1) {
      var currentPoint = points[index];
      var nextPoint = points[(index + 1) % pointCount];

      path.quadraticCurveTo(
        currentPoint.x,
        currentPoint.y,
        (currentPoint.x + nextPoint.x) * 0.5,
        (currentPoint.y + nextPoint.y) * 0.5
      );
    }

    path.closePath();

    return path;
  }

  function updateWaterTrail(time, halfWidth, halfHeight) {
    if (reducedMotion || state.targetOpen <= 0 || state.open < 0.45) {
      lastWaterTrailPoint = null;
      return;
    }

    if (!lastWaterTrailPoint) {
      lastWaterTrailPoint = {
        x: state.x,
        y: state.y,
        time: time
      };
      return;
    }

    var deltaX = (state.x - lastWaterTrailPoint.x) * width;
    var deltaY = (state.y - lastWaterTrailPoint.y) * height;
    var distance = Math.sqrt((deltaX * deltaX) + (deltaY * deltaY));
    var minimumDistance = Math.max(8, width * 0.015);

    if (distance < minimumDistance) {
      return;
    }

    waterTrailSequence += 1;
    waterTrail.push({
      x: lastWaterTrailPoint.x,
      y: lastWaterTrailPoint.y,
      born: time,
      widthRatio: (halfWidth / width) * (0.58 + ((waterTrailSequence % 3) * 0.07)),
      heightRatio: (halfHeight / height) * (0.58 + ((waterTrailSequence % 3) * 0.07)),
      phase: waterTrailSequence * 0.83
    });

    if (waterTrail.length > 16) {
      waterTrail.shift();
    }

    lastWaterTrailPoint = {
      x: state.x,
      y: state.y,
      time: time
    };
  }

  function drawWaterTrailMask(time) {
    var activeTrail = [];
    var index;

    for (index = 0; index < waterTrail.length; index += 1) {
      var stain = waterTrail[index];
      var progress = (time - stain.born) / waterTrailLifetime;

      if (progress >= 1) {
        continue;
      }

      var spread = 1 + (progress * 0.12);
      var opacity = Math.pow(1 - progress, 1.65) * 0.38;
      var stainPath = createFluidPath(
        stain.x * width,
        stain.y * height,
        stain.widthRatio * width * spread,
        stain.heightRatio * height * spread,
        time,
        stain.phase,
        0
      );

      maskContext.globalAlpha = opacity;
      maskContext.fill(stainPath);
      activeTrail.push(stain);
    }

    maskContext.globalAlpha = 1;
    waterTrail = activeTrail;
  }

  function drawReveal(time) {
    var visibleOpen = clamp(state.open, 0, 1.06);

    if ((visibleOpen < 0.002 && !waterTrail.length) || !photo.complete) {
      return;
    }

    var easedOpen = visibleOpen < 1
      ? 1 - Math.pow(1 - visibleOpen, 3)
      : visibleOpen;
    var centerX = state.x * width;
    var centerY = state.y * height;
    var motionTime = reducedMotion ? 0 : time;
    var breathing = reducedMotion ? 0 : Math.sin(time * 0.0018) * 0.045;
    var halfWidth = width * (0.008 + (easedOpen * 0.16)) * (1 + breathing);
    var halfHeight = height * (0.006 + (easedOpen * 0.095)) * (1 + (breathing * 0.7));
    var revealPath = createFluidPath(centerX, centerY, halfWidth, halfHeight, motionTime, 0, 1);

    updateWaterTrail(time, halfWidth, halfHeight);

    layerContext.clearRect(0, 0, width, height);
    maskContext.clearRect(0, 0, width, height);

    layerContext.globalCompositeOperation = "source-over";
    layerContext.globalAlpha = 1;
    layerContext.drawImage(photo, 0, 0, width, height);

    maskContext.save();
    maskContext.filter = reducedMotion ? "none" : "blur(4px)";
    maskContext.fillStyle = "#fff";
    drawWaterTrailMask(time);

    if (visibleOpen >= 0.002) {
      maskContext.globalAlpha = clamp(easedOpen * 1.08, 0, 1);
      maskContext.fill(revealPath);
    }

    maskContext.globalAlpha = 1;
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
    updateDelayedPointer(time || 0);

    if (reducedMotion) {
      state.x = state.targetX;
      state.y = state.targetY;
      state.open = state.targetOpen;
      state.xVelocity = 0;
      state.yVelocity = 0;
      state.openVelocity = 0;
    } else {
      spring("x", "xVelocity", state.targetX, 0.16, 0.7);
      spring("y", "yVelocity", state.targetY, 0.16, 0.7);
      spring("open", "openVelocity", state.targetOpen, 0.07, 0.79);
    }

    context.clearRect(0, 0, width, height);
    drawReveal(time || 0);

    var unsettled = Math.abs(state.open - state.targetOpen) > 0.001
      || Math.abs(state.openVelocity) > 0.001
      || Math.abs(state.x - state.targetX) > 0.001
      || Math.abs(state.y - state.targetY) > 0.001
      || Math.abs(state.xVelocity) > 0.001
      || Math.abs(state.yVelocity) > 0.001
      || waterTrail.length > 0;

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
    var nextX = clamp((event.clientX - bounds.left) / bounds.width, 0.06, 0.94);
    var nextY = clamp((event.clientY - bounds.top) / bounds.height, 0.06, 0.94);

    pointerTrail.push({
      x: nextX,
      y: nextY,
      time: window.performance.now()
    });

    if (pointerTrail.length > 48) {
      pointerTrail.shift();
    }

    startAnimation();
  }

  function openReveal() {
    state.targetOpen = 1;
    portrait.classList.add("is-interacting");
    startAnimation();
  }

  function closeReveal() {
    pointerTrail = [];
    lastWaterTrailPoint = null;
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
