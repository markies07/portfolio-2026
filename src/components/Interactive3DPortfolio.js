"use client";

import { useRef, useState, useCallback, useEffect, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import fontData from "../../public/fonts/helvetiker_bold.typeface.json";
import { useTheme } from "@/hooks/useTheme";

/* ══════════════════════════════════════════════════════════════════════════════
   STYLING & COLORS — Premium 3D Typography
   ══════════════════════════════════════════════════════════════════════════════ */
const COLORS = {
  letterColor: "#f8fafc",
  letterColorLight: "#2a2a2e", // graphite on the light theme, where white would vanish
  keyLight: "#ffffff",
  fillLight: "#e2e8f0",
  rimLight: "#8b5cf6", // Subtle violet rim accent to match the portfolio theme
};

// Resting three-quarter angle: the C recedes to the right, the M's left
// side shows its depth, and we look up at it slightly from below.
const REST_ROTATION = {
  x: THREE.MathUtils.degToRad(-9),
  y: THREE.MathUtils.degToRad(27),
};

/* ══════════════════════════════════════════════════════════════════════════════
   AUTHENTIC 3D "MC" MONOGRAM
   Uses real Helvetica Bold typeface geometry for perfect letterforms,
   clean unpointed M apex, tight kerning, and smooth rounded bevels.
   ══════════════════════════════════════════════════════════════════════════════ */
const LETTER_SCALE = 0.76; // scaled so it NEVER touches container edges
const LETTER_X = { M: -0.57, C: 0.55 }; // tight kerning matching the reference logo
const CAMERA = { fov: 30, position: [0, 0.08, 4.4] };

let lettersCache = null;
function getLetters() {
  if (lettersCache) return lettersCache;

  const font = new FontLoader().parse(fontData);
  const textOptions = {
    font,
    size: 1.05,
    depth: 0.22,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.028,
    bevelSize: 0.020,
    bevelOffset: 0,
    bevelSegments: 4,
  };

  const mGeometry = new TextGeometry("M", textOptions);
  mGeometry.center();
  const cGeometry = new TextGeometry("C", textOptions);
  cGeometry.center();

  lettersCache = { mGeometry, cGeometry };
  return lettersCache;
}

/**
 * The three-quarter turn plus perspective makes the near letter (M) look
 * bigger than the far one (C), which drags the *visual* middle of the pair
 * off to one side of the frame. This projects the rotated model through the
 * real camera and returns the world-space nudge that puts its on-screen
 * bounding box in the exact centre.
 */
let centeringCache = null;
function computeCenteringOffset() {
  if (centeringCache) return centeringCache;
  const { mGeometry, cGeometry } = getLetters();

  const camera = new THREE.PerspectiveCamera(CAMERA.fov, 1, 0.1, 50);
  camera.position.set(...CAMERA.position);
  camera.lookAt(0, 0, 0);
  camera.updateMatrixWorld(true);
  camera.updateProjectionMatrix();

  const rotation = new THREE.Matrix4().makeRotationFromEuler(
    new THREE.Euler(REST_ROTATION.x, REST_ROTATION.y, 0)
  );
  const parts = [
    [mGeometry, LETTER_X.M],
    [cGeometry, LETTER_X.C],
  ];
  // Half the frame's extent in world units at the model's distance
  const worldPerNdc = camera.position.z * Math.tan(THREE.MathUtils.degToRad(CAMERA.fov / 2));

  const offset = new THREE.Vector3();
  const v = new THREE.Vector3();

  for (let pass = 0; pass < 4; pass++) {
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;

    for (const [geometry, x] of parts) {
      const position = geometry.attributes.position;
      for (let i = 0; i < position.count; i++) {
        v.fromBufferAttribute(position, i);
        v.x += x;
        v.multiplyScalar(LETTER_SCALE);
        v.applyMatrix4(rotation);
        v.add(offset);
        v.project(camera);
        if (v.x < minX) minX = v.x;
        if (v.x > maxX) maxX = v.x;
        if (v.y < minY) minY = v.y;
        if (v.y > maxY) maxY = v.y;
      }
    }

    offset.x -= ((minX + maxX) / 2) * worldPerNdc;
    offset.y -= ((minY + maxY) / 2) * worldPerNdc;
  }

  centeringCache = offset;
  return offset;
}

function MonogramMC() {
  const { mGeometry, cGeometry } = useMemo(() => getLetters(), []);
  const { theme } = useTheme();
  const letterColor = theme === "light" ? COLORS.letterColorLight : COLORS.letterColor;

  return (
    <group scale={[LETTER_SCALE, LETTER_SCALE, LETTER_SCALE]}>
      {/* Letter M */}
      <mesh geometry={mGeometry} position={[LETTER_X.M, 0, 0]}>
        <meshStandardMaterial
          color={letterColor}
          roughness={0.22}
          metalness={0.12}
        />
      </mesh>

      {/* Letter C */}
      <mesh geometry={cGeometry} position={[LETTER_X.C, 0, 0]}>
        <meshStandardMaterial
          color={letterColor}
          roughness={0.22}
          metalness={0.12}
        />
      </mesh>
    </group>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   STUDIO LIGHTING
   Crisp, clean lighting bringing out the 3D typography bevels
   ══════════════════════════════════════════════════════════════════════════════ */
function StudioLights() {
  return (
    <>
      {/* Main Front-Right Key Light */}
      <directionalLight position={[4, 5, 5]} intensity={2.2} color={COLORS.keyLight} />

      {/* Front-Left Fill Light */}
      <directionalLight position={[-4, 3, 4]} intensity={1.2} color={COLORS.fillLight} />

      {/* Top Overhead Light */}
      <directionalLight position={[0, 6, 0]} intensity={1.0} color="#ffffff" />

      {/* Subtle Purple Rim Light from Back */}
      <directionalLight position={[0, 2, -5]} intensity={1.2} color={COLORS.rimLight} />

      {/* Ambient Light for Soft Shadow Fill */}
      <ambientLight intensity={1.1} color="#f1f5f9" />
    </>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   MAIN SCENE (Floating Idle + Smooth Draggable Interaction)
   ══════════════════════════════════════════════════════════════════════════════ */
// Drag rotation limits (relative to the resting angle) & spring damping
const MAX_ROT_X = THREE.MathUtils.degToRad(25);
const MAX_ROT_Y = THREE.MathUtils.degToRad(32);
const DRAG_LERP = 0.14;
const RESET_LERP = 0.05;

// Narrowest stage (width / height) the monogram fits at full size, with
// its margins. Narrower stages — phones — zoom the camera out to match, so
// the letters are never cropped at the sides.
const FIT_ASPECT = 0.95;

function FitCamera() {
  const get = useThree((state) => state.get);
  const width = useThree((state) => state.size.width);
  const height = useThree((state) => state.size.height);
  useEffect(() => {
    const { camera } = get();
    camera.zoom = height ? Math.min(1, width / height / FIT_ASPECT) : 1;
    camera.updateProjectionMatrix();
  }, [get, width, height]);
  return null;
}

function Scene() {
  const centerOffset = computeCenteringOffset();
  const mainGroupRef = useRef();
  const floatGroupRef = useRef();

  const isDraggingRef = useRef(false);
  const [isHovered, setIsHovered] = useState(false);

  const targetRotation = useRef({ x: 0, y: 0 });
  const currentRotation = useRef({ x: 0, y: 0 });

  const dragStart = useRef({ x: 0, y: 0 });
  const rotationStart = useRef({ x: 0, y: 0 });
  // Touch drags are held undecided until the finger has clearly moved one
  // way: up/down hands the gesture back to the page (scrolling), sideways
  // turns the model. Mouse drags rotate straight away.
  const touchIntent = useRef(null); // null | "pending" | "rotate"

  /* ── Drag Handlers (Natural / Non-Inverted) ── */
  const onPointerDown = useCallback(
    (e) => {
      e.stopPropagation();
      isDraggingRef.current = true;
      dragStart.current = { x: e.clientX, y: e.clientY };
      rotationStart.current = { ...targetRotation.current };
      touchIntent.current = e.pointerType === "touch" ? "pending" : null;
      if (e.pointerType !== "touch") document.body.style.cursor = "grabbing";
    },
    []
  );

  useEffect(() => {
    const handleMove = (e) => {
      if (!isDraggingRef.current) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      if (touchIntent.current === "pending") {
        const moveX = Math.abs(clientX - dragStart.current.x);
        const moveY = Math.abs(clientY - dragStart.current.y);
        if (Math.max(moveX, moveY) < 8) return;
        if (moveY > moveX) {
          // A scroll, not a drag — let the page have it
          isDraggingRef.current = false;
          touchIntent.current = null;
          return;
        }
        touchIntent.current = "rotate";
      }

      // Natural drag: right rotates right, down tilts down
      const dx = (clientX - dragStart.current.x) * 0.005;
      const dy = (clientY - dragStart.current.y) * 0.004;

      targetRotation.current = {
        x: THREE.MathUtils.clamp(rotationStart.current.x + dy, -MAX_ROT_X, MAX_ROT_X),
        y: THREE.MathUtils.clamp(rotationStart.current.y + dx, -MAX_ROT_Y, MAX_ROT_Y),
      };
    };

    const handleUp = () => {
      if (isDraggingRef.current) {
        isDraggingRef.current = false;
        touchIntent.current = null;
        targetRotation.current = { x: 0, y: 0 };
        document.body.style.cursor = isHovered ? "grab" : "";
      }
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
    // Passive: the page's own scrolling is never blocked from here
    window.addEventListener("touchmove", handleMove, { passive: true });
    window.addEventListener("touchend", handleUp);
    window.addEventListener("touchcancel", handleUp);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("touchend", handleUp);
      window.removeEventListener("touchcancel", handleUp);
    };
  }, [isHovered]);

  // Never leave a grab cursor stuck on the page after unmount
  useEffect(() => () => {
    document.body.style.cursor = "";
  }, []);

  /* ── Animation Render Loop ── */
  useFrame((state) => {
    if (!mainGroupRef.current || !floatGroupRef.current) return;
    const t = state.clock.elapsedTime;

    // Smooth return-to-center spring damping for drag rotation
    const lerpRate = isDraggingRef.current ? DRAG_LERP : RESET_LERP;
    currentRotation.current.x = THREE.MathUtils.lerp(
      currentRotation.current.x,
      targetRotation.current.x,
      lerpRate
    );
    currentRotation.current.y = THREE.MathUtils.lerp(
      currentRotation.current.y,
      targetRotation.current.y,
      lerpRate
    );

    // Drag offsets are applied on top of the resting angle, and spring
    // back to it on release
    mainGroupRef.current.rotation.x = REST_ROTATION.x + currentRotation.current.x;
    mainGroupRef.current.rotation.y = REST_ROTATION.y + currentRotation.current.y;

    // Smooth gentle floating bobbing animation
    const floatY = Math.sin(t * 1.4) * 0.045;
    const floatRotZ = Math.sin(t * 1.0) * 0.010;
    const floatRotX = Math.cos(t * 1.2) * 0.008;

    floatGroupRef.current.position.y = floatY;
    floatGroupRef.current.rotation.z = floatRotZ;
    floatGroupRef.current.rotation.x = floatRotX;
  });

  return (
    <>
      <FitCamera />
      <StudioLights />

      {/* Centering offset sits outside the rotation so dragging still pivots on the model */}
      <group position={[centerOffset.x, centerOffset.y, 0]}>
      {/* Drag Group with three-quarter resting angle */}
      <group
        ref={mainGroupRef}
        position={[0, 0, 0]}
        rotation={[REST_ROTATION.x, REST_ROTATION.y, 0]}
      >
        {/* Floating Idle Animation Group */}
        <group ref={floatGroupRef}>
          <group
            onPointerDown={onPointerDown}
            onPointerEnter={() => {
              setIsHovered(true);
              if (!isDraggingRef.current) document.body.style.cursor = "grab";
            }}
            onPointerLeave={() => {
              setIsHovered(false);
              if (!isDraggingRef.current) document.body.style.cursor = "";
            }}
          >
            <MonogramMC />
          </group>
        </group>
      </group>
      </group>
    </>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   CANVAS CONTAINER
   ══════════════════════════════════════════════════════════════════════════════ */
/**
 * Builds the letter geometry and the centring offset ahead of time (both
 * cached), so the first render after scrolling to About doesn't stall the
 * page. Called from an idle callback once the site has settled.
 */
export function warmup() {
  computeCenteringOffset();
}

// Pixel ratio: up to 1.5 on screens that need it, dropped to 1 if the
// device can't hold the frame rate. Phones at 2x+ are dense enough that
// MSAA is wasted GPU time, so they render without it.
const MAX_DPR = 1.5;

export default function Interactive3DPortfolio({ className = "" }) {
  const containerRef = useRef(null);
  const [visible, setVisible] = useState(true);
  const [dpr, setDpr] = useState(() => Math.min(MAX_DPR, Math.max(1, window.devicePixelRatio || 1)));
  const [antialias] = useState(() => (window.devicePixelRatio || 1) < 2);

  // Stop the render loop entirely while the canvas is scrolled out of view
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      style={{
        width: "100%",
        height: "100%",
        // Vertical swipes scroll the page; horizontal ones reach the drag
        // handler. ("none" made the whole stage a dead zone for scrolling.)
        touchAction: "pan-y",
        background:
          "radial-gradient(circle at 50% 50%, rgba(139, 93, 232, 0.14) 0%, rgba(139, 93, 232, 0.03) 48%, transparent 72%)",
      }}
    >
      <Canvas
        frameloop={visible ? "always" : "never"}
        camera={{
          // Generous camera distance to completely avoid clipping at any angle
          position: CAMERA.position,
          fov: CAMERA.fov,
          near: 0.1,
          far: 50,
        }}
        resize={{ scroll: false, debounce: { scroll: 50, resize: 0 } }}
        dpr={dpr}
        gl={{
          antialias,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
          alpha: true,
        }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      >
        <PerformanceMonitor onDecline={() => setDpr(1)} onIncline={() => setDpr(Math.min(MAX_DPR, window.devicePixelRatio || 1))} flipflops={3} onFallback={() => setDpr(1)}>
          <Scene />
        </PerformanceMonitor>
      </Canvas>
    </div>
  );
}
