"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/** Thin copper reading-progress bar pinned to the top of the viewport. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{ scaleX, transformOrigin: "left" }}
      className="fixed inset-x-0 top-0 z-[80] h-0.5 bg-copper"
      aria-hidden="true"
    />
  );
}
