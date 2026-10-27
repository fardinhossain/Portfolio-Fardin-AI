// ==========================================================================
// FARDIN.AI — CINEMATIC HALFTONE & SILHOUETTE DISSOLVE SHADER ENGINE
// 45-degree angled stipple matrix, organic micro-jitter dispersion,
// intro stipple emergence, and scroll-driven edge particle dissolve.
// ==========================================================================

import { getCurrentTheme, subscribeTheme } from "./theme-manager.js";

function isWebGLAvailable() {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    return !!(
      canvas.getContext("webgl", { antialias: true, alpha: true }) ||
      canvas.getContext("experimental-webgl")
    );
  } catch (_e) {
    return false;
  }
}

const VERTEX_SHADER_SRC = `
attribute vec2 a_pos;
varying vec2 vUv;
void main() {
  vUv = (a_pos + 1.0) * 0.5;
  vUv.y = 1.0 - vUv.y;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER_SRC = `
precision highp float;

uniform sampler2D u_texture;
uniform vec2 u_resolution;
uniform float u_introProgress;  // 0.0 (stipple) -> 1.0 (photo)
uniform float u_scrollProgress; // 0.0 (photo) -> 1.0 (halftone & dissolve)
uniform float u_isDark;         // 1.0 = Dark, 0.0 = Light
uniform float u_dotScale;       // Grid cell spacing
varying vec2 vUv;

