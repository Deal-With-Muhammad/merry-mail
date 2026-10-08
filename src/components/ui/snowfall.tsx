"use client";

import { useEffect, useRef } from "react";
import { cx } from "@/lib/utils";

type Flake = { x: number; y: number; r: number; speed: number; drift: number; phase: number; alpha: number };

/** A light, subtle snowfall on a canvas. Pauses when off-screen or with reduced motion. */
export function Snowfall({ density = 60, color = "255,255,255", className }: { density?: number; color?: string; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let flakes: Flake[] = [];
    let frame = 0;
    let visible = true;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const make = (y?: number): Flake => ({
      x: Math.random() * width,
      y: y ?? Math.random() * height,
      r: 0.8 + Math.random() * 2.4,
      speed: 0.25 + Math.random() * 0.7,
      drift: 0.3 + Math.random() * 0.8,
      phase: Math.random() * Math.PI * 2,
      alpha: 0.25 + Math.random() * 0.55,
    });

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round((density * width) / 1200);
      flakes = Array.from({ length: Math.max(12, count) }, () => make());
    };

    const tick = (time: number) => {
      ctx.clearRect(0, 0, width, height);
      for (const f of flakes) {
        f.y += f.speed;
        f.x += Math.sin(time / 1600 + f.phase) * f.drift * 0.35;
        if (f.y > height + 4) Object.assign(f, make(-4));
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color},${f.alpha})`;
        ctx.fill();
      }
      if (visible) frame = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      cancelAnimationFrame(frame);
      if (visible) frame = requestAnimationFrame(tick);
    });

    resize();
    observer.observe(canvas);
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, [density, color]);

  return <canvas ref={ref} aria-hidden className={cx("pointer-events-none absolute inset-0 h-full w-full", className)} />;
}
