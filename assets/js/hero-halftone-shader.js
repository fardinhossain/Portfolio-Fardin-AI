// ==========================================================================
// FARDIN.AI — HIGH-PRECISION FINE-ART HALFTONE & DISSOLVE SHADER
// Inspired by Sarthak Sharma reference portfolio.
// Fine micro-dot pitch (2.4px), smooth circular dot coverage, zero pixelation,
// preserves eyes, nose, lips, facial contours, hairstyle, and brown shirt.
// Only transforms as visitor scrolls; 100% clean original photograph at scroll 0.
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
uniform float u_scrollProgress; // 0.0 = clean original photo -> 1.0 = fine halftone stipple
uniform float u_isDark;         // 1.0 = Dark Mode, 0.0 = Light Mode
uniform float u_dotPitch;       // Fine micro-dot pitch (2.4px)
varying vec2 vUv;

void main() {
  vec4 origColor = texture2D(u_texture, vUv);

  // Preserve transparent cutout background
  if (origColor.a < 0.01) {
    gl_FragColor = vec4(0.0);
    return;
  }

  // At top of page (scroll 0): output 100% crisp original photograph with zero modification
  if (u_scrollProgress <= 0.005) {
    gl_FragColor = origColor;
    return;
  }

  // 1. Rec. 709 Luminance
  float lum = dot(origColor.rgb, vec3(0.2126, 0.7152, 0.0722));

  // Red accent extraction for subtle graphic warmth
  float redDelta = origColor.r - max(origColor.g, origColor.b);
  float redAccentWeight = clamp(redDelta * 2.5, 0.0, 1.0);

  // 2. 45-Degree Halftone Matrix (Standard editorial print angle)
  vec2 pixelPos = vUv * u_resolution;
  mat2 rot = mat2(0.70710678, -0.70710678, 0.70710678, 0.70710678);
  vec2 rotPos = rot * pixelPos;

  float cellSize = u_dotPitch;
  vec2 cellUv = fract(rotPos / cellSize) - 0.5;
  float dist = length(cellUv);

  // 3. Tonal S-Curve: gentle contrast enhancement that preserves facial contours
  float contrast = mix(1.0, 1.25, u_scrollProgress);
  float contrastedLum = clamp((lum - 0.49) * contrast + 0.5, 0.0, 1.0);

  // Smooth circular dot coverage (no square pixels, no diamond crosshatching)
  float coverage = 1.0 - contrastedLum;
  float targetRadius = sqrt(clamp(coverage, 0.0, 1.0)) * 0.707 * 0.94;
  float edge = 1.2 / cellSize;
  float dotMask = 1.0 - smoothstep(targetRadius - edge, targetRadius + edge, dist);

  // 4. Color Palettes
  vec3 groundColor;
  vec3 dotColor;
  float renderMask;

  if (u_isDark > 0.5) {
    // Dark Mode: deep graphite ground (#0B0E14) with platinum highlights (#F8FAFC) & ruby accents (#FF304F)
    groundColor = vec3(0.043, 0.055, 0.078);
    dotColor = mix(vec3(0.96, 0.97, 0.99), vec3(1.0, 0.22, 0.35), redAccentWeight * 0.85);
    renderMask = 1.0 - dotMask;
  } else {
    // Light Mode: crisp white paper ground (#FFFFFF) with carbon ink dots (#0F172A) & crimson accents (#E11D48)
    groundColor = vec3(0.995, 0.995, 1.0);
    dotColor = mix(vec3(0.06, 0.08, 0.14), vec3(0.88, 0.11, 0.25), redAccentWeight * 0.8);
    renderMask = dotMask;
  }

  vec3 pureHalftone = mix(groundColor, dotColor, renderMask);

  // 5. Smooth Progressive Scroll Transformation:
  // - Desaturate smoothly from 0% to 70% scroll
  // - Blend in the fine halftone stippling smoothly from 5% to 85% scroll
  float desatAmount = smoothstep(0.0, 0.75, u_scrollProgress);
  vec3 grayPhoto = vec3(lum);
  vec3 intermediatePhoto = mix(origColor.rgb, grayPhoto, desatAmount);

  float halftoneMix = smoothstep(0.05, 0.90, u_scrollProgress);
  vec3 finalColor = mix(intermediatePhoto, pureHalftone, halftoneMix);

  // 6. Silhouette Edge Particle Dissolve (starts only at deeper scroll > 35%)
  float finalAlpha = origColor.a;
  if (u_scrollProgress > 0.35) {
    vec2 cellIndex = floor(rotPos / cellSize);
    float cellHash = fract(sin(dot(cellIndex, vec2(12.9898, 78.233))) * 43758.5453);
    float edgeDist = 1.0 - origColor.a;
    float dissolveCutoff = cellHash + edgeDist * 0.75;
    float dissolveTrigger = (u_scrollProgress - 0.35) * 1.5;
    float fade = smoothstep(dissolveCutoff - 0.2, dissolveCutoff + 0.1, dissolveTrigger);
    finalAlpha *= (1.0 - fade);
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
  const uScrollLoc = gl.getUniformLocation(prog, "u_scrollProgress");
  const uDarkLoc = gl.getUniformLocation(prog, "u_isDark");
  const uDotLoc = gl.getUniformLocation(prog, "u_dotPitch");

  const tex = gl.createTexture();
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = imageSrc;

  let textureReady = false;
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
    const w = Math.round(rect.width * dpr) || 600;
    const h = Math.round(rect.height * dpr) || 800;

    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
    gl.viewport(0, 0, w, h);

    gl.useProgram(prog);
    gl.uniform1i(uTexLoc, 0);
    gl.uniform2f(uResLoc, w, h);
    gl.uniform1f(uScrollLoc, scrollProgress);

    const isDark =
      document.documentElement.getAttribute("data-theme") === "dark" ||
      getCurrentTheme() === "dark";
    gl.uniform1f(uDarkLoc, isDark ? 1.0 : 0.0);

    // Fine-art micro-stipple pitch: 2.4px physical
    const isMobile = window.innerWidth < 768;
    const basePitch = isMobile ? 2.2 : 2.5;
    gl.uniform1f(uDotLoc, basePitch * dpr);

    canvas.style.opacity = scrollProgress > 0.005 ? "1" : "0";

    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  // Subscribe to theme updates
  const unsubscribeTheme = subscribeTheme(() => {
    render();
  });

  return {
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
