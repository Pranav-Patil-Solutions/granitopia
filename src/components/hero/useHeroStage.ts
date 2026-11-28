import { useEffect, type RefObject } from "react";

const MAX_SHIFT = 12;
const MAX_TILT = 2;

function clamp(value: number, limit: number) {
  return Math.max(-limit, Math.min(limit, value));
}

/**
 * Pointer tilt on a fine desktop pointer. Touch devices use deviceorientation
 * only when the browser does not ask for permission; otherwise the stage
 * eases with scroll. Transform only, lerped on a single animation frame.
 */
export function useHeroStage(
  sectionRef: RefObject<HTMLElement | null>,
  stageRef: RefObject<HTMLDivElement | null>,
  enabled: boolean,
) {
  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    if (!section || !stage || !enabled) {
      if (stage) stage.style.transform = "";
      return;
    }

    const fine =
      window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 768px)").matches;
    let current = { x: 0, y: 0, rx: 0, ry: 0 };
    let target = { x: 0, y: 0, rx: 0, ry: 0 };
    let frame = 0;
    let running = false;
    let orientation = false;

    const paint = () => {
      current = {
        x: current.x + (target.x - current.x) * 0.12,
        y: current.y + (target.y - current.y) * 0.12,
        rx: current.rx + (target.rx - current.rx) * 0.12,
        ry: current.ry + (target.ry - current.ry) * 0.12,
      };
      stage.style.transform = `perspective(900px) translate3d(${current.x.toFixed(2)}px, ${current.y.toFixed(2)}px, 0) rotateX(${current.rx.toFixed(2)}deg) rotateY(${current.ry.toFixed(2)}deg)`;
      const settled =
        Math.abs(target.x - current.x) < 0.05 &&
        Math.abs(target.y - current.y) < 0.05 &&
        Math.abs(target.rx - current.rx) < 0.02 &&
        Math.abs(target.ry - current.ry) < 0.02;
      if (settled) {
        running = false;
        return;
      }
      frame = requestAnimationFrame(paint);
    };

    const kick = () => {
      if (!running) {
        running = true;
        frame = requestAnimationFrame(paint);
      }
    };

    const onPointer = (event: PointerEvent) => {
      const rect = section.getBoundingClientRect();
      const nx = (event.clientX - rect.left) / rect.width - 0.5;
      const ny = (event.clientY - rect.top) / rect.height - 0.5;
      target = {
        x: clamp(nx * MAX_SHIFT * 2, MAX_SHIFT),
        y: clamp(ny * MAX_SHIFT * 2, MAX_SHIFT),
        ry: clamp(nx * MAX_TILT * 2, MAX_TILT),
        rx: clamp(-ny * MAX_TILT * 2, MAX_TILT),
      };
      kick();
    };

    const reset = () => {
      target = { x: 0, y: 0, rx: 0, ry: 0 };
      kick();
    };

    const onOrient = (event: DeviceOrientationEvent) => {
      if (event.gamma == null || event.beta == null) return;
      if (event.gamma === 0 && event.beta === 0) return;
      orientation = true;
      target = {
        x: clamp((event.gamma / 28) * MAX_SHIFT, MAX_SHIFT),
        y: clamp(((event.beta - 40) / 28) * MAX_SHIFT, MAX_SHIFT),
        ry: clamp((event.gamma / 40) * MAX_TILT, MAX_TILT),
        rx: clamp((-(event.beta - 40) / 40) * MAX_TILT, MAX_TILT),
      };
      kick();
    };

    const onScroll = () => {
      if (orientation) return;
      const y = clamp(window.scrollY * 0.035, MAX_SHIFT);
      target = { x: 0, y, rx: clamp((-y / MAX_SHIFT) * 1.2, MAX_TILT), ry: 0 };
      kick();
    };

    if (fine) {
      section.addEventListener("pointermove", onPointer);
      section.addEventListener("pointerleave", reset);
    } else {
      const orientationEvent = window.DeviceOrientationEvent as
        | (typeof DeviceOrientationEvent & { requestPermission?: () => Promise<string> })
        | undefined;
      const needsPermission = typeof orientationEvent?.requestPermission === "function";
      if (!needsPermission && orientationEvent) {
        window.addEventListener("deviceorientation", onOrient);
      }
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
    }

    return () => {
      cancelAnimationFrame(frame);
      section.removeEventListener("pointermove", onPointer);
      section.removeEventListener("pointerleave", reset);
      window.removeEventListener("deviceorientation", onOrient);
      window.removeEventListener("scroll", onScroll);
      stage.style.transform = "";
    };
  }, [enabled, sectionRef, stageRef]);
}
