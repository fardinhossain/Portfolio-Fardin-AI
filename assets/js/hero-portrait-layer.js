// ==========================================================================
// FARDIN.AI — CENTRAL PORTRAIT LAYER COMPONENT
// Composites the high-resolution cutout portrait with the WebGL
// fine halftone & edge silhouette dissolve shader canvas.
// ==========================================================================

import React, { useEffect, useRef, useState } from "react";
import { initHalftonePortraitShader } from "./hero-halftone-shader.js";

export function PortraitLayer({
  src = "assets/images/fardin_portrait_cutout.png",
  alt = "Md. Fardin Hossain — AI Engineer & Full-Stack Developer",
  onShaderReady = null
}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const imgRef = useRef(null);
  const shaderRef = useRef(null);
  const [webglActive, setWebglActive] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const shader = initHalftonePortraitShader(canvas, src);
    if (shader) {
      shaderRef.current = shader;
      setWebglActive(true);
      if (onShaderReady) {
        onShaderReady(shader);
      }
    }

    return () => {
      if (shaderRef.current) {
        shaderRef.current.dispose();
        shaderRef.current = null;
      }
    };
  }, [src]);

  return React.createElement(
    "div",
    {
      ref: containerRef,
      className: "cinematic-portrait-stage",
      "aria-label": "Md. Fardin Hossain — AI Engineer & Full-Stack Developer Editorial Visual"
    },
    // Base Photographic Cutout Image (Guarantees zero layout shift, SEO, accessibility, 100% natural color & detail)
    React.createElement("img", {
      ref: imgRef,
      src: src,
      alt: alt,
      className: "cinematic-portrait-img",
      loading: "eager",
      fetchPriority: "high"
    }),

    // WebGL Halftone & Dissolve Shader Canvas (Active on scroll)
    React.createElement("canvas", {
      ref: canvasRef,
      className: `cinematic-portrait-canvas ${webglActive ? "is-ready" : ""}`,
      "aria-hidden": "true"
    })
  );
}
