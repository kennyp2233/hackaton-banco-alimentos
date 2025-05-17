'use client';
import { FC } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import ParallaxBackground from '@/shared/components/ParallaxBackground';
import { IMAGES } from '@/shared/config/constants';

// Definimos las imágenes para el efecto parallax
const parallaxImages = [
    {
        src: IMAGES.parallax.tomatoe,
        alt: "Tomate",
        position: 'left' as const,  // Posición a la izquierda
        speed: 30                  // Velocidad de movimiento
    },
    {
        src: IMAGES.parallax.leaf,
        alt: "Hoja",
        position: 'right' as const, // Posición a la derecha
        speed: 25                   // Velocidad de movimiento
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
    return (
        <div className="relative overflow-hidden">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">

                {/* Parallax effect */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                    <ParallaxBackground images={parallaxImages} />
                </div>
            </div>

            {/* Content */}
            <div className="relative text-gray-800 z-10 container mx-auto px-4 py-20 md:py-32 flex flex-col items-center text-center ">
                <motion.h1
                    className="text-4xl md:text-6xl font-bold mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    Juntos contra el hambre en Quito
                </motion.h1>

                <motion.p
                    className="text-lg md:text-xl mb-10 max-w-3xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    Tu donación ayuda a combatir la inseguridad alimentaria y reducir el desperdicio.
                    Cada contribución permite que más familias tengan acceso a alimentos nutritivos.
                </motion.p>

                <motion.div
                    className="flex flex-col sm:flex-row gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    <Link href="/donaciones" className="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-8 rounded-full transition-all">
                        Donar ahora
                    </Link>
                    <Link href="/emergencias" className="bg-white hover:bg-gray-100 text-primary font-bold py-3 px-8 rounded-full transition-all">
                        Emergencias activas
                    </Link>
                </motion.div>

                {/* Impact Numbers */}
                <motion.div
                    className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                >
                    <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
                        <h3 className="text-4xl font-bold text-primary">+50,000</h3>
                        <p className="text-white">Personas beneficiadas</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
                        <h3 className="text-4xl font-bold text-primary">1,200</h3>
                        <p className="text-white">Toneladas de alimentos rescatados</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
                        <h3 className="text-4xl font-bold text-primary">42</h3>
                        <p className="text-white">Instituciones beneficiarias</p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Hero;