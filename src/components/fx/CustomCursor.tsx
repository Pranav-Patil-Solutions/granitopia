"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { prefersReducedMotion } from "@/lib/motion";

// Module-level state survives the [locale] layout remount a language switch
// triggers (GRN-BUG-017): a ref-count owns the shared body.cursor-hidden class
// so an unmounting instance can never strip it while a freshly-mounted one is
// still live, and lastPos seeds the new instance so the cursor never jumps.
let cursorOwners = 0;
const lastPos = { x: -100, y: -100 };

function acquireCursorHidden() {
  if (cursorOwners++ === 0) document.body.classList.add("cursor-hidden");
}
function releaseCursorHidden() {
  if (--cursorOwners <= 0) {
    cursorOwners = 0;
    document.body.classList.remove("cursor-hidden");
  }
}

/** Minimal dot + ring cursor that grows over interactive elements. Desktop only. */
export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);

  // Seed from the last known pointer position so a locale-switch remount keeps
  // the cursor (and its spring ring) exactly where it was — no top-left jump.
  const x = useMotionValue(lastPos.x);
  const y = useMotionValue(lastPos.y);
  const ringX = useSpring(x, { stiffness: 320, damping: 28, mass: 0.5 });
  const ringY = useSpring(y, { stiffness: 320, damping: 28, mass: 0.5 });

  useEffect(() => {
    const fine =
      window.matchMedia("(pointer: fine)").matches && !prefersReducedMotion();
    if (!fine) return;
    setEnabled(true);
    // Ref-counted ownership guard: chosen over a plain add/remove because the
    // remount interleaves new-mount and old-unmount over the SAME body class.
    acquireCursorHidden();
    x.set(lastPos.x);
    y.set(lastPos.y);

    const move = (e: MouseEvent) => {
      lastPos.x = e.clientX;
      lastPos.y = e.clientY;
      x.set(e.clientX);
      y.set(e.clientY);
      const el = e.target as HTMLElement;
      setHovering(!!el.closest("a, button, input, textarea, [role='button']"));
    };
    window.addEventListener("mousemove", move);
    return () => {
      window.removeEventListener("mousemove", move);
      releaseCursorHidden();
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[90] hidden md:block">
      {/* dot — left-0 top-0 anchors the transform origin so x/y read the same
          in RTL as LTR (without it, absolute's origin flips to the right edge
          under dir=rtl and the cursor lands off-screen). */}
      <motion.div
        className="absolute left-0 top-0 h-1.5 w-1.5 rounded-full bg-copper"
        style={{ x, y, translateX: "-50%", translateY: "-50%" }}
      />
      {/* ring */}
      <motion.div
        className="absolute left-0 top-0 rounded-full border border-copper/60"
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
