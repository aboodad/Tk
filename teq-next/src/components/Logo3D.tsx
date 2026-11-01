"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

type Props = {
  src: string;
  alt: string;
  size?: number;
  className?: string;
};

export function Logo3D({ src, alt, size = 44, className = "" }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [22, -22]), { stiffness: 200, damping: 18 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-22, 22]), { stiffness: 200, damping: 18 });

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const reset = () => {
    mx.set(0);
    my.set(0);
  };

  const s = { width: size, height: size };

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      className={`logo-3d relative shrink-0 ${className}`}
      style={{ ...s, perspective: 600 }}
    >
      {/* orbiting ring */}
      <span className="logo-3d-ring" aria-hidden />
      <span className="logo-3d-ring logo-3d-ring--2" aria-hidden />
      {/* glow */}
      <span className="logo-3d-glow" aria-hidden />

      <motion.div
        className="logo-3d-float relative h-full w-full"
        style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
      >
        {/* depth layers */}
        <span className="logo-3d-depth" style={{ transform: "translateZ(-10px) scale(0.96)" }} aria-hidden />
        <span className="logo-3d-depth" style={{ transform: "translateZ(-5px) scale(0.98)" }} aria-hidden />
        <img
          src={src}
          alt={alt}
          className="logo-3d-face relative h-full w-full rounded-full object-cover"
          style={{ transform: "translateZ(8px)" }}
          draggable={false}
        />
        <span className="logo-3d-shine" style={{ transform: "translateZ(12px)" }} aria-hidden />
      </motion.div>
    </div>
  );
}
