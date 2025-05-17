'use client';
import { FC } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

// En producción, estos datos vendrían de una API o un hook
const activeEmergencies = [
    {
        id: 'em-001',
        title: 'Emergencia por deslizamiento en el sur de Quito',
        daysLeft: 3,
        critical: true,
    },
    {
        id: 'em-003',
        title: 'Ayuda tras inundaciones en zonas rurales de Pichincha',
        daysLeft: 5,
        critical: true,
    },
];

const EmergencyAlert: FC = () => {
    // Si no hay emergencias activas, no mostrar el componente
    if (activeEmergencies.length === 0) {
        return null;
    }

    // Solo mostramos el primer elemento, pero podríamos implementar un carrusel para mostrar varios
    const emergency = activeEmergencies[0];

    return (
        <motion.div
            className="bg-red-600 text-white"
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
        >
            <div className="container mx-auto px-4 py-2">
                <div className="flex flex-col md:flex-row items-center justify-between">
                    <div className="flex items-center mb-2 md:mb-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <span className="text-sm font-bold mr-2">EMERGENCIA ACTIVA:</span>
                        <span className="text-sm truncate">{emergency.title}</span>
                        <span className="ml-2 bg-white text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">
                            {emergency.daysLeft} días
                        </span>
                    </div>
                    <Link
                        href={`/emergencias/${emergency.id}`}
                        className="text-xs font-bold bg-white text-red-600 px-3 py-1 rounded-full hover:bg-gray-100 transition-colors"
                    >
                        Ayudar ahora
                    </Link>
                </div>
            </div>
        </motion.div>
    );
};

export default EmergencyAlert;