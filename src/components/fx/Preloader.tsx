"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Logo } from "@/components/brand/Logo";
import { prefersReducedMotion } from "@/lib/motion";

const KEY = "granitopia-preloaded";

/** Brand curtain reveal on first load (once per session). */
export function Preloader() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion() || sessionStorage.getItem(KEY)) return;
    // Whether to show the curtain is a client-only decision (sessionStorage +
    // reduced-motion) that also gates the framer-motion exit animation, so it
    // can't be a lazy initial state without an SSR/hydration mismatch. The one
    // synchronous setState here is intentional and runs once on first visit.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setShow(true);
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => {
      sessionStorage.setItem(KEY, "1");
      setShow(false);
      document.body.style.overflow = "";
    }, 1900);
    return () => {
      clearTimeout(t);
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-dark"
          initial={{ opacity: 1 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        >
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-white"
          >
            <Logo
              variant="lockup"
              markClassName="h-12 w-12"
              wordmarkClassName="text-[2rem]"
            />
          </motion.div>
          <div className="mt-6 h-px w-40 overflow-hidden bg-white/15">
            <motion.div
              className="h-full bg-copper"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformOrigin: "left" }}
            />
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-4 text-[10px] uppercase tracking-[0.4em] text-white/40"
          >
            Utopia of Natural Stones
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
