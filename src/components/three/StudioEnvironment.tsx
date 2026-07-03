"use client";

import { Environment, Lightformer } from "@react-three/drei";

/**
 * Procedural studio HDRI baked from area-light "softboxes" — gives the slab
 * real rolling reflections and specular highlights with NO external HDRI fetch
 * (CSP-safe / offline). One warm key, a cool fill, a top wash, and a copper
 * accent light so reflections pick up the brand metal.
 */
export function StudioEnvironment({ intensity = 1 }: { intensity?: number }) {
  return (
    <Environment resolution={256} frames={1}>
      {/* env-space backdrop (dark room so the slab is the only lit object) */}
      <color attach="background" args={["#0b0a0a"]} />

      {/* warm key softbox */}
      <Lightformer
        form="rect"
        intensity={3.2 * intensity}
        position={[3.5, 4, 4]}
        rotation={[-0.4, 0.2, 0]}
        scale={[5, 7, 1]}
        color="#fff3e0"
      />
      {/* cool fill */}
      <Lightformer
        form="rect"
        intensity={1.1 * intensity}
        position={[-5, 2.5, 2]}
        rotation={[0.2, -0.5, 0]}
        scale={[5, 6, 1]}
        color="#e8eeff"
      />
      {/* top wash for a clean gallery gradient */}
      <Lightformer
        form="rect"
        intensity={1.6 * intensity}
        position={[0, 6.5, -1]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={[9, 3, 1]}
        color="#ffffff"
      />
      {/* copper accent — rolls a warm glint across polished surfaces */}
      <Lightformer
        form="rect"
        intensity={2.0 * intensity}
        position={[4.5, -1.2, 3]}
        rotation={[0, -Math.PI / 3, 0]}
        scale={[3, 4, 1]}
        color="#b6702a"
      />
    </Environment>
  );
}
