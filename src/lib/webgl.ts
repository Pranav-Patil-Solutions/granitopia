/**
 * SSR-safe WebGL availability check. Used to decide whether to mount the 3D
 * slab viewer or fall back to a 2D image.
 */
export function isWebGLAvailable(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

/**
 * Heuristic: is this a capable desktop where we can afford the heavier render
 * path (post-processing: bloom / SSAO / DoF)? Keeps phones + weak GPUs light.
 */
export function isHighPerfDevice(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  const finePointer = window.matchMedia("(pointer: fine)").matches;
  const wide = window.matchMedia("(min-width: 1024px)").matches;
  const cores = (navigator as Navigator & { hardwareConcurrency?: number })
    .hardwareConcurrency;
  const enoughCores = cores === undefined || cores >= 4;
  return finePointer && wide && enoughCores;
}
