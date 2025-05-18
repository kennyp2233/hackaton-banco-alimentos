import { FC } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface Emergency {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    target: number;
    raised: number;
    daysLeft: number;
    beneficiaries: number;
    critical: boolean;
}

interface EmergencyCardProps {
    emergency: Emergency;
}

const EmergencyCard: FC<EmergencyCardProps> = ({ emergency }) => {
    // Calculate progress percentage
    const progressPercentage = Math.min(Math.round((emergency.raised / emergency.target) * 100), 100);

    // Item variants for animation
    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    // Calculate days text color based on urgency
    const getDaysColor = () => {
        if (emergency.daysLeft <= 3) return 'bg-red-100 text-red-800'; // Muy urgente
        if (emergency.daysLeft <= 7) return 'bg-amber-100 text-amber-800'; // Urgente
        return 'bg-blue-100 text-blue-800'; // Normal
    };

    return (
        <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-elevated transition-all duration-300 transform hover:-translate-y-2"
            whileHover={{ scale: 1.02 }}
        >
            {/* Critical Badge */}
            {emergency.critical && (
                <div className="absolute top-4 right-4 z-10">
                    <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wide shadow-md">
                        Urgente
                    </span>
                </div>
            )}

            {/* Image with gradient overlay */}
            <div className="relative h-52 w-full overflow-hidden">
                <Image
                    src={emergency.imageUrl || '/images/emergency-placeholder.jpg'}
                    alt={emergency.title}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

                {/* Progress overlay on image */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="flex justify-between text-white text-sm mb-1 font-medium">
                        <span>${emergency.raised} recaudados</span>
                        <span className="opacity-80">Meta: ${emergency.target}</span>
                    </div>
                    <div className="h-2 w-full bg-gray-200/50 rounded-full overflow-hidden backdrop-blur-sm">
                        <motion.div
                            className="h-full bg-primary rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${progressPercentage}%` }}
                            transition={{ duration: 1, delay: 0.3 }}
                        />
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                <h3 className="text-lg font-bold mb-2 line-clamp-2 text-gray-800">{emergency.title}</h3>
                <p className="text-gray-600 mb-5 text-sm line-clamp-3">{emergency.description}</p>

                {/* Info badges */}
                <div className="flex flex-wrap gap-2 mb-5">
                    <div className={`${getDaysColor()} text-xs font-medium px-2.5 py-1 rounded flex items-center`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {emergency.daysLeft} días restantes
                    </div>
                    <div className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        {emergency.beneficiaries} beneficiarios
                    </div>
                </div>

                {/* Action button with animation */}
                <Link
                    href={`/emergencias/${emergency.id}`}
                    passHref
                >
                    <motion.div
                        className="block w-full bg-primary hover:bg-primary-dark text-white text-center font-bold py-3 px-4 rounded-lg transition-colors shadow-md"
                        whileHover={{ y: -3, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' }}
                        whileTap={{ y: 0, boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)' }}
                    >
                        <div className="flex items-center justify-center">
                            Donar ahora
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </div>
                    </motion.div>
                </Link>
            </div>
        </motion.div>
    );
};

export default EmergencyCard;