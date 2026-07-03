"use client";

import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import { EffectComposer, Bloom, SSAO, DepthOfField } from "@react-three/postprocessing";
import { Suspense, useMemo, useRef } from "react";
import type { MotionValue } from "framer-motion";
import { getStone } from "@/data/stones";
import { useStoneMaterial } from "./StoneMaterial";
import { StudioEnvironment } from "./StudioEnvironment";
import { CHAPTERS, STORY_STONE_SLUG, type ChapterMood } from "./storyChapters";

const STONE = getStone(STORY_STONE_SLUG)!;
const N = CHAPTERS.length;

const smooth = (t: number) => t * t * (3 - 2 * t);
const clamp01 = (t: number) => Math.max(0, Math.min(1, t));
const lerp = THREE.MathUtils.lerp;

/** Pre-parse chapter colours once (avoid per-frame allocation). */
type Baked = Omit<ChapterMood, "bg" | "fog" | "ambient" | "light" | "emissive"> & {
  bg: THREE.Color;
  fogColor: THREE.Color;
  fogNear: number;
  fogFar: number;
  ambientColor: THREE.Color;
  ambientI: number;
  lightPos: THREE.Vector3;
  lightColor: THREE.Color;
  lightI: number;
  emissiveColor: THREE.Color;
  emissiveI: number;
};

function bake(c: ChapterMood): Baked {
  return {
    key: c.key,
    cam: c.cam,
    bg: new THREE.Color(c.bg),
    fogColor: new THREE.Color(c.fog.color),
    fogNear: c.fog.near,
    fogFar: c.fog.far,
    ambientColor: new THREE.Color(c.ambient.color),
    ambientI: c.ambient.intensity,
    lightPos: new THREE.Vector3(...c.light.pos),
    lightColor: new THREE.Color(c.light.color),
    lightI: c.light.intensity,
    emissiveColor: new THREE.Color(c.emissive.color),
    emissiveI: c.emissive.intensity,
    exposure: c.exposure,
    env: c.env,
    depth: c.depth,
    roughness: c.roughness,
    clearcoat: c.clearcoat,
    dust: c.dust,
  };
}

function DustField({ opacityRef }: { opacityRef: React.MutableRefObject<number> }) {
  const points = useRef<THREE.Points>(null);
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const n = 500;
    const arr = new Float32Array(n * 3);
    let seed = 20260703;
    const rand = () => {
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      return seed / 4294967296;
    };
    for (let i = 0; i < n; i++) {
      arr[i * 3] = (rand() - 0.5) * 12;
      arr[i * 3 + 1] = (rand() - 0.5) * 9;
      arr[i * 3 + 2] = (rand() - 0.5) * 8;
    }
    g.setAttribute("position", new THREE.BufferAttribute(arr, 3));
    return g;
  }, []);
  const mat = useMemo(
    () =>
      new THREE.PointsMaterial({
        color: "#cbb89a",
        size: 0.03,
        transparent: true,
        opacity: 0,
        depthWrite: false,
        sizeAttenuation: true,
      }),
    [],
  );
  useFrame((_, dt) => {
    mat.opacity = THREE.MathUtils.damp(mat.opacity, opacityRef.current * 0.5, 3, dt);
    if (points.current) points.current.rotation.y += dt * 0.03;
  });
  return <points ref={points} geometry={geo} material={mat} />;
}

