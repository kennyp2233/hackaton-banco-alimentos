// components/EmojiFoodParticles.tsx

import React, { FC, memo, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Emojis y colores predefinidos
const FOOD_EMOJIS = ['🍎', '🍌', '🥔', '🥦', '🥕', '🍞', '🥚', '🧀', '🍚', '🥫'];
const HAPPY_EMOJIS = ['😊', '😃', '😄', '🙂', '😁'];
const CONFETTI_COLORS = ['#FF1E44', '#FFC107', '#2196F3', '#4CAF50', '#9C27B0', '#FF9800'];

// Generadores de partículas
const makeFoodParticles = (count: number, type: 'food' | 'happy') => {
    const emojis = type === 'food' ? FOOD_EMOJIS : HAPPY_EMOJIS;
    return Array.from({ length: count }, (_, i) => {
        const emoji = emojis[Math.floor(Math.random() * emojis.length)];
        const x = (Math.random() - 0.5) * 200;
        const y = -(Math.random() * 150 + 50);
        const scaleEnd = 0.8 + Math.random() * 0.7;
        return {
            id: `f-${Date.now()}-${i}`,
            emoji,
            initial: { x: 0, y: 0, opacity: 0, scale: 0 },
            animate: {
                x,
                y,
                opacity: [0, 1, 0],
                scale: [0, scaleEnd, 0],
                rotate: Math.random() * 360
            },
            transition: { duration: 1.2 + Math.random() * 0.8, ease: 'easeOut' }
        };
    });
};

const makeConfetti = (count: number) => {
    return Array.from({ length: count }, (_, i) => {
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.random() * 150 + 30;
        return {
            id: `c-${Date.now()}-${i}`,
            color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
            initial: { x: 0, y: 0, opacity: 0, scale: 0 },
            animate: {
                x: dist * Math.cos(angle),
                y: dist * Math.sin(angle),
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
                rotate: Math.random() * 360 * (Math.random() > 0.5 ? 1 : -1)
            },
            transition: { duration: 1.5 + Math.random(), ease: 'easeOut' },
            size: 3 + Math.random() * 7
        };
    });
};

interface ParticleProps {
    amount: number;
    isActive: boolean;
    type?: 'food' | 'happy';
    origin?: { x: number; y: number };
}

export const EmojiFoodParticles: FC<ParticleProps> = memo(({
    amount,
    isActive,
    type = 'food',
    origin = { x: 0, y: 0 }
}) => {
    const maxCount = Math.min(Math.floor(amount / 10) + 3, 15);

    const particles = useMemo(() => {
        if (!isActive || amount <= 0) return [];
        return makeFoodParticles(maxCount, type);
    }, [isActive, amount, type, maxCount]);

    return (
        <div
            className="absolute pointer-events-none overflow-visible z-10"
            style={{
                left: origin.x,
                top: origin.y
            }}
        >
            <AnimatePresence>
                {particles.map(p => (
                    <motion.div
                        key={p.id}
                        className="absolute text-xl"
                        initial={p.initial}
                        animate={p.animate}
                        exit={{ opacity: 0, scale: 0 }}
                        transition={p.transition}
                    >
                        {p.emoji}
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
});

interface ConfettiProps {
    isActive: boolean;
}

export const ConfettiExplosion: FC<ConfettiProps> = memo(({ isActive }) => {
    const particles = useMemo(() => {
        if (!isActive) return [];
        return makeConfetti(80);
    }, [isActive]);

    return (
        <div className="absolute inset-0 pointer-events-none overflow-visible z-10 flex items-center justify-center">
            <AnimatePresence>
                {particles.map(c => (
                    <motion.div
                        key={c.id}
                        className="absolute rounded-sm"
                        style={{ backgroundColor: c.color, width: c.size, height: c.size * 3 }}
                        initial={c.initial}
                        animate={c.animate}
                        exit={{ opacity: 0, scale: 0 }}
                        transition={c.transition}
                    />
                ))}
            </AnimatePresence>
        </div>
    );
});

export default EmojiFoodParticles;
