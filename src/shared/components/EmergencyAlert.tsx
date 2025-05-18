'use client';
import { FC, useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useEmergencyService, Emergency } from '@/modules/emergency/services/emergencyService';

const EmergencyAlert: FC = () => {
    const { getCriticalEmergencies, isLoading } = useEmergencyService();
    const [activeEmergencies, setActiveEmergencies] = useState<Emergency[]>([]);
    const [isVisible, setIsVisible] = useState<boolean>(true);
    const [currentIndex, setCurrentIndex] = useState<number>(0);

    useEffect(() => {
        const fetchEmergencies = async () => {
            const criticalEmergencies = await getCriticalEmergencies();
            setActiveEmergencies(criticalEmergencies);
        };

        fetchEmergencies();

        // Si hay múltiples emergencias, rotarlas cada 8 segundos
        if (activeEmergencies.length > 1) {
            const interval = setInterval(() => {
                setCurrentIndex((prevIndex) => (prevIndex + 1) % activeEmergencies.length);
            }, 8000);

            return () => clearInterval(interval);
        }
    }, []);

    // Si está cargando o no hay emergencias activas, no mostrar el componente
    if (isLoading || activeEmergencies.length === 0) {
        return null;
    }

    // Mostrar el elemento actual
    const emergency = activeEmergencies[currentIndex];

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className="bg-red-700 text-white"
                    initial={{ y: -100 }}
                    animate={{ y: 0 }}
                    exit={{ y: -100 }}
                    transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
                >
                    <div className="container mx-auto px-4 py-2">
                        <div className="flex flex-col md:flex-row items-center justify-between">
                            <motion.div
                                className="flex items-center mb-2 md:mb-0"
                                animate={{ x: [0, 5, 0] }}
                                transition={{
                                    duration: 1.5,
                                    repeat: 2,
                                    repeatType: "reverse",
                                    repeatDelay: 4
                                }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                <span className="text-sm font-bold mr-2 tracking-wide text-red-100">EMERGENCIA ACTIVA:</span>
                                <AnimatePresence mode="wait">
                                    <motion.span
                                        key={emergency.id}
                                        className="text-sm truncate"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        {emergency.title}
                                    </motion.span>
                                </AnimatePresence>
                                <span className="ml-2 bg-white text-red-700 text-xs font-bold px-2 py-0.5 rounded-full">
                                    {emergency.daysLeft} días
                                </span>
                            </motion.div>
                            <div className="flex items-center space-x-2">
                                <Link
                                    href={`/emergencias/${emergency.id}`}
                                    passHref
                                >
                                    <motion.div
                                        className="text-xs font-bold bg-white text-red-700 px-3 py-1 rounded-full hover:bg-gray-100 transition-colors flex items-center"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        Ayudar ahora
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </motion.div>
                                </Link>
                                <motion.button
                                    className="text-red-100 hover:text-white"
                                    onClick={() => setIsVisible(false)}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </motion.button>
                            </div>
                        </div>

                        {/* Indicador de múltiples emergencias si hay más de una */}
                        {activeEmergencies.length > 1 && (
                            <div className="flex justify-center mt-1 space-x-1">
                                {activeEmergencies.map((_, index) => (
                                    <span
                                        key={index}
                                        className={`block h-1 rounded-full ${index === currentIndex ? 'w-4 bg-white' : 'w-2 bg-red-300'
                                            } transition-all duration-300`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default EmergencyAlert;