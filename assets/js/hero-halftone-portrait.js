// ==========================================================================
// FARDIN.AI — SCROLL-DRIVEN EDITORIAL HALFTONE PORTRAIT COMPONENT
// Inspired by high-end creative engineering (Sarthak Sharma reference)
// Transforms professional portrait into a fine-art monochrome halftone
// as the visitor scrolls through the hero section.
// ==========================================================================

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { getCurrentTheme, subscribeTheme } from "./theme-manager.js";

// Check for WebGL 1/2 availability safely
function isWebGLAvailable() {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    return !!(
      canvas.getContext("webgl", { antialias: true }) ||
      canvas.getContext("experimental-webgl")
    );
  } catch (_e) {
    return false;
  }
}

// Respect user's motion preference
function checkPrefersReducedMotion() {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// Vertex shader: Fullscreen quad with UV coordinates
const VERTEX_SHADER_SRC = `
attribute vec2 a_pos;
varying vec2 vUv;
void main() {
  vUv = (a_pos + 1.0) * 0.5;
  vUv.y = 1.0 - vUv.y; // Correct WebGL texture coordinate orientation
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`;

// Fragment shader: High-fidelity 45-degree halftone & fine-art stippling
const FRAGMENT_SHADER_SRC = `
precision highp float;

uniform sampler2D u_texture;
uniform vec2 u_resolution;
uniform float u_progress;   // 0.0 (original photo) -> 1.0 (pure editorial halftone)
uniform float u_isDark;     // 0.0 = Light Theme, 1.0 = Dark Theme
uniform float u_dotScale;   // Grid cell spacing in physical pixels
varying vec2 vUv;

// High-precision pseudo-random dispersion for organic stipple quality
float hash(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
  vec4 origColor = texture2D(u_texture, vUv);

  // At top of page (0% scroll), output 100% original photographic image
  if (u_progress <= 0.002) {
    gl_FragColor = origColor;
    return;
  }

  // 1. Rec. 709 Luminance
  float lum = dot(origColor.rgb, vec3(0.2126, 0.7152, 0.0722));

  // Detect signature red accents in the original graphic halo
  float redDelta = origColor.r - max(origColor.g, origColor.b);
  float redAccentWeight = clamp(redDelta * 2.8, 0.0, 1.0);

  // 2. Tonal Contrast Curve: subtle S-curve enhancement as halftone develops
  float contrastFactor = mix(1.0, 1.36, u_progress);
  float contrastedLum = clamp((lum - 0.49) * contrastFactor + 0.5, 0.0, 1.0);

  // 3. 45-Degree Rotated Halftone Grid (Standard print screen angle for natural organic perception)
  vec2 pixelPos = vUv * u_resolution;
  mat2 rot = mat2(0.70710678, -0.70710678, 0.70710678, 0.70710678);
  vec2 rotPos = rot * pixelPos;

  float cellSize = u_dotScale;
  vec2 cellIndex = floor(rotPos / cellSize);

  // Subtle organic stipple micro-jitter to prevent mechanical computer banding
  float jitter = (hash(cellIndex) - 0.5) * 0.12 * u_progress;

  vec2 cellUv = fract(rotPos / cellSize) - 0.5;
  float dist = length(cellUv);

  // Dot coverage
  float coverage = clamp((1.0 - contrastedLum) + jitter, 0.0, 1.0);
  float targetRadius = sqrt(coverage) * 0.707 * 0.95;
  float edge = 1.25 / cellSize;
  float dotMask = 1.0 - smoothstep(targetRadius - edge, targetRadius + edge, dist);

  // 4. Dot Radius & Coverage
  vec3 groundColor;
  vec3 dotColor;
  float renderMask;

  if (u_isDark > 0.5) {
    // DARK THEME PALETTE:
    // Deep graphite card ground (#12151D) with platinum highlights (#F5F6FA) & ruby stippling (#FF304F)
    groundColor = vec3(0.070, 0.082, 0.114); // #12151D elevated surface
    dotColor = mix(vec3(0.94, 0.95, 0.98), vec3(1.0, 0.25, 0.38), redAccentWeight * 0.85);
    renderMask = 1.0 - dotMask;
  } else {
    // LIGHT THEME PALETTE:
    // Crisp paper white (#FFFFFF) with rich carbon ink dots (#0F172A) & vivid crimson (#E11D48)
    groundColor = vec3(0.995, 0.995, 1.0); // #FFFFFF
    dotColor = mix(vec3(0.065, 0.085, 0.150), vec3(0.88, 0.10, 0.24), redAccentWeight * 0.75);
    renderMask = dotMask;
  }

  vec3 halftoneImage = mix(groundColor, dotColor, renderMask);

  // 5. Progressive Scroll Transformation:
  // - Desaturate the photo continuously from 0% to 65% scroll
  // - Blend in halftone stippling smoothly from 5% to 92% scroll
  float desatAmount = smoothstep(0.0, 0.65, u_progress);
  vec3 grayPhoto = vec3(lum);
  vec3 intermediatePhoto = mix(origColor.rgb, grayPhoto, desatAmount);

  float halftoneMix = smoothstep(0.05, 0.90, u_progress);
  vec3 finalColor = mix(intermediatePhoto, halftoneImage, halftoneMix);

  gl_FragColor = vec4(finalColor, 1.0);
}
`;

export function HeroHalftonePortrait({
  src,
  alt = "Md. Fardin Hossain — AI Engineer & Full-Stack Developer",
  annotation = "Md. Fardin Hossain",
  pillars = ["IDEAS", "CODE", "MODELS", "PRODUCTS", "IMPACT"]
}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const cardRef = useRef(null);
  const badgeRef = useRef(null);
  const pillarsRef = useRef(null);

  const [webglActive, setWebglActive] = useState(false);
  const themeRef = useRef(getCurrentTheme());
  const progressRef = useRef(0);
  const glStateRef = useRef(null);
  const animFrameRef = useRef(null);

  // Subscribe to system/user theme changes with zero-recreation instant re-render
  useEffect(() => {
    const updateTheme = () => {
      const isDark =
        document.documentElement.getAttribute("data-theme") === "dark" ||
        getCurrentTheme() === "dark";
      themeRef.current = isDark ? "dark" : "light";
      if (glStateRef.current) {
        glStateRef.current.renderFrame();
      }
    };

    updateTheme();
    const unsubscribe = subscribeTheme(() => {
      updateTheme();
    });

    const observer = new MutationObserver(() => {
      updateTheme();
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"]
    });

    return () => {
      unsubscribe();
      observer.disconnect();
    };
  }, []);

  // WebGL Shader Setup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isWebGLAvailable()) {
      setWebglActive(false);
      return;
    }

    const gl =
      canvas.getContext("webgl", {
        antialias: true,
        alpha: false,
        premultipliedAlpha: false,
        preserveDrawingBuffer: false
      }) || canvas.getContext("experimental-webgl");

    if (!gl) {
      setWebglActive(false);
      return;
    }

    function createShader(glCtx, type, source) {
      const shader = glCtx.createShader(type);
      glCtx.shaderSource(shader, source);
      glCtx.compileShader(shader);
      if (!glCtx.getShaderParameter(shader, glCtx.COMPILE_STATUS)) {
        console.warn("Shader compilation error:", glCtx.getShaderInfoLog(shader));
        glCtx.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vs = createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER_SRC);
    const fs = createShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER_SRC);
    if (!vs || !fs) {
      setWebglActive(false);
      return;
    }

    const prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);

    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.warn("Program link error:", gl.getProgramInfoLog(prog));
      setWebglActive(false);
      return;
    }

    // Fullscreen quad buffer
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
    const uProgLoc = gl.getUniformLocation(prog, "u_progress");
    const uDarkLoc = gl.getUniformLocation(prog, "u_isDark");
    const uDotLoc = gl.getUniformLocation(prog, "u_dotScale");

    // Texture upload
    const tex = gl.createTexture();
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = src;

    let textureReady = false;

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
        setWebglActive(true);
        renderFrame();
      } catch (err) {
        console.warn("Texture load error:", err);
      }
    };

    function renderFrame() {
      if (!textureReady || !canvas) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.round(rect.width * dpr) || 540;
      const h = Math.round(rect.height * dpr) || 360;

      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      gl.viewport(0, 0, w, h);

      gl.useProgram(prog);
      gl.uniform1i(uTexLoc, 0);
      gl.uniform2f(uResLoc, w, h);
      gl.uniform1f(uProgLoc, progressRef.current);
      const isDark =
        document.documentElement.getAttribute("data-theme") === "dark" ||
        themeRef.current === "dark";
      gl.uniform1f(uDarkLoc, isDark ? 1.0 : 0.0);

      // Fine-art dot scale: 3.5px on desktop, 3.0px on mobile
      const isMobile = window.innerWidth <= 960;
      const baseDot = isMobile ? 3.0 : 3.5;
      gl.uniform1f(uDotLoc, baseDot * dpr);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
    }

    glStateRef.current = { renderFrame };

    // Initial render
    renderFrame();

    return () => {
      glStateRef.current = null;
      try {
        gl.deleteBuffer(buf);
        gl.deleteProgram(prog);
        gl.deleteShader(vs);
        gl.deleteShader(fs);
        gl.deleteTexture(tex);
        gl.getExtension("WEBGL_lose_context")?.loseContext();
      } catch (_e) {}
    };
  }, [src]);

  // Scroll listener & smooth parallax + halftone scrub loop
  useEffect(() => {
    const isReduced = checkPrefersReducedMotion();

    const updateScrollEffect = () => {
      const container = containerRef.current;
      const card = cardRef.current;
      const badge = badgeRef.current;
      const pillars = pillarsRef.current;
      const canvas = canvasRef.current;

      const scrollY = window.scrollY || window.pageYOffset || 0;
      const vh = window.innerHeight || 800;
      const isMobile = window.innerWidth <= 960;

      // Responsive scroll mapping:
      // - Desktop (> 960px): side-by-side at top of page, full transformation over 0 -> 260px
      // - Mobile (<= 960px): stacked below hero text, transforms smoothly as card enters comfortable viewport
      let progress = 0;
      if (!isMobile) {
        const scrollDistance = 260;
        progress = Math.min(1, Math.max(0, scrollY / scrollDistance));
      } else {
        const cardDocTop = card ? (card.getBoundingClientRect().top + scrollY) : 640;
        const startScroll = Math.max(40, cardDocTop - vh * 0.65);
        const endScroll = startScroll + 300;
        progress = Math.min(1, Math.max(0, (scrollY - startScroll) / (endScroll - startScroll)));
      }
      progressRef.current = progress;

      // 1. Update WebGL Halftone Shader
      if (glStateRef.current) {
        glStateRef.current.renderFrame();
      }

      // Smooth canvas opacity crossfade:
      // At scroll 0: opacity 0 (original photo shows underneath with 100% native clarity)
      // As scroll proceeds: opacity becomes 1, displaying progressive halftone transformation
      if (canvas) {
        canvas.style.opacity = progress <= 0.005 ? "0" : "1";
      }

      // 2. Subtle, restrained motion (parallax upward + scale)
      if (!isReduced) {
        const translateY = -progress * (isMobile ? 16 : 28);
        const scale = 1.0 + progress * (isMobile ? 0.015 : 0.024);
        const rotX = progress * (isMobile ? 0 : 1.4);
        const rotY = -progress * (isMobile ? 0 : 1.2);

        if (card) {
          card.style.transform = `translate3d(0, ${translateY.toFixed(1)}px, 0) scale(${scale.toFixed(4)}) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg)`;
        }

        // Differential layered depth on floating badges
        if (badge) {
          const badgeY = -progress * (isMobile ? 10 : 18);
          badge.style.transform = `translate3d(0, ${badgeY.toFixed(1)}px, 0)`;
        }
        if (pillars) {
          const pillarsY = -progress * (isMobile ? 18 : 36);
          pillars.style.transform = `translate3d(0, ${pillarsY.toFixed(1)}px, 0)`;
        }
      }
    };

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        animFrameRef.current = requestAnimationFrame(() => {
          updateScrollEffect();
          ticking = false;
        });
      }
    };

    const onResize = () => {
      updateScrollEffect();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });

    // Initial sync
    updateScrollEffect();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  return React.createElement(
    motion.div,
    {
      ref: containerRef,
      className: "hero-visual-stage halftone-portrait-container",
      initial: { opacity: 0, scale: 0.96 },
      animate: { opacity: 1, scale: 1 },
      transition: { duration: 0.55, delay: 0.08 },
      "aria-label": "Md. Fardin Hossain — AI Engineer & Full-Stack Developer Editorial Showcase"
    },
    // Top-Left Floating Badge
    React.createElement(
      "div",
      { ref: badgeRef, className: "hero-annotation-badge" },
      React.createElement("span", { className: "red-dot" }),
      React.createElement("span", null, annotation)
    ),

    // Main Portrait Card with Layered WebGL Halftone Canvas
    React.createElement(
      "div",
      { ref: cardRef, className: "hero-portrait-card halftone-stage-card" },
      // Original Photographic Portrait (Guarantees zero layout shift, SEO, accessibility)
      React.createElement("img", {
        src: src,
        alt: alt,
        className: "hero-portrait-img",
        loading: "eager",
        fetchPriority: "high"
      }),

      // WebGL Halftone Overlay Canvas (Active when scrolling)
      React.createElement("canvas", {
        ref: canvasRef,
        className: `hero-portrait-halftone-canvas ${webglActive ? "is-ready" : ""}`,
        "aria-hidden": "true"
      })
    ),

    // Bottom-Right Floating Engineering Pillars
    React.createElement(
      "div",
      {
        ref: pillarsRef,
        className: "hero-pillars-float",
        "aria-label": "Engineering workflow pillars"
      },
      pillars.map((item) => React.createElement("span", { key: item }, item))
    )
  );
}
