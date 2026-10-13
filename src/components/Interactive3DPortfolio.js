"use client";

import { useRef, useState, useCallback, useEffect, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import fontData from "../../public/fonts/helvetiker_bold.typeface.json";

/* ══════════════════════════════════════════════════════════════════════════════
   STYLING & COLORS — Premium 3D Typography
   ══════════════════════════════════════════════════════════════════════════════ */
const COLORS = {
  letterColor: "#f8fafc",
  keyLight: "#ffffff",
  fillLight: "#e2e8f0",
  rimLight: "#8b5cf6", // Subtle violet rim accent to match the portfolio theme
};

/* ══════════════════════════════════════════════════════════════════════════════
   AUTHENTIC 3D "MC" MONOGRAM
   Uses real Helvetica Bold typeface geometry for perfect letterforms,
   clean unpointed M apex, tight kerning, and smooth rounded bevels.
   ══════════════════════════════════════════════════════════════════════════════ */
function MonogramMC() {
  const { mGeometry, cGeometry } = useMemo(() => {
    const loader = new FontLoader();
    const font = loader.parse(fontData);

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

    const mGeom = new TextGeometry("M", textOptions);
    mGeom.center();

    const cGeom = new TextGeometry("C", textOptions);
    cGeom.center();

    return { mGeometry: mGeom, cGeometry: cGeom };
  }, []);

  return (
    // Scaled to 0.76 with tight kerning so it NEVER touches container edges
    <group scale={[0.76, 0.76, 0.76]}>
      {/* Letter M */}
      <mesh geometry={mGeometry} position={[-0.57, 0, 0]}>
        <meshStandardMaterial
          color={COLORS.letterColor}
          roughness={0.22}
          metalness={0.12}
        />
      </mesh>

      {/* Letter C — tight kerning gap matching reference logo */}
      <mesh geometry={cGeometry} position={[0.55, 0, 0]}>
        <meshStandardMaterial
          color={COLORS.letterColor}
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
function Scene() {
  const mainGroupRef = useRef();
  const floatGroupRef = useRef();
  const { gl } = useThree();

  const isDraggingRef = useRef(false);
  const [isHovered, setIsHovered] = useState(false);

  // Rotation limits & spring damping
  const MAX_ROT_X = THREE.MathUtils.degToRad(25);
  const MAX_ROT_Y = THREE.MathUtils.degToRad(38);
  const DRAG_LERP = 0.14;
  const RESET_LERP = 0.05;

  const targetRotation = useRef({ x: 0, y: 0 });
  const currentRotation = useRef({ x: 0, y: 0 });

  const dragStart = useRef({ x: 0, y: 0 });
  const rotationStart = useRef({ x: 0, y: 0 });

  /* ── Drag Handlers (Natural / Non-Inverted) ── */
  const onPointerDown = useCallback(
    (e) => {
      e.stopPropagation();
      isDraggingRef.current = true;
      dragStart.current = { x: e.clientX, y: e.clientY };
      rotationStart.current = { ...targetRotation.current };
      gl.domElement.style.cursor = "grabbing";
    },
    [gl]
  );

  useEffect(() => {
    const handleMove = (e) => {
      if (!isDraggingRef.current) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

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
        targetRotation.current = { x: 0, y: 0 };
        gl.domElement.style.cursor = isHovered ? "grab" : "default";
      }
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
    window.addEventListener("touchmove", handleMove, { passive: false });
    window.addEventListener("touchend", handleUp);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("touchend", handleUp);
    };
  }, [gl, isHovered]);

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

    mainGroupRef.current.rotation.x = currentRotation.current.x;
    mainGroupRef.current.rotation.y = currentRotation.current.y;

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
      <StudioLights />

      {/* Drag Group with subtle resting angle */}
      <group
        ref={mainGroupRef}
        position={[0, 0, 0]}
        rotation={[THREE.MathUtils.degToRad(3), THREE.MathUtils.degToRad(-10), 0]}
      >
        {/* Floating Idle Animation Group */}
        <group ref={floatGroupRef}>
          <group
            onPointerDown={onPointerDown}
            onPointerEnter={() => {
              setIsHovered(true);
              if (!isDraggingRef.current) gl.domElement.style.cursor = "grab";
            }}
            onPointerLeave={() => {
              setIsHovered(false);
              if (!isDraggingRef.current) gl.domElement.style.cursor = "default";
            }}
          >
            <MonogramMC />
          </group>
        </group>
      </group>

      {/* Soft Contact Shadow beneath floating letters */}
      <ContactShadows
        position={[0, -0.92, 0]}
        opacity={0.35}
        scale={4.0}
        blur={2.5}
        far={3}
        color="#000000"
      />
    </>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   CANVAS CONTAINER
   ══════════════════════════════════════════════════════════════════════════════ */
export default function Interactive3DPortfolio({ className = "" }) {
  return (
    <div
      className={`relative ${className}`}
      style={{
        width: "100%",
        height: "100%",
        minHeight: "440px",
        touchAction: "none",
        background:
          "radial-gradient(circle at 50% 50%, rgba(139, 93, 232, 0.14) 0%, rgba(139, 93, 232, 0.03) 48%, transparent 72%)",
      }}
    >
      <Canvas
        camera={{
          // Generous camera distance to completely avoid clipping at any angle
          position: [0, 0.08, 4.4],
          fov: 30,
          near: 0.1,
          far: 50,
        }}
        resize={{ scroll: false, debounce: { scroll: 50, resize: 0 } }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
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
        <Scene />
      </Canvas>
    </div>
  );
}