// High-precision pseudo-random dispersion for organic stipple quality
float hash(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
  vec4 origColor = texture2D(u_texture, vUv);

  // Preserve transparent cutout background
  if (origColor.a < 0.01) {
    gl_FragColor = vec4(0.0);
    return;
  }

  // 1. Rec. 709 Luminance
  float lum = dot(origColor.rgb, vec3(0.2126, 0.7152, 0.0722));

  // Detect signature red accents in the portrait
  float redDelta = origColor.r - max(origColor.g, origColor.b);
  float redAccentWeight = clamp(redDelta * 2.8, 0.0, 1.0);

  // 2. 45-Degree Rotated Halftone Grid
  vec2 pixelPos = vUv * u_resolution;
  mat2 rot = mat2(0.70710678, -0.70710678, 0.70710678, 0.70710678);
  vec2 rotPos = rot * pixelPos;

  float cellSize = u_dotScale;
  vec2 cellIndex = floor(rotPos / cellSize);
  float cellHash = hash(cellIndex);

  // 3. Tonal Contrast Curve
  float contrastFactor = mix(1.0, 1.42, u_scrollProgress);
  float contrastedLum = clamp((lum - 0.48) * contrastFactor + 0.5, 0.0, 1.0);

  // Organic micro-jitter
  float jitter = (cellHash - 0.5) * 0.14 * mix(1.0 - u_introProgress, 1.0, u_scrollProgress);
  vec2 cellUv = fract(rotPos / cellSize) - 0.5;
  float dist = length(cellUv);

  float coverage = clamp((1.0 - contrastedLum) + jitter, 0.0, 1.0);
  float targetRadius = sqrt(coverage) * 0.707 * 0.95;
  float edge = 1.25 / cellSize;
  float dotMask = 1.0 - smoothstep(targetRadius - edge, targetRadius + edge, dist);

  // 4. Color Palettes
  vec3 groundColor;
  vec3 dotColor;
  float renderMask;

  if (u_isDark > 0.5) {
    // Dark Theme: deep elevated graphite ground with platinum highlights & ruby stipple
    groundColor = vec3(0.043, 0.055, 0.078); // #0B0E14
    dotColor = mix(vec3(0.96, 0.97, 0.99), vec3(1.0, 0.22, 0.35), redAccentWeight * 0.9);
    renderMask = 1.0 - dotMask;
  } else {
    // Light Theme: crisp white paper ground with carbon ink dots & vivid crimson
    groundColor = vec3(0.99, 0.99, 1.0);
    dotColor = mix(vec3(0.06, 0.08, 0.14), vec3(0.88, 0.11, 0.25), redAccentWeight * 0.8);
    renderMask = dotMask;
  }

  vec3 halftoneColor = mix(groundColor, dotColor, renderMask);

  // Phase C: Intro emergence from stipple to full photo
  vec3 colorAtIntro = mix(halftoneColor, origColor.rgb, smoothstep(0.0, 1.0, u_introProgress));

  // Phase 6: Scroll-driven transformation into halftone
  float scrollDesat = smoothstep(0.0, 0.6, u_scrollProgress);
  vec3 intermediateScroll = mix(colorAtIntro, vec3(lum), scrollDesat);
  float scrollHalftoneMix = smoothstep(0.08, 0.85, u_scrollProgress);
  vec3 finalColor = mix(intermediateScroll, halftoneColor, scrollHalftoneMix);

  // Particle Alpha Dissolve along silhouette during scrolling
  float edgeDist = 1.0 - origColor.a;
  float dissolveCutoff = cellHash + edgeDist * 0.8;
  float finalAlpha = origColor.a;

  if (u_scrollProgress > 0.12) {
    float dissolveTrigger = u_scrollProgress * 1.35;
    float dissolveFade = smoothstep(dissolveCutoff - 0.25, dissolveCutoff + 0.1, dissolveTrigger);
    finalAlpha *= (1.0 - dissolveFade);
  }

  gl_FragColor = vec4(finalColor, finalAlpha);
}
`;

export function initHalftonePortraitShader(canvas, imageSrc) {
  if (!canvas || !isWebGLAvailable()) return null;

  const gl =
    canvas.getContext("webgl", {
      antialias: true,
      alpha: true,
      premultipliedAlpha: false
    }) || canvas.getContext("experimental-webgl");

  if (!gl) return null;

  function createShader(glCtx, type, source) {
    const shader = glCtx.createShader(type);
    glCtx.shaderSource(shader, source);
    glCtx.compileShader(shader);
    if (!glCtx.getShaderParameter(shader, glCtx.COMPILE_STATUS)) {
      glCtx.deleteShader(shader);
      return null;
    }
    return shader;
  }

  const vs = createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER_SRC);
  const fs = createShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER_SRC);
  if (!vs || !fs) return null;

  const prog = gl.createProgram();
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
    gl.STATIC_DRAW
  );

  const posLoc = gl.getAttribLocation(prog, "a_pos");
  gl.enableVertexAttribArray(posLoc);
  gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

  const uTexLoc = gl.getUniformLocation(prog, "u_texture");
  const uResLoc = gl.getUniformLocation(prog, "u_resolution");
  const uIntroLoc = gl.getUniformLocation(prog, "u_introProgress");
  const uScrollLoc = gl.getUniformLocation(prog, "u_scrollProgress");
  const uDarkLoc = gl.getUniformLocation(prog, "u_isDark");
  const uDotLoc = gl.getUniformLocation(prog, "u_dotScale");

  const tex = gl.createTexture();
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = imageSrc;

  let textureReady = false;
  let introProgress = 0.0;
  let scrollProgress = 0.0;

  img.onload = () => {
    try {
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      textureReady = true;
      render();
    } catch (_e) {}
  };

  function render() {
    if (!textureReady || !canvas) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.round(rect.width * dpr) || 540;
    const h = Math.round(rect.height * dpr) || 720;

    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
    gl.viewport(0, 0, w, h);

    gl.useProgram(prog);
    gl.uniform1i(uTexLoc, 0);
    gl.uniform2f(uResLoc, w, h);
    gl.uniform1f(uIntroLoc, introProgress);
    gl.uniform1f(uScrollLoc, scrollProgress);

    const isDark =
      document.documentElement.getAttribute("data-theme") === "dark" ||
      getCurrentTheme() === "dark";
    gl.uniform1f(uDarkLoc, isDark ? 1.0 : 0.0);

    const isMobile = window.innerWidth < 768;
    const baseDot = isMobile ? 3.2 : 3.8;
    gl.uniform1f(uDotLoc, baseDot * dpr);

    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  // Subscribe to theme updates
  const unsubscribeTheme = subscribeTheme(() => {
    render();
  });

  return {
    setIntroProgress(val) {
      introProgress = Math.min(1, Math.max(0, val));
      render();
    },
    setScrollProgress(val) {
      scrollProgress = Math.min(1, Math.max(0, val));
      render();
    },
    render,
    dispose() {
      unsubscribeTheme();
      try {
        gl.deleteBuffer(buf);
        gl.deleteProgram(prog);
        gl.deleteShader(vs);
        gl.deleteShader(fs);
        gl.deleteTexture(tex);
        gl.getExtension("WEBGL_lose_context")?.loseContext();
      } catch (_e) {}
    }
  };
}
