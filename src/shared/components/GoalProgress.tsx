'use client';
import { FC, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface GoalProgressProps {
    current?: number;
    goal?: number;
    unit?: string;
    className?: string;
}

const GoalProgress: FC<GoalProgressProps> = ({
    current = 152000,
    goal = 200000,
    unit = '$',
    className = ''
}) => {
    const [animatedCurrent, setAnimatedCurrent] = useState(current);
    const [donationIncrement, setDonationIncrement] = useState<number | null>(null);

    useEffect(() => {
        const interval = setInterval(() => {
            const increment = Math.floor(Math.random() * 500) + 50; // Simula donaciones entre 50 y 550
            setDonationIncrement(increment);
            setAnimatedCurrent(prev => Math.min(prev + increment, goal));

            // Limpiar mensaje después de 1.5 segundos
            setTimeout(() => setDonationIncrement(null), 1500);
        }, 5000); // Cada 5 segundos

        return () => clearInterval(interval);
    }, [goal]);

    const progressPercent = Math.min(100, (animatedCurrent / goal) * 100);

    const formatNumber = (num: number): string => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(0) + 'k';
        return num.toString();
    };

    return (
        <div className={`relative ${className}`}>
            {/* Encabezado */}
            <div className="flex justify-between items-center mb-1">
                <span className="text-lg font-bold text-gray-600">NUESTRA META MENSUAL</span>
                <motion.span
                    key={animatedCurrent}
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-lg font-medium text-primary"
                >
                    {formatNumber(animatedCurrent)}{unit} / {formatNumber(goal)}{unit}
                </motion.span>
            </div>

            {/* Barra de progreso */}
            <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                    className="h-full"
                    animate={{
                        width: `${progressPercent}%`,
                        backgroundColor: ['#EF4444', '#F59E0B', '#22C55E']
                    }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                />
            </div>

            {/* Porcentaje */}
            <div className="text-xs font-medium text-gray-500 mt-1 text-center">
                {progressPercent.toFixed(0)}% completado
            </div>

            {/* Mensaje de donación flotante */}
            <AnimatePresence>
                {donationIncrement !== null && (
                    <motion.div
                        key={donationIncrement}
                        initial={{
                            opacity: 0,
                            y: 20,
                            scale: 0.8,
                            rotate: -10,
                        }}
                        animate={{
                            opacity: 1,
                            y: -20,
                            scale: 0.8,
                            rotate: 0,
                            //textShadow: '0px 0px 8px rgba(34, 197, 94, 0.8)',
                        }}
                        exit={{
                            opacity: 0,
                            y: -80,
                            scale: 0.6,
                            rotate: 10,
                        }}
                        transition={{
                            duration: 1.2,
                            ease: 'easeInOut',
                            type: 'spring',
                            stiffness: 120,
                            damping: 10,
                        }}
                        className="absolute right-4 top-0 text-green-500 font-extrabold text-xl pointer-events-none select-none"
                    >
                        +{donationIncrement}{unit}
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
};

export default GoalProgress;