function Rig({
  progress,
  mirror,
}: {
  progress: MotionValue<number>;
  mirror: boolean;
}) {
  const material = useStoneMaterial(STONE, "polished");
  const { scene, gl } = useThree();
  const mesh = useRef<THREE.Mesh>(null);
  const ambient = useRef<THREE.AmbientLight>(null);
  const dir = useRef<THREE.DirectionalLight>(null);
  const dustOpacity = useRef(0);
  const cur = useRef(0);
  const m = mirror ? -1 : 1;

  const baked = useMemo(() => CHAPTERS.map(bake), []);
  const bg = useMemo(() => new THREE.Color(baked[0].bg), [baked]);
  const fog = useMemo(
    () => new THREE.Fog(baked[0].fogColor.getHex(), baked[0].fogNear, baked[0].fogFar),
    [baked],
  );
  const tmpPos = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, dt) => {
    cur.current = THREE.MathUtils.damp(cur.current, progress.get(), 4, dt);
    const t = clamp01(cur.current);

    // locate segment + eased local t
    const f = t * (N - 1);
    const i = Math.min(N - 2, Math.floor(f));
    const e = smooth(clamp01(f - i));
    const a = baked[i];
    const b = baked[i + 1];

    // camera
    tmpPos.set(
      lerp(a.cam[0], b.cam[0], e) * m,
      lerp(a.cam[1], b.cam[1], e),
      lerp(a.cam[2], b.cam[2], e),
    );
    state.camera.position.copy(tmpPos);
    state.camera.lookAt(0, 0.15, 0);

    // background + fog (atmosphere transforms per chapter)
    bg.lerpColors(a.bg, b.bg, e);
    scene.background = bg;
    fog.color.lerpColors(a.fogColor, b.fogColor, e);
    fog.near = lerp(a.fogNear, b.fogNear, e);
    fog.far = lerp(a.fogFar, b.fogFar, e);
    scene.fog = fog;

    // lights (mood: deep-earth dark → daylight → studio → warm home)
    if (ambient.current) {
      ambient.current.color.lerpColors(a.ambientColor, b.ambientColor, e);
      ambient.current.intensity = lerp(a.ambientI, b.ambientI, e);
    }
    if (dir.current) {
      dir.current.position.set(
        lerp(a.lightPos.x, b.lightPos.x, e) * m,
        lerp(a.lightPos.y, b.lightPos.y, e),
        lerp(a.lightPos.z, b.lightPos.z, e),
      );
      dir.current.color.lerpColors(a.lightColor, b.lightColor, e);
      dir.current.intensity = lerp(a.lightI, b.lightI, e);
    }

    // the stone: glow-from-within, finish (raw→polished), block→slab
    material.emissive.lerpColors(a.emissiveColor, b.emissiveColor, e);
    material.emissiveIntensity = lerp(a.emissiveI, b.emissiveI, e);
    material.roughness = lerp(a.roughness, b.roughness, e);
    material.clearcoat = lerp(a.clearcoat, b.clearcoat, e);
    material.clearcoatRoughness = 0.1;
    material.envMapIntensity = lerp(a.env, b.env, e);
    const ns = lerp(1.05, 0.35, smooth(t));
    material.normalScale.set(ns, ns);

    if (mesh.current) {
      mesh.current.scale.z = lerp(a.depth, b.depth, e);
      mesh.current.rotation.y = -0.4 + t * 0.55 * m;
    }
    dustOpacity.current = lerp(a.dust, b.dust, e);

    gl.toneMappingExposure = lerp(a.exposure, b.exposure, e);
  });

  return (
    <>
      <ambientLight ref={ambient} intensity={0.14} color="#2a1810" />
      <directionalLight
        ref={dir}
        position={[3, 2, 4]}
        intensity={0.55}
        color="#ff7a2e"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <mesh ref={mesh} position={[0, 0.1, 0]} material={material} castShadow>
        <boxGeometry args={[2.2, 3, 0.16]} />
      </mesh>
      <DustField opacityRef={dustOpacity} />
    </>
  );
}

/**
 * Pinned, scroll-driven 3D film of one stone travelling through all five
 * chapters — the environment, light and mood transform, not just the material.
 * Default export for lazy loading; only mounted in the cinematic (non-reduced,
 * desktop) path. Chapter 1 is the initial state, so nothing else preloads.
 */
export default function StorySlab({
  progress,
  mirror = false,
  post = false,
}: {
  progress: MotionValue<number>;
  mirror?: boolean;
  post?: boolean;
}) {
  return (
    <Canvas
      camera={{ position: [-2, 0.6, 4.6], fov: 42 }}
      dpr={[1, post ? 2 : 1.5]}
      shadows
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.0,
      }}
    >
      <StudioEnvironment intensity={1} />
      <Suspense fallback={null}>
        <Rig progress={progress} mirror={mirror} />
      </Suspense>
      <ContactShadows
        position={[0, -1.65, 0]}
        opacity={0.5}
        scale={11}
        blur={3}
        far={5}
        resolution={512}
        color="#000000"
      />
      {post && (
        <EffectComposer enableNormalPass>
          <SSAO
            intensity={16}
            radius={0.08}
            luminanceInfluence={0.5}
            color={new THREE.Color("black")}
            worldDistanceThreshold={1}
            worldDistanceFalloff={1}
            worldProximityThreshold={1}
            worldProximityFalloff={1}
          />
          <Bloom
            luminanceThreshold={0.6}
            luminanceSmoothing={0.35}
            intensity={0.7}
            mipmapBlur
          />
          <DepthOfField focusDistance={0.02} focalLength={0.05} bokehScale={1.8} />
        </EffectComposer>
      )}
    </Canvas>
  );
}
