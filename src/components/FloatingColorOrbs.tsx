'use client';

import { motion, useMotionValue, useSpring, useTransform, MotionValue } from 'framer-motion';
import { useEffect, useState } from 'react';
import { PaletteEntry } from '@/lib/anthropic';

interface FloatingColorOrbsProps {
  palette: PaletteEntry[] | null;
  enabled?: boolean;
}

interface Orb {
  id: string;
  color: string;
  name: string;
  x: number;
  y: number;
  size: number;
  delay: number;
  parallaxStrength: number;
}

interface OrbComponentProps {
  orb: Orb;
  index: number;
  smoothMouseX: MotionValue<number>;
  smoothMouseY: MotionValue<number>;
}

function OrbComponent({ orb, index, smoothMouseX, smoothMouseY }: OrbComponentProps) {
  // Calculate parallax offset based on mouse position
  const parallaxX = useTransform(
    smoothMouseX,
    [0, typeof window !== 'undefined' ? window.innerWidth : 1920],
    [-20 * orb.parallaxStrength, 20 * orb.parallaxStrength]
  );
  const parallaxY = useTransform(
    smoothMouseY,
    [0, typeof window !== 'undefined' ? window.innerHeight : 1080],
    [-20 * orb.parallaxStrength, 20 * orb.parallaxStrength]
  );

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0 }}
      transition={{
        duration: 0.8,
        delay: orb.delay,
        ease: 'easeOut',
      }}
      style={{
        position: 'absolute',
        left: `${orb.x}%`,
        top: `${orb.y}%`,
        width: orb.size,
        height: orb.size,
        x: parallaxX,
        y: parallaxY,
      }}
      className="group"
    >
      {/* Orb with glassmorphism effect */}
      <motion.div
        animate={{
          y: [0, -20, 0],
        }}
        transition={{
          duration: 4 + index,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="relative w-full h-full"
      >
        {/* Glow effect */}
        <div
          className="absolute inset-0 rounded-full blur-3xl opacity-30"
          style={{
            backgroundColor: orb.color,
          }}
        />

        {/* Main orb */}
        <div
          className="absolute inset-2 rounded-full backdrop-blur-sm border border-white/20 shadow-2xl transition-transform duration-300 group-hover:scale-110"
          style={{
            background: `radial-gradient(circle at 30% 30%, ${orb.color}60, ${orb.color}40)`,
          }}
        >
          {/* Highlight */}
          <div
            className="absolute top-4 left-4 w-1/3 h-1/3 rounded-full bg-white/30 blur-md"
          />
        </div>

        {/* Tooltip on hover */}
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
          <div className="px-3 py-1 rounded-full bg-black/80 text-white text-xs font-medium backdrop-blur-sm">
            {orb.name}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function FloatingColorOrbs({ palette, enabled = true }: FloatingColorOrbsProps) {
  const [orbs, setOrbs] = useState<Orb[]>([]);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring physics for mouse movement
  const springConfig = { stiffness: 150, damping: 15 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  useEffect(() => {
    if (!palette || !enabled) {
      setOrbs([]);
      return;
    }

    // Generate orb positions
    const newOrbs: Orb[] = palette.map((entry, index) => ({
      id: `orb-${index}`,
      color: entry.hex,
      name: entry.name,
      x: 10 + (index * 80 / palette.length), // Distribute across screen
      y: 10 + (Math.random() * 60), // Random vertical position
      size: 120 + Math.random() * 80, // Random size between 120-200px
      delay: index * 0.1,
      parallaxStrength: 0.5 + Math.random() * 0.5, // Random parallax strength
    }));

    setOrbs(newOrbs);
  }, [palette, enabled]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  if (!enabled || orbs.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-5">
      {orbs.map((orb, index) => (
        <OrbComponent
          key={orb.id}
          orb={orb}
          index={index}
          smoothMouseX={smoothMouseX}
          smoothMouseY={smoothMouseY}
        />
      ))}
    </div>
  );
}
