'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import PageContainer from '@/shared/layout/PageContainer';
import { useRewardsService, Reward, UserPoints } from '@/modules/rewards/services/rewardsService';
import toast from 'react-hot-toast';

export default function RewardDetailPage() {
    const router = useRouter();
    const params = useParams();
    const { getRewardById, getUserPoints, redeemReward, isLoading } = useRewardsService();

    const [reward, setReward] = useState<Reward | null>(null);
    const [userPoints, setUserPoints] = useState<UserPoints | null>(null);
    const [isRedeeming, setIsRedeeming] = useState(false);

    // Get reward ID from path params
    const rewardId = params.id as string;

    // Fetch reward and user points data
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch reward details and user points in parallel
                const [rewardData, pointsData] = await Promise.all([
                    getRewardById(rewardId),
                    getUserPoints()
                ]);

                if (!rewardData) {
                    toast.error('Recompensa no encontrada');
                    router.push('/rewards');
                    return;
                }

                setReward(rewardData);
                setUserPoints(pointsData);
            } catch (error) {
                toast.error('Error al cargar los datos de la recompensa');
                console.error(error);
                router.push('/rewards');
            }
        };

        fetchData();
    }, [rewardId]);

    // Handle reward redemption
    const handleRedeemReward = async () => {
        if (!reward || !userPoints || isRedeeming) return;

        if (userPoints.available < reward.pointsRequired) {
            toast.error('No tienes suficientes créditos para canjear esta recompensa');
            return;
        }

        setIsRedeeming(true);
        try {
            const result = await redeemReward(reward.id);
            if (result.success) {
                toast.success(result.message);
                // Refresh user points after redemption
                const updatedPoints = await getUserPoints();
                setUserPoints(updatedPoints);
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            toast.error('Error al canjear la recompensa');
        } finally {
            setIsRedeeming(false);
        }
    };

    // Get badge color based on reward type
    const getBadgeColor = (type?: string) => {
        switch (type) {
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

    // Check if user can redeem this reward
    const canRedeem = userPoints && reward && userPoints.available >= reward.pointsRequired;

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <PageContainer>
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    {isLoading || !reward ? (
                        // Loading skeleton
                        <div className="animate-pulse">
                            <div className="h-64 bg-gray-200"></div>
                            <div className="p-6">
                                <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
                                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded w-5/6 mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded w-4/6 mb-4"></div>
                                <div className="h-10 bg-gray-200 rounded w-full"></div>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Hero image */}
                            <div className="relative h-64 w-full">
                                <Image
                                    src={reward.imageUrl || '/images/rewards/placeholder.jpg'}
                                    alt={reward.title}
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

                                {/* Back button */}
                                <motion.button
                                    className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm p-2 rounded-full text-gray-800 hover:bg-white transition-colors"
                                    onClick={() => router.push('/rewards')}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                                    </svg>
                                </motion.button>

                                {/* Type badge */}
                                <div className="absolute top-4 right-4">
                                    <span className={`${getBadgeColor(reward.type)} text-xs font-medium px-2.5 py-1 rounded-full`}>
                                        {reward.type}
                                    </span>
                                </div>

                                {/* Title */}
                                <div className="absolute bottom-0 left-0 right-0 p-6">
                                    <h1 className="text-3xl font-bold text-white">{reward.title}</h1>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <div className="flex items-center mb-6">
                                    <div className="flex items-center text-primary font-bold mr-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                                        </svg>
                                        {reward.pointsRequired} créditos
                                    </div>

                                    {reward.availableQuantity !== undefined && (
                                        <div className="text-gray-500 text-sm">
                                            {reward.availableQuantity} disponibles
                                        </div>
                                    )}
                                </div>

                                {/* Description */}
                                <div className="mb-8">
                                    <h2 className="text-lg font-bold mb-2">Descripción</h2>
                                    <p className="text-gray-700">{reward.description}</p>
                                </div>

                                {/* Your credits */}
                                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                                    <h2 className="text-lg font-bold mb-2">Tus créditos</h2>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-gray-700">Disponibles</p>
                                            <p className="text-2xl font-bold">{userPoints?.available || 0}</p>
                                        </div>

                                        {!canRedeem && (
                                            <div className="text-right">
                                                <p className="text-gray-700">Te faltan</p>
                                                <p className="text-xl font-bold text-red-500">
                                                    {reward.pointsRequired - (userPoints?.available || 0)} créditos
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Redeem button */}
                                <button
                                    onClick={handleRedeemReward}
                                    disabled={!canRedeem || isRedeeming}
                                    className={`w-full py-3 px-6 rounded-lg font-bold text-center transition-colors ${canRedeem
                                            ? 'bg-primary hover:bg-primary-dark text-white'
                                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        }`}
                                >
                                    {isRedeeming ? (
                                        <div className="flex items-center justify-center">
                                            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Procesando...
                                        </div>
                                    ) : canRedeem ? (
                                        'Canjear recompensa'
                                    ) : (
                                        'Créditos insuficientes'
                                    )}
                                </button>

                                {!canRedeem && (
                                    <div className="text-center mt-4">
                                        <a href="/donaciones" className="text-primary hover:text-primary-dark text-sm font-medium">
                                            Realiza una donación para obtener más créditos
                                        </a>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </PageContainer>
        </div>
    );
}