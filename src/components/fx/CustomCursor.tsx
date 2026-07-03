"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { prefersReducedMotion } from "@/lib/motion";

/** Minimal dot + ring cursor that grows over interactive elements. Desktop only. */
export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 320, damping: 28, mass: 0.5 });
  const ringY = useSpring(y, { stiffness: 320, damping: 28, mass: 0.5 });

  useEffect(() => {
    const fine =
      window.matchMedia("(pointer: fine)").matches && !prefersReducedMotion();
    if (!fine) return;
    setEnabled(true);
    document.body.classList.add("cursor-hidden");

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const el = e.target as HTMLElement;
      setHovering(!!el.closest("a, button, input, textarea, [role='button']"));
    };
    window.addEventListener("mousemove", move);
    return () => {
      window.removeEventListener("mousemove", move);
      document.body.classList.remove("cursor-hidden");
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[90] hidden md:block">
      {/* dot */}
      <motion.div
        className="absolute h-1.5 w-1.5 rounded-full bg-copper"
        style={{ x, y, translateX: "-50%", translateY: "-50%" }}
      />
      {/* ring */}
      <motion.div
        className="absolute rounded-full border border-copper/60"
        style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
        animate={{
          width: hovering ? 56 : 30,
          height: hovering ? 56 : 30,
          opacity: hovering ? 1 : 0.6,
        }}
        transition={{ type: "spring", stiffness: 260, damping: 24 }}
      />
    </div>
  );
}
