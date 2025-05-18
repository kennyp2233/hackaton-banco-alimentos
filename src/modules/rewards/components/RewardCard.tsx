// src/modules/rewards/components/RewardCard.tsx
import { FC, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Reward } from '@/modules/rewards/services/rewardsService';

interface RewardCardProps {
    reward: Reward;
    userPoints: number;
    onRedeem: (rewardId: string) => Promise<void>;
}

const RewardCard: FC<RewardCardProps> = ({ reward, userPoints, onRedeem }) => {
    const [isRedeeming, setIsRedeeming] = useState(false);
    const canRedeem = userPoints >= reward.pointsRequired;

    const handleRedeem = async () => {
        if (!canRedeem || isRedeeming) return;

        setIsRedeeming(true);
        try {
            await onRedeem(reward.id);
        } catch (error) {
            console.error('Error redeeming reward:', error);
        } finally {
            setIsRedeeming(false);
        }
    };

    // Get badge color based on reward type
    const getBadgeColor = () => {
        switch (reward.type) {
            case 'Badge':
                return 'bg-blue-100 text-blue-800';
            case 'Certificate':
                return 'bg-green-100 text-green-800';
            case 'Experience':
                return 'bg-purple-100 text-purple-800';
            case 'Discount':
                return 'bg-amber-100 text-amber-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <motion.div
            className={`bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform ${reward.isHighlighted ? 'ring-2 ring-primary' : ''}`}
            whileHover={{ y: -5 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >

            {/* Image */}
            <div className="relative h-48 w-full overflow-hidden">
                <Image
                    src={reward.imageUrl || '/images/rewards/placeholder.jpg'}
                    alt={reward.title}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-110"
                />
            </div>

            {/* Content */}
            <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold line-clamp-2 text-gray-800 flex-1">{reward.title}</h3>
                    <span className={`${getBadgeColor()} text-xs font-medium px-2.5 py-0.5 rounded-full ml-2 whitespace-nowrap`}>
                        {reward.type}
                    </span>
                </div>

                <p className="text-gray-600 mb-4 text-sm line-clamp-3">{reward.description}</p>

                {/* Points required */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-primary mr-1.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        <span className="text-gray-700 font-medium">{reward.pointsRequired} créditos</span>
                    </div>
                    {reward.availableQuantity !== undefined && (
                        <span className="text-sm text-gray-500">
                            {reward.availableQuantity} disponibles
                        </span>
                    )}
                </div>

                {/* Action button */}
                <button
                    onClick={handleRedeem}
                    disabled={!canRedeem || isRedeeming}
                    className={`w-full font-bold py-2 px-4 rounded-lg transition-colors flex items-center justify-center 
                        ${canRedeem
                            ? 'bg-primary hover:bg-primary-dark text-white cursor-pointer'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                >
                    {isRedeeming ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Procesando...
                        </>
                    ) : canRedeem ? (
                        'Canjear recompensa'
                    ) : (
                        <>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 mr-1"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                />
                            </svg>
                            Te faltan {reward.pointsRequired - userPoints} créditos
                        </>
                    )}
                </button>

                {/* View details link */}
                <Link href={`/rewards/${reward.id}`}>
                    <div className="text-primary hover:text-primary-dark text-sm font-medium text-center mt-2 cursor-pointer">
                        Ver detalles
                    </div>
                </Link>
            </div>
        </motion.div>
    );
};

export default RewardCard;