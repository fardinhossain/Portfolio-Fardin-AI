// ==========================================================================
// FARDIN.AI — CINEMATIC 3D FLYING ROBOT COMPONENT (Bot F-01)
// Lightweight Three.js procedural robot with glossy white shell, LED face,
// articulated limbs, red particle trail, and smooth 3D curved flight path.
// Travels behind the portrait, around the head, and rests beside the image.
// ==========================================================================

import * as THREE from "three";
import { getCurrentTheme, subscribeTheme } from "./theme-manager.js";

export function createFlyingRobot3D(canvasElement, options = {}) {
  if (!canvasElement) return null;

  const {
    onWordPass = null,
    onNameComplete = null,
    onFlightComplete = null
  } = options;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas: canvasElement,
      alpha: true,
      antialias: window.innerWidth >= 768
    });
  } catch (_e) {
    return null;
  }

  const isReduced = typeof window !== "undefined" && window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(canvasElement.clientWidth, canvasElement.clientHeight, false);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    45,
    Math.max(1, canvasElement.clientWidth) / Math.max(1, canvasElement.clientHeight),
    0.1,
    100
  );
  camera.position.set(0, 0, 16);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 1.25);
  scene.add(ambientLight);

  const dirLight = new THREE.DirectionalLight(0xffffff, 1.35);
  dirLight.position.set(6, 10, 12);
  scene.add(dirLight);

  const fillLight = new THREE.DirectionalLight(0xff304f, 0.45);
  fillLight.position.set(-8, -4, 6);
  scene.add(fillLight);

  // --- BOT F-01 MODEL GENERATOR ---
  let currentTheme = getCurrentTheme();
  const isDark = currentTheme === "dark";

  const whiteShellMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.14,
    metalness: 0.08
  });

  const softGrayMat = new THREE.MeshStandardMaterial({
    color: 0xe2e8f0,
    roughness: 0.32,
    metalness: 0.15
  });

  const darkJointMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    roughness: 0.42,
    metalness: 0.25
  });

  const visorMat = new THREE.MeshStandardMaterial({
    color: 0x050811,
    roughness: 0.08,
    metalness: 0.9
  });

  const primaryLedMat = new THREE.MeshBasicMaterial({
    color: isDark ? 0xff304f : 0xe11d48
  });

  const antennaTipMat = new THREE.MeshBasicMaterial({
    color: 0xfbbf24
  });

  const robotRoot = new THREE.Group();
  const bodyPivot = new THREE.Group();
  robotRoot.add(bodyPivot);

  // 1. Head
  const headGroup = new THREE.Group();
  headGroup.position.set(0, 0.52, 0);
  bodyPivot.add(headGroup);

  const headGeo = new THREE.SphereGeometry(0.44, 24, 20);
  headGeo.scale(1.15, 0.92, 0.96);
  headGroup.add(new THREE.Mesh(headGeo, whiteShellMat));

  // Obsidian Visor
  const visorGeo = new THREE.SphereGeometry(0.41, 20, 16);
  visorGeo.scale(1.05, 0.72, 0.65);
  const visor = new THREE.Mesh(visorGeo, visorMat);
  visor.position.set(0, -0.02, 0.18);
  headGroup.add(visor);

  // Glowing LED Eyes
  const eyeGeo = new THREE.CapsuleGeometry(0.045, 0.04, 6, 10).rotateZ(Math.PI * 0.5);
  const leftEye = new THREE.Mesh(eyeGeo, primaryLedMat);
  leftEye.position.set(-0.13, 0, 0.44);
  headGroup.add(leftEye);

  const rightEye = new THREE.Mesh(eyeGeo, primaryLedMat);
  rightEye.position.set(0.13, 0, 0.44);
  headGroup.add(rightEye);

  // Glint highlights
  const glintGeo = new THREE.SphereGeometry(0.016, 6, 6);
  const glintMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const leftGlint = new THREE.Mesh(glintGeo, glintMat);
  leftGlint.position.set(-0.11, 0.02, 0.47);
  headGroup.add(leftGlint);
  const rightGlint = new THREE.Mesh(glintGeo, glintMat);
  rightGlint.position.set(0.15, 0.02, 0.47);
  headGroup.add(rightGlint);

  // Ear Pods
  const earGeo = new THREE.CylinderGeometry(0.11, 0.11, 0.08, 14).rotateZ(Math.PI * 0.5);
  const leftEar = new THREE.Mesh(earGeo, softGrayMat);
  leftEar.position.set(-0.52, 0, 0);
  headGroup.add(leftEar);
  const rightEar = new THREE.Mesh(earGeo, softGrayMat);
  rightEar.position.set(0.52, 0, 0);
  headGroup.add(rightEar);

  const earRingGeo = new THREE.TorusGeometry(0.075, 0.016, 6, 16).rotateY(Math.PI * 0.5);
  const leftEarRing = new THREE.Mesh(earRingGeo, primaryLedMat);
  leftEarRing.position.set(-0.56, 0, 0);
  headGroup.add(leftEarRing);
  const rightEarRing = new THREE.Mesh(earRingGeo, primaryLedMat);
  rightEarRing.position.set(0.56, 0, 0);
  headGroup.add(rightEarRing);

  // Antenna
  const antennaStem = new THREE.Mesh(
    new THREE.CylinderGeometry(0.02, 0.025, 0.22, 8),
    softGrayMat
  );
  antennaStem.position.set(0, 0.46, 0);
  headGroup.add(antennaStem);

  const antennaTip = new THREE.Mesh(
    new THREE.SphereGeometry(0.045, 10, 10),
    antennaTipMat
  );
  antennaTip.position.set(0, 0.58, 0);
  headGroup.add(antennaTip);

  // 2. Torso & Collar
  const torsoGroup = new THREE.Group();
  bodyPivot.add(torsoGroup);

  const torso = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.33, 0.36, 12, 18),
    whiteShellMat
  );
  torsoGroup.add(torso);

  const collar = new THREE.Mesh(
    new THREE.TorusGeometry(0.34, 0.022, 8, 24).rotateX(Math.PI * 0.5),
    primaryLedMat
  );
  collar.position.set(0, 0.15, 0);
  torsoGroup.add(collar);

  // Chest Core Badge
  const chestBadge = new THREE.Mesh(
    new THREE.CylinderGeometry(0.09, 0.09, 0.03, 16).rotateX(Math.PI * 0.5),
    darkJointMat
  );
  chestBadge.position.set(0, 0.02, 0.33);
  torsoGroup.add(chestBadge);

  const chestLed = new THREE.Mesh(
    new THREE.CylinderGeometry(0.05, 0.05, 0.04, 14).rotateX(Math.PI * 0.5),
    primaryLedMat
  );
  chestLed.position.set(0, 0.02, 0.34);
  torsoGroup.add(chestLed);

  // 3. Articulated Mechanical Arms
  function buildArm(isLeft) {
    const armGroup = new THREE.Group();
    const side = isLeft ? -1 : 1;
    armGroup.position.set(side * 0.4, 0.1, 0);

    const shoulder = new THREE.Mesh(new THREE.SphereGeometry(0.07, 10, 10), darkJointMat);
    armGroup.add(shoulder);

    const upperArm = new THREE.Mesh(new THREE.CapsuleGeometry(0.042, 0.16, 6, 10), whiteShellMat);
    upperArm.position.set(side * 0.05, -0.09, 0.02);
    upperArm.rotation.z = side * 0.22;
    armGroup.add(upperArm);

    const hand = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), softGrayMat);
    hand.position.set(side * 0.08, -0.22, 0.05);
    armGroup.add(hand);

    return { armGroup, hand };
  }

  const leftArm = buildArm(true);
  const rightArm = buildArm(false);
  torsoGroup.add(leftArm.armGroup);
  torsoGroup.add(rightArm.armGroup);

  // 4. Thruster Nozzle & Antigravity Light
  const thrusterNozzle = new THREE.Mesh(
    new THREE.CylinderGeometry(0.13, 0.07, 0.12, 16),
    darkJointMat
  );
  thrusterNozzle.position.set(0, -0.34, 0);
  torsoGroup.add(thrusterNozzle);

  const thrusterGlow = new THREE.Mesh(
    new THREE.SphereGeometry(0.08, 12, 12),
    primaryLedMat
  );
  thrusterGlow.position.set(0, -0.41, 0);
  torsoGroup.add(thrusterGlow);

  robotRoot.scale.set(1.15, 1.15, 1.15);
  scene.add(robotRoot);

  // --- GLOWING RED PARTICLE TRAIL ---
  const MAX_TRAIL = 100;
  const trailGeo = new THREE.BufferGeometry();
  const trailPos = new Float32Array(MAX_TRAIL * 3);
  const trailAlpha = new Float32Array(MAX_TRAIL);
  trailGeo.setAttribute("position", new THREE.BufferAttribute(trailPos, 3));
  trailGeo.setAttribute("alpha", new THREE.BufferAttribute(trailAlpha, 1));

  const trailMat = new THREE.PointsMaterial({
    color: isDark ? 0xff304f : 0xe11d48,
    size: 0.18,
    transparent: true,
    opacity: 0.82,
    blending: THREE.AdditiveBlending
  });
  const trailPoints = new THREE.Points(trailGeo, trailMat);
  scene.add(trailPoints);

  // --- 3D FLIGHT PATH SPLINE ---
  // Sequence:
  // Phase B: Enters from offscreen right, flies left across headline (Hossain -> Fardin -> Md.)
  // Phase D: Curves upward along left side, dives behind head, orbits upper halo,
  //          glides past right shoulder without covering face, and rests beside portrait.
  const isMobile = window.innerWidth < 768;
  const curvePoints = isMobile
    ? [
        new THREE.Vector3(6.8, -1.35, 3.0),   // 0. Offscreen right
        new THREE.Vector3(3.2, -1.35, 2.5),   // 1. Entering headline
        new THREE.Vector3(1.8, -1.35, 2.2),   // 2. Over 'Hossain'
        new THREE.Vector3(0.0, -1.35, 2.2),   // 3. Over 'Fardin'
        new THREE.Vector3(-1.8, -1.35, 2.2),  // 4. Over 'Md.'
        new THREE.Vector3(-3.2, -0.8, 1.8),   // 5. Left sweep past name
        new THREE.Vector3(-3.0, 1.8, 0.2),    // 6. Upward along left side
        new THREE.Vector3(-2.0, 3.8, -3.2),   // 7. Behind upper left
        new THREE.Vector3(0.0, 4.5, -4.5),    // 8. Deep behind head top
        new THREE.Vector3(2.0, 3.8, -2.5),    // 9. Behind upper right
        new THREE.Vector3(3.0, 2.8, 0.5),     // 10. Emerging at right orbital
        new THREE.Vector3(2.8, 1.8, 1.2)      // 11. Resting hover beside portrait
      ]
    : [
        new THREE.Vector3(12.5, -1.35, 3.2),  // 0. Offscreen right entry
        new THREE.Vector3(8.0, -1.35, 2.8),   // 1. Entering headline space
        new THREE.Vector3(3.8, -1.35, 2.4),   // 2. Over 'Hossain'
        new THREE.Vector3(0.0, -1.35, 2.4),   // 3. Over 'Fardin'
        new THREE.Vector3(-3.8, -1.35, 2.4),  // 4. Over 'Md.'
        new THREE.Vector3(-6.2, -0.8, 1.8),   // 5. Left sweep past name
        new THREE.Vector3(-5.5, 2.0, 0.4),    // 6. Curving upward along left side
        new THREE.Vector3(-4.2, 4.2, -3.2),   // 7. Diving behind upper left
        new THREE.Vector3(-1.0, 5.2, -5.0),   // 8. Deep behind head top
        new THREE.Vector3(2.4, 4.8, -4.5),    // 9. Behind upper right
        new THREE.Vector3(4.8, 3.6, -0.8),    // 10. Emerging along right orbital ring
        new THREE.Vector3(4.8, 2.4, 0.8),     // 11. Gliding past right shoulder
        new THREE.Vector3(4.5, 1.8, 1.5)      // 12. Resting hover position
      ];

  const flightCurve = new THREE.CatmullRomCurve3(curvePoints);
  const restingPos = curvePoints[curvePoints.length - 1];

  let animProgress = isReduced ? 1.0 : 0.0;
  let flightActive = false;
  let isResting = isReduced;
  const trailHistory = [];
  const triggeredWords = { hossain: false, fardin: false, md: false, completed: false };

  // Theme Sync
  const unsubscribeTheme = subscribeTheme((newTheme) => {
    const darkNow = newTheme === "dark";
    primaryLedMat.color.setHex(darkNow ? 0xff304f : 0xe11d48);
    trailMat.color.setHex(darkNow ? 0xff304f : 0xe11d48);
  });

  // Render Loop
  let reqId = null;
  let isDisposed = false;

  function renderLoop() {
    if (isDisposed) return;
    reqId = requestAnimationFrame(renderLoop);

    // Update flight progress
    if (flightActive && animProgress < 1.0) {
      // Dynamic pacing: deliberate glide during name reveal (t < 0.45), smooth acceleration on orbit
      const step = animProgress < 0.45 ? 0.0034 : 0.0042;
      animProgress += step;
      if (animProgress >= 1.0) {
        animProgress = 1.0;
        flightActive = false;
        isResting = true;
        if (onFlightComplete) onFlightComplete();
      }
    }

    const t = Math.min(1.0, animProgress);
    const pos = flightCurve.getPointAt(t);

    // Word Reveal Triggers along right-to-left flight
    if (flightActive && onWordPass) {
      const hossainThreshold = isMobile ? 2.0 : 4.0;
      const fardinThreshold = isMobile ? 0.1 : 0.2;
      const mdThreshold = isMobile ? -2.0 : -3.6;

      if (!triggeredWords.hossain && pos.x <= hossainThreshold && pos.y < 0.2) {
        triggeredWords.hossain = true;
        onWordPass("hossain");
        // Particle burst
        for (let b = 0; b < 12; b++) {
          trailHistory.unshift({
            x: pos.x + (Math.random() - 0.5) * 0.4,
            y: pos.y - 0.35 + (Math.random() - 0.5) * 0.3,
            z: pos.z + (Math.random() - 0.5) * 0.4,
            life: 1.2
          });
        }
      }

      if (!triggeredWords.fardin && pos.x <= fardinThreshold && pos.y < 0.2) {
        triggeredWords.fardin = true;
        onWordPass("fardin");
        // Particle burst
        for (let b = 0; b < 12; b++) {
          trailHistory.unshift({
            x: pos.x + (Math.random() - 0.5) * 0.4,
            y: pos.y - 0.35 + (Math.random() - 0.5) * 0.3,
            z: pos.z + (Math.random() - 0.5) * 0.4,
            life: 1.2
          });
        }
      }

      if (!triggeredWords.md && pos.x <= mdThreshold && pos.y < 0.2) {
        triggeredWords.md = true;
        onWordPass("md");
        // Particle burst
        for (let b = 0; b < 16; b++) {
          trailHistory.unshift({
            x: pos.x + (Math.random() - 0.5) * 0.5,
            y: pos.y - 0.35 + (Math.random() - 0.5) * 0.4,
            z: pos.z + (Math.random() - 0.5) * 0.5,
            life: 1.4
          });
        }
        if (onNameComplete) onNameComplete();
      }
    }

    if (isResting) {
      // Gentle floating hover & slight bobbing
      const time = Date.now() * 0.0022;
      const hoverY = Math.sin(time) * 0.12;
      const hoverX = Math.cos(time * 0.7) * 0.06;
      pos.y = restingPos.y + hoverY;
      pos.x = restingPos.x + hoverX;
      pos.z = restingPos.z;

      robotRoot.rotation.y = THREE.MathUtils.lerp(robotRoot.rotation.y, Math.sin(time * 0.5) * 0.12 - 0.18, 0.08);
      robotRoot.rotation.x = THREE.MathUtils.lerp(robotRoot.rotation.x, Math.cos(time * 0.8) * 0.04, 0.08);
      robotRoot.rotation.z = THREE.MathUtils.lerp(robotRoot.rotation.z, 0, 0.08);

      // Subtle right arm wave
      rightArm.armGroup.rotation.z = -0.3 + Math.sin(time * 2.0) * 0.15;
    } else if (flightActive) {
      // Dynamic banking roll and pitch along flight path
      const tangent = flightCurve.getTangentAt(t);
      const lookTarget = pos.clone().add(tangent);
      robotRoot.lookAt(lookTarget);
      robotRoot.rotation.z = -tangent.x * 0.75;
    }

    robotRoot.position.copy(pos);

    // Update particle trail
    if (flightActive || (animProgress < 1.0 && animProgress > 0.02)) {
      trailHistory.unshift({ x: pos.x, y: pos.y - 0.38, z: pos.z, life: 1.0 });
      if (trailHistory.length > MAX_TRAIL) trailHistory.pop();
    }

    for (let i = 0; i < trailHistory.length; i++) {
      const p = trailHistory[i];
      p.life -= 0.022;
      trailPos[i * 3] = p.x;
      trailPos[i * 3 + 1] = p.y;
      trailPos[i * 3 + 2] = p.z;
      trailAlpha[i] = Math.max(0, p.life);
    }
    trailGeo.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
  }

  // Handle Resize
  function handleResize() {
    if (!canvasElement || isDisposed) return;
    const w = canvasElement.clientWidth;
    const h = canvasElement.clientHeight;
    camera.aspect = Math.max(1, w) / Math.max(1, h);
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  }

  window.addEventListener("resize", handleResize);
  renderLoop();

  // Public API
  return {
    startFlight() {
      if (isReduced) {
        animProgress = 1.0;
        isResting = true;
        if (onWordPass) {
          onWordPass("hossain");
          onWordPass("fardin");
          onWordPass("md");
        }
        if (onNameComplete) onNameComplete();
        if (onFlightComplete) onFlightComplete();
        return;
      }
      animProgress = 0.0;
      flightActive = true;
      isResting = false;
      triggeredWords.hossain = false;
      triggeredWords.fardin = false;
      triggeredWords.md = false;
    },
    skipFlight() {
      animProgress = 1.0;
      flightActive = false;
      isResting = true;
      trailHistory.length = 0;
      if (onWordPass) {
        if (!triggeredWords.hossain) { triggeredWords.hossain = true; onWordPass("hossain"); }
        if (!triggeredWords.fardin) { triggeredWords.fardin = true; onWordPass("fardin"); }
        if (!triggeredWords.md) { triggeredWords.md = true; onWordPass("md"); }
      }
      if (onNameComplete) onNameComplete();
      if (onFlightComplete) onFlightComplete();
    },
    resize() {
      handleResize();
    },
    dispose() {
      isDisposed = true;
      window.removeEventListener("resize", handleResize);
      unsubscribeTheme();
      if (reqId) cancelAnimationFrame(reqId);
      try {
        whiteShellMat.dispose();
        softGrayMat.dispose();
        darkJointMat.dispose();
        visorMat.dispose();
        primaryLedMat.dispose();
        antennaTipMat.dispose();
        trailMat.dispose();
        trailGeo.dispose();
        renderer.dispose();
      } catch (_e) {}
    }
  };
}
