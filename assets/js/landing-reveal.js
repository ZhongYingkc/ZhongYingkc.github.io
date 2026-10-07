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
    y: 0.4,
    xVelocity: 0,
    yVelocity: 0,
    targetX: 0.5,
    targetY: 0.4,
    open: 0,
    openVelocity: 0,
    targetOpen: 0,
    pointerVelocityX: 0,
    pointerVelocityY: 0
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

  function drawPhoto(offsetX, offsetY, scale) {
    var drawWidth = width * scale;
    var drawHeight = height * scale;
    var drawX = ((width - drawWidth) * 0.5) + offsetX;
    var drawY = ((height - drawHeight) * 0.5) + offsetY;

    context.drawImage(photo, drawX, drawY, drawWidth, drawHeight);
  }

  function createVisorPath(centerX, centerY, halfWidth, halfHeight, wave, skew) {
    var left = centerX - halfWidth;
    var right = centerX + halfWidth;
    var path = new Path2D();

    path.moveTo(left, centerY + (halfHeight * 0.12));
    path.lineTo(left + (halfWidth * 0.08), centerY - (halfHeight * 0.72) + wave);
    path.lineTo(left + (halfWidth * 0.34), centerY - halfHeight - (wave * 0.35) + skew);
    path.lineTo(centerX - (halfWidth * 0.12), centerY - (halfHeight * 0.86) + (wave * 0.2));
    path.lineTo(centerX + (halfWidth * 0.2), centerY - halfHeight - (wave * 0.7) - skew);
    path.lineTo(right - (halfWidth * 0.24), centerY - (halfHeight * 0.76) + (wave * 0.45));
    path.lineTo(right, centerY - (halfHeight * 0.2));
    path.lineTo(right - (halfWidth * 0.06), centerY + (halfHeight * 0.72) - wave);
    path.lineTo(right - (halfWidth * 0.34), centerY + halfHeight + (wave * 0.4) + skew);
    path.lineTo(centerX + (halfWidth * 0.1), centerY + (halfHeight * 0.84) - (wave * 0.2));
    path.lineTo(centerX - (halfWidth * 0.22), centerY + halfHeight + (wave * 0.72) - skew);
    path.lineTo(left + (halfWidth * 0.22), centerY + (halfHeight * 0.7) - (wave * 0.45));
    path.closePath();

    return path;
  }

  function drawSlice(centerX, centerY, halfWidth, sliceHeight, offset, shift, angle, alpha) {
    var sliceY = centerY + offset;
    var left = centerX - halfWidth;
    var right = centerX + halfWidth;
    var path = new Path2D();

    path.moveTo(left, sliceY - sliceHeight);
    path.lineTo(right, sliceY - (sliceHeight * 0.55));
    path.lineTo(right - (width * 0.035), sliceY + sliceHeight);
    path.lineTo(left + (width * 0.025), sliceY + (sliceHeight * 0.62));
    path.closePath();

    context.save();
    context.translate(centerX, centerY);
    context.rotate(angle);
    context.translate(-centerX, -centerY);
    context.clip(path);
    context.globalAlpha = alpha;
    drawPhoto(shift, 0, 1.018);
    context.restore();
  }

  function drawReveal(time) {
    var visibleOpen = clamp(state.open, 0, 1.08);

    if (visibleOpen < 0.002 || !photo.complete) {
      return;
    }

    var easedOpen = visibleOpen < 1
      ? 1 - Math.pow(1 - visibleOpen, 3)
      : visibleOpen;
    var centerX = (width * 0.5) + ((state.x - 0.5) * width * 0.12);
    var centerY = state.y * height;
    var halfWidth = width * (0.08 + (easedOpen * 0.31));
    var halfHeight = height * (0.008 + (easedOpen * 0.115));
    var movement = clamp(state.pointerVelocityX * 22, -1, 1);
    var angle = ((state.x - 0.5) * -0.09) + (movement * 0.018);
    var wave = (Math.sin((time * 0.0055) + (state.y * 7)) * height * 0.007 * easedOpen)
      + (state.pointerVelocityY * height * 0.2);
    var skew = state.pointerVelocityX * height * 0.16;
    var photoOffsetX = ((state.x - 0.5) * width * 0.022) + (state.pointerVelocityX * width * 0.34);
    var photoOffsetY = ((state.y - 0.4) * height * 0.014);
    var visor = createVisorPath(centerX, centerY, halfWidth, halfHeight, wave, skew);

    context.save();
    context.translate(centerX, centerY);
    context.rotate(angle);
    context.translate(-centerX, -centerY);
    context.clip(visor);
    context.globalAlpha = clamp(easedOpen * 0.76, 0, 0.76);
    drawPhoto(photoOffsetX, photoOffsetY, 1.018);

    var rowCount = 12;
    var rowTop = centerY - (halfHeight * 1.15);
    var rowHeight = (halfHeight * 2.3) / rowCount;
    var row;

    for (row = 0; row < rowCount; row += 1) {
      var rowShift = Math.sin((row * 1.63) + (time * 0.0048)) * width * 0.009 * easedOpen;
      rowShift += movement * ((row % 2 === 0 ? 1 : -1) * 18);

      context.save();
      context.beginPath();
      context.rect(0, rowTop + (row * rowHeight), width, rowHeight + 1.2);
      context.clip();
      context.globalAlpha = clamp(0.74 + (easedOpen * 0.22), 0, 0.96);
      drawPhoto(photoOffsetX + rowShift, photoOffsetY, 1.018);
      context.restore();
    }
    context.restore();

    if (!reducedMotion) {
      drawSlice(centerX, centerY, halfWidth * 0.96, height * 0.009, -halfHeight * 0.82, photoOffsetX + (Math.sin(time * 0.006) * 9) - (movement * 18), angle * 0.72, 0.68 * easedOpen);
      drawSlice(centerX, centerY, halfWidth * 1.06, height * 0.012, -halfHeight * 0.22, photoOffsetX + (Math.cos(time * 0.004) * 12) + (movement * 25), angle * 1.08, 0.76 * easedOpen);
      drawSlice(centerX, centerY, halfWidth * 0.9, height * 0.01, halfHeight * 0.5, photoOffsetX + (Math.sin(time * 0.005) * -10) - (movement * 20), angle * 0.86, 0.7 * easedOpen);
      drawSlice(centerX, centerY, halfWidth * 0.72, height * 0.006, halfHeight * 0.88, photoOffsetX + (Math.cos(time * 0.007) * 7), angle * 1.15, 0.48 * easedOpen);
    }
  }

  function updateLineArt() {
    var horizontal = state.x - 0.5;
    var vertical = state.y - 0.4;
    var strength = clamp(state.open, 0, 1);

    portrait.style.setProperty("--line-shift-x", (horizontal * -8 * strength).toFixed(2) + "px");
    portrait.style.setProperty("--line-shift-y", (vertical * -5 * strength).toFixed(2) + "px");
    portrait.style.setProperty("--line-rotate", (horizontal * -0.8 * strength).toFixed(2) + "deg");
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
      spring("x", "xVelocity", state.targetX, 0.075, 0.78);
      spring("y", "yVelocity", state.targetY, 0.075, 0.78);
      spring("open", "openVelocity", state.targetOpen, 0.085, 0.76);
    }

    state.pointerVelocityX *= 0.86;
    state.pointerVelocityY *= 0.86;

    context.clearRect(0, 0, width, height);
    drawReveal(time || 0);
    updateLineArt();

    var unsettled = Math.abs(state.open - state.targetOpen) > 0.001
      || Math.abs(state.openVelocity) > 0.001
      || Math.abs(state.x - state.targetX) > 0.001
      || Math.abs(state.y - state.targetY) > 0.001
      || Math.abs(state.xVelocity) > 0.001
      || Math.abs(state.yVelocity) > 0.001
      || Math.abs(state.pointerVelocityX) > 0.0002
      || Math.abs(state.pointerVelocityY) > 0.0002;

    if (state.targetOpen > 0 || unsettled) {
      animationFrame = window.requestAnimationFrame(render);
    } else {
      animationFrame = null;
      context.clearRect(0, 0, width, height);
      updateLineArt();
    }
  }

  function startAnimation() {
    if (animationFrame === null) {
      animationFrame = window.requestAnimationFrame(render);
    }
  }

  function setPointer(event) {
    var bounds = portrait.getBoundingClientRect();
    var nextX = clamp((event.clientX - bounds.left) / bounds.width, 0.08, 0.92);
    var nextY = clamp((event.clientY - bounds.top) / bounds.height, 0.22, 0.62);

    state.pointerVelocityX = clamp(nextX - state.targetX, -0.12, 0.12);
    state.pointerVelocityY = clamp(nextY - state.targetY, -0.12, 0.12);
    state.targetX = nextX;
    state.targetY = nextY;
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
    state.targetY = 0.4;
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
    state.targetY = 0.4;
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
    state.targetY = 0.4;
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
