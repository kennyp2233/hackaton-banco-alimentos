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

    return (
        <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
        >
           
            {/* Image */}
            <div className="relative h-48 w-full">
                <Image
                    src={emergency.imageUrl || '/images/emergency-placeholder.jpg'}
                    alt={emergency.title}
                    fill
                    className="object-cover"
                />
            </div>

            {/* Content */}
            <div className="p-6">
                <h3 className="text-lg font-bold mb-2 line-clamp-2">{emergency.title}</h3>
                <p className="text-gray-600 mb-4 text-sm line-clamp-3">{emergency.description}</p>

                {/* Progress bar */}
                <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium">${emergency.raised} recaudados</span>
                        <span className="text-gray-500">Meta: ${emergency.target}</span>
                    </div>
                    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${progressPercentage}%` }}
                        />
                    </div>
                </div>

                {/* Info badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                    <div className="bg-amber-100 text-amber-800 text-xs font-medium px-2.5 py-1 rounded">
                        {emergency.daysLeft} días restantes
                    </div>
                    <div className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded">
                        {emergency.beneficiaries} beneficiarios
                    </div>
                </div>

                {/* Action button */}
                <Link
                    href={`/emergencias/${emergency.id}`}
                    className="block w-full bg-primary hover:bg-primary/90 text-white text-center font-bold py-2 px-4 rounded-lg transition-colors"
                >
                    Donar ahora
                </Link>
            </div>
        </motion.div>
    );
};

export default EmergencyCard;