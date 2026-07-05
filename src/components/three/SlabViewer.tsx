"use client";

import * as THREE from "three";
import { Canvas, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  ContactShadows,
  RoundedBox,
  MeshReflectorMaterial,
} from "@react-three/drei";
import { EffectComposer, Bloom, SSAO, DepthOfField } from "@react-three/postprocessing";
import { Suspense, useEffect } from "react";
import type { Finish, Stone } from "@/data/stones";
import { prefersReducedMotion } from "@/lib/motion";
import { useStoneMaterial } from "./StoneMaterial";
import { StudioEnvironment } from "./StudioEnvironment";

export type Lighting = "gallery" | "showroom" | "evening";

type Preset = {
  bg: string;
  env: number;
  exposure: number;
  ambient: number;
  key: { pos: [number, number, number]; intensity: number; color: string };
};

const PRESETS: Record<Lighting, Preset> = {
  gallery: {
    bg: "#1a1512",
    env: 1.0,
    exposure: 1.05,
    ambient: 0.32,
    key: { pos: [4, 6, 5], intensity: 1.6, color: "#fff4e0" },
  },
  showroom: {
    bg: "#181a1e",
    env: 1.3,
    exposure: 1.18,
    ambient: 0.5,
    key: { pos: [3, 7, 6], intensity: 1.9, color: "#ffffff" },
  },
  evening: {
    bg: "#100b09",
    env: 0.72,
    exposure: 0.96,
    ambient: 0.2,
    key: { pos: [5, 4, 4], intensity: 1.5, color: "#ffcf8a" },
  },
};

function Slab({ stone, finish }: { stone: Stone; finish: Finish }) {
  const material = useStoneMaterial(stone, finish);
  return (
    // Eased edges: real cut slabs have a fine chamfer that catches a bright
    // specular line along the rim — a hard box reads as CGI. RoundedBox gives
    // that rim highlight cheaply.
    <RoundedBox
      args={[2.2, 3, 0.16]}
      radius={0.014}
      smoothness={5}
      bevelSegments={4}
      rotation={[0, -0.42, 0]}
      position={[0, 0.15, 0]}
      material={material}
      castShadow
      receiveShadow
    />
  );
}

/**
 * Polished showroom floor. A blurred planar reflection grounds the slab the way
 * a real gallery floor would — the single biggest "is this real?" cue. Renders
 * an extra pass, so it's gated to capable devices by the caller.
 */
function ReflectiveFloor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.36, 0]} receiveShadow>
      <planeGeometry args={[16, 16]} />
      <MeshReflectorMaterial
        resolution={512}
        mixBlur={1}
        mixStrength={1.1}
        blur={[420, 220]}
        roughness={0.85}
        depthScale={1.1}
        minDepthThreshold={0.4}
        maxDepthThreshold={1.3}
        color="#0e0b0a"
        metalness={0.35}
      />
    </mesh>
  );
}

/** Keeps ACES exposure in sync with the active lighting preset. */
function Exposure({ value }: { value: number }) {
  const gl = useThree((s) => s.gl);
  useEffect(() => {
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = value;
  }, [gl, value]);
  return null;
}

function CinematicEffects() {
  return (
    <EffectComposer enableNormalPass multisampling={4}>
      <SSAO
        intensity={18}
        radius={0.08}
        luminanceInfluence={0.5}
        color={new THREE.Color("black")}
        worldDistanceThreshold={1}
        worldDistanceFalloff={1}
        worldProximityThreshold={1}
        worldProximityFalloff={1}
      />
      <Bloom
        luminanceThreshold={0.72}
        luminanceSmoothing={0.3}
        intensity={0.55}
        mipmapBlur
      />
      <DepthOfField focusDistance={0.015} focalLength={0.06} bokehScale={1.6} />
    </EffectComposer>
  );
}

/**
 * Interactive 3D slab. Default export so it can be lazy-loaded with
 * next/dynamic ({ ssr: false }) from the stone detail viewer.
 */
export default function SlabViewer({
  stone,
  finish,
  lighting = "gallery",
  post = false,
}: {
  stone: Stone;
  finish: Finish;
  lighting?: Lighting;
  post?: boolean;
}) {
  const p = PRESETS[lighting];
  const reduced = prefersReducedMotion();

  return (
    <Canvas
      camera={{ position: [0, 0, 5.2], fov: 38 }}
      dpr={[1, reduced ? 1.5 : 2]}
      shadows
      gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
    >
      <Exposure value={p.exposure} />
      <color attach="background" args={[p.bg]} />
      <StudioEnvironment intensity={p.env} />

      <ambientLight intensity={p.ambient} />
      <directionalLight
        position={p.key.pos}
        intensity={p.key.intensity}
        color={p.key.color}
        castShadow
        shadow-mapSize={post ? [2048, 2048] : [1024, 1024]}
        shadow-bias={-0.0004}
      />

      <Suspense fallback={null}>
        <Slab stone={stone} finish={finish} />
        {/* Reflective floor only on capable devices (extra render pass). */}
        {post && !reduced && <ReflectiveFloor />}
      </Suspense>

      <ContactShadows
        position={[0, -1.35, 0]}
        opacity={post ? 0.4 : 0.55}
        scale={9}
        blur={2.8}
        far={4}
        resolution={512}
        color="#000000"
      />

      <OrbitControls
        enablePan={false}
        minDistance={3.6}
        maxDistance={8}
        enableDamping
        autoRotate={!reduced}
        autoRotateSpeed={0.5}
      />

      {post && !reduced && <CinematicEffects />}
    </Canvas>
  );
}
