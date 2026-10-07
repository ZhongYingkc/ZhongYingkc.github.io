(function () {
  "use strict";

  var portrait = document.querySelector("[data-landing-reveal]");

  if (!portrait) {
    return;
  }

  var canvas = portrait.querySelector(".landing-portrait__canvas");
  var photo = portrait.querySelector(".landing-portrait__source");
  var sourceTopCrop = parseFloat(portrait.getAttribute("data-source-top-crop")) || 0;
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

  var tail = {
    x: 0.5,
    y: 0.36,
    xVelocity: 0,
    yVelocity: 0
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

  function springTail(valueKey, velocityKey, target) {
    tail[velocityKey] = (target - tail[valueKey]) * 0.018;
    tail[valueKey] += tail[velocityKey];
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

  function createFluidPath(centerX, centerY, halfWidth, halfHeight, time) {
    var phase = time * 0.0022;
    var pointCount = 32;
    var points = [];
    var tailDeltaX = (tail.x * width) - centerX;
    var tailDeltaY = (tail.y * height) - centerY;
    var tailDistance = Math.sqrt((tailDeltaX * tailDeltaX) + (tailDeltaY * tailDeltaY));
    var tailLength = clamp(tailDistance, 0, width * 0.24);
    var directionX = tailDistance > 0.5 ? tailDeltaX / tailDistance : 0;
    var directionY = tailDistance > 0.5 ? tailDeltaY / tailDistance : 0;
    var tailStrength = clamp(tailLength / (width * 0.14), 0, 1);
    var path = new Path2D();
    var index;

    for (index = 0; index < pointCount; index += 1) {
      var angle = (Math.PI * 2 * index) / pointCount;
      var cosine = Math.cos(angle);
      var sine = Math.sin(angle);
      var edgeFlow = (Math.sin((angle * 3) + phase) * 0.075)
        + (Math.sin((angle * 5) - (phase * 1.25)) * 0.045)
        + (Math.sin((angle * 2) + (phase * 0.72)) * 0.03);

      points.push({
        x: centerX + (cosine * halfWidth * (1 + edgeFlow)),
        y: centerY + (sine * halfHeight * (1 + (edgeFlow * 1.25)))
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

    if (tailLength > 2) {
      var perpendicularX = -directionY;
      var perpendicularY = directionX;
      var directionRadius = 1 / Math.sqrt(
        ((directionX * directionX) / (halfWidth * halfWidth))
        + ((directionY * directionY) / (halfHeight * halfHeight))
      );
      var baseDistance = directionRadius * 0.22;
      var baseHalfWidth = Math.min(halfWidth, halfHeight) * (0.5 - (tailStrength * 0.12));
      var tipDistance = (directionRadius * 0.55) + tailLength;
      var tipHalfWidth = Math.max(1.5, Math.min(halfWidth, halfHeight) * 0.045);
      var baseX = centerX + (directionX * baseDistance);
      var baseY = centerY + (directionY * baseDistance);
      var tipX = centerX + (directionX * tipDistance);
      var tipY = centerY + (directionY * tipDistance);
      var firstControlDistance = directionRadius * 0.76;
      var secondControlDistance = tipDistance - (tailLength * 0.2);

      path.moveTo(
        baseX + (perpendicularX * baseHalfWidth),
        baseY + (perpendicularY * baseHalfWidth)
      );
      path.bezierCurveTo(
        centerX + (directionX * firstControlDistance) + (perpendicularX * baseHalfWidth * 0.72),
        centerY + (directionY * firstControlDistance) + (perpendicularY * baseHalfWidth * 0.72),
        centerX + (directionX * secondControlDistance) + (perpendicularX * tipHalfWidth * 1.8),
        centerY + (directionY * secondControlDistance) + (perpendicularY * tipHalfWidth * 1.8),
        tipX + (perpendicularX * tipHalfWidth),
        tipY + (perpendicularY * tipHalfWidth)
      );
      path.quadraticCurveTo(
        tipX + (directionX * Math.min(6, tailLength * 0.06)),
        tipY + (directionY * Math.min(6, tailLength * 0.06)),
        tipX - (perpendicularX * tipHalfWidth),
        tipY - (perpendicularY * tipHalfWidth)
      );
      path.bezierCurveTo(
        centerX + (directionX * secondControlDistance) - (perpendicularX * tipHalfWidth * 1.8),
        centerY + (directionY * secondControlDistance) - (perpendicularY * tipHalfWidth * 1.8),
        centerX + (directionX * firstControlDistance) - (perpendicularX * baseHalfWidth * 0.72),
        centerY + (directionY * firstControlDistance) - (perpendicularY * baseHalfWidth * 0.72),
        baseX - (perpendicularX * baseHalfWidth),
        baseY - (perpendicularY * baseHalfWidth)
      );
      path.closePath();
    }

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
    var breathing = reducedMotion ? 0 : Math.sin(time * 0.0018) * 0.045;
    var halfWidth = width * (0.008 + (easedOpen * 0.16)) * (1 + breathing);
    var halfHeight = height * (0.006 + (easedOpen * 0.095)) * (1 + (breathing * 0.7));
    var revealPath = createFluidPath(centerX, centerY, halfWidth, halfHeight, motionTime);

    layerContext.clearRect(0, 0, width, height);
    maskContext.clearRect(0, 0, width, height);

    layerContext.globalCompositeOperation = "source-over";
    layerContext.globalAlpha = 1;
    var sourceY = photo.naturalHeight * sourceTopCrop;
    var sourceHeight = photo.naturalHeight - sourceY;

    layerContext.drawImage(
      photo,
      0,
      sourceY,
      photo.naturalWidth,
      sourceHeight,
      0,
      0,
      width,
      height
    );

    maskContext.save();
    maskContext.filter = reducedMotion ? "none" : "blur(4px)";
    maskContext.fillStyle = "#fff";
    maskContext.globalAlpha = clamp(easedOpen * 1.08, 0, 1);
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
    updateDelayedPointer(time || 0);

    if (reducedMotion) {
      state.x = state.targetX;
      state.y = state.targetY;
      state.open = state.targetOpen;
      state.xVelocity = 0;
      state.yVelocity = 0;
      state.openVelocity = 0;
      tail.x = state.x;
      tail.y = state.y;
      tail.xVelocity = 0;
      tail.yVelocity = 0;
    } else {
      spring("x", "xVelocity", state.targetX, 0.16, 0.7);
      spring("y", "yVelocity", state.targetY, 0.16, 0.7);
      spring("open", "openVelocity", state.targetOpen, 0.07, 0.79);
      springTail("x", "xVelocity", state.x);
      springTail("y", "yVelocity", state.y);
    }

    context.clearRect(0, 0, width, height);
    drawReveal(time || 0);

    var unsettled = Math.abs(state.open - state.targetOpen) > 0.001
      || Math.abs(state.openVelocity) > 0.001
      || Math.abs(state.x - state.targetX) > 0.001
      || Math.abs(state.y - state.targetY) > 0.001
      || Math.abs(state.xVelocity) > 0.001
      || Math.abs(state.yVelocity) > 0.001
      || Math.abs(tail.x - state.x) > 0.001
      || Math.abs(tail.y - state.y) > 0.001
      || Math.abs(tail.xVelocity) > 0.001
      || Math.abs(tail.yVelocity) > 0.001;

    if (state.targetOpen > 0 || unsettled) {
      animationFrame = window.requestAnimationFrame(render);
    } else {
      animationFrame = null;
      tail.x = state.x;
      tail.y = state.y;
      tail.xVelocity = 0;
      tail.yVelocity = 0;
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
