# Granitopia

An immersive, motion-rich **3D marketing site** — a premium brand experience built with real-time WebGL, cinematic scroll, and full internationalization.

## Highlights

- **Real-time 3D** with [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) + [`three`](https://threejs.org), composited with `@react-three/postprocessing` for depth-of-field, bloom, and grading.
- **Cinematic motion** — [GSAP](https://gsap.com) timelines and [Framer Motion](https://www.framer.com/motion/) transitions synced to [Lenis](https://lenis.darkroom.engineering) smooth-scroll.
- **Internationalized** out of the box via [`next-intl`](https://next-intl-docs.vercel.app) with locale-based routing (`/[locale]`).
- **Type-safe forms** with `react-hook-form` + `zod`, and privacy-friendly `@vercel/analytics`.

## Stack

Next.js (App Router) · React 19 · TypeScript · Three.js / R3F · GSAP · Framer Motion · Lenis · next-intl · Tailwind · Zod

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
```

```bash
npm run build && npm start   # production
npm run smoke:cursor         # locale + cursor interaction smoke test
```

## Structure

```
src/app/[locale]/   locale-routed pages (i18n)
messages/           translation catalogs
src/                3D scenes, motion, and UI components
tests/e2e/          interaction smoke tests
```
