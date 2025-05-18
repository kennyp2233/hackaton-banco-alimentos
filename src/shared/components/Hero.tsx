'use client';
import { FC, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import ParallaxBackground from '@/shared/components/ParallaxBackground';
import { IMAGES } from '@/shared/config/constants';

// Definimos las imágenes para el efecto parallax
const parallaxImages = [
    {
        src: IMAGES.parallax.tomatoe,
        alt: "Tomate",
        position: 'left' as const,
        speed: 30
    },
    {
        src: IMAGES.parallax.leaf,
        alt: "Hoja",
        position: 'right' as const,
        speed: 25
    },
    {
        src: IMAGES.parallax.bread,
        alt: "Pan",
        position: 'left' as const,
        speed: 20
    },
    {
        src: IMAGES.parallax.platain,
        alt: "Platano",
        position: 'right' as const,
        speed: 35
    },
];

const Hero: FC = () => {
    const [activeAmount, setActiveAmount] = useState<number | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const controls = useAnimation();

    // Opciones de donación rápida
    const quickDonationOptions = [10, 25, 50, 100];

    // Efecto de animación al cargar
    useEffect(() => {
        controls.start({
            scale: [0.97, 1],
            opacity: [0, 1],
            transition: { duration: 0.8, ease: "easeOut" }
        });

        // Simular apertura automática del CTA después de 1.5 segundos
        const timer = setTimeout(() => {
            setIsOpen(true);
        }, 1500);

        return () => clearTimeout(timer);
    }, [controls]);

    return (
        <div className="relative overflow-hidden min-h-[90vh] flex items-center">
            {/* Background con efecto parallax */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 overflow-hidden bg-gradient-to-r from-white/95 to-white/80">
                    <ParallaxBackground images={parallaxImages} />
                </div>
            </div>

            {/* Contenido principal */}
            <div className="relative text-gray-800 z-10 container mx-auto px-4 py-20 md:py-32 flex flex-col items-center">
                <motion.div
                    className="w-full max-w-4xl mx-auto text-center"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <motion.div
                        className="mb-8 inline-block"
                        animate={{
                            y: [0, -10, 0],
                            transition: {
                                duration: 2,
                                repeat: Infinity,
                                repeatType: "reverse"
                            }
                        }}
                    >
                        <span className="bg-primary text-white text-sm font-bold px-4 py-2 rounded-full">
                            JUNTOS CONTRA EL HAMBRE
                        </span>
                    </motion.div>

                    <motion.h1
                        className="text-4xl md:text-7xl font-bold mb-6 text-text-dark leading-tight"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        Cada donación es
                        <br />
                        <span className="text-primary">esperanza</span> compartida
                    </motion.h1>

                    <motion.p
                        className="text-lg md:text-xl mb-10 max-w-3xl mx-auto text-gray-700"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        Tu contribución ayuda a combatir la inseguridad alimentaria y reducir el desperdicio.
                        Cada donación permite que más familias tengan acceso a alimentos nutritivos.
                    </motion.p>

                    {/* CTA Innovador - Panel desplegable de donación rápida */}
                    <div className="relative mb-12">
                        <motion.div
                            className="flex flex-col sm:flex-row gap-4 justify-center"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                        >
                            <motion.button
                                onClick={() => setIsOpen(!isOpen)}
                                className={`bg-primary shadow-elevated ${isOpen ? 'bg-primary-dark' : 'hover:bg-primary-dark'} text-white font-bold py-4 px-10 rounded-full text-lg transition-all`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.98 }}
                                animate={isOpen ? { y: 0 } : { y: 0 }}
                            >
                                {isOpen ? 'Cerrar' : 'Donar ahora'}
                            </motion.button>

                            <Link href="/emergencias">
                                <motion.a
                                    className="bg-white shadow-md hover:bg-gray-100 text-primary border-2 border-primary font-bold py-4 px-10 rounded-full text-lg flex items-center justify-center transition-all"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                    Emergencias
                                </motion.a>
                            </Link>
                        </motion.div>

                        {/* Panel desplegable de donación rápida */}
                        <AnimatePresence>
                            {isOpen && (
                                <motion.div
                                    className="mt-6 p-6 bg-white rounded-2xl shadow-2xl max-w-2xl mx-auto border border-gray-100"
                                    initial={{ opacity: 0, y: -20, height: 0 }}
                                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                                    exit={{ opacity: 0, y: -20, height: 0 }}
                                    transition={{ duration: 0.4, ease: "easeInOut" }}
                                >
                                    <h3 className="text-xl font-bold mb-6 text-center">Donación rápida</h3>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                                        {quickDonationOptions.map((amount) => (
                                            <motion.button
                                                key={amount}
                                                onClick={() => setActiveAmount(amount)}
                                                className={`
                                                    py-3 px-4 rounded-lg border-2 font-bold text-lg transition-all
                                                    ${activeAmount === amount
                                                        ? 'bg-primary text-white border-primary shadow-md'
                                                        : 'bg-white text-gray-700 border-gray-300 hover:border-primary hover:text-primary'}
                                                `}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                ${amount}
                                            </motion.button>
                                        ))}
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <input
                                            type="text"
                                            placeholder="Otro monto"
                                            className="flex-grow px-4 py-3 border-2 border-gray-300 focus:border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all text-center"
                                            onChange={() => setActiveAmount(null)}
                                        />
                                        <motion.button
                                            className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-lg transition-all shadow-md"
                                            whileHover={{ scale: 1.03 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            Continuar
                                        </motion.button>
                                    </div>

                                    {activeAmount && (
                                        <motion.div
                                            className="mt-4 text-center text-sm text-gray-700"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                        >
                                            Con ${activeAmount} puedes proporcionar aproximadamente {activeAmount * 2} comidas a personas que lo necesitan.
                                        </motion.div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>

                {/* Estadísticas de impacto */}
                <motion.div
                    className="w-full max-w-5xl mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                >
                    <motion.div
                        className="bg-white p-6 rounded-xl shadow-elevated card-hover-effect"
                        whileHover={{ y: -5 }}
                    >
                        <div className="flex items-center justify-center mb-4">
                            <span className="text-5xl font-bold text-primary">+50k</span>
                        </div>
                        <p className="text-gray-700 text-center">Personas beneficiadas anualmente</p>
                    </motion.div>

                    <motion.div
                        className="bg-white p-6 rounded-xl shadow-elevated card-hover-effect"
                        whileHover={{ y: -5 }}
                    >
                        <div className="flex items-center justify-center mb-4">
                            <span className="text-5xl font-bold text-primary">1,200</span>
                        </div>
                        <p className="text-gray-700 text-center">Toneladas de alimentos rescatados</p>
                    </motion.div>

                    <motion.div
                        className="bg-white p-6 rounded-xl shadow-elevated card-hover-effect"
                        whileHover={{ y: -5 }}
                    >
                        <div className="flex items-center justify-center mb-4">
                            <span className="text-5xl font-bold text-primary">42</span>
                        </div>
                        <p className="text-gray-700 text-center">Instituciones beneficiarias</p>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};

export default Hero;