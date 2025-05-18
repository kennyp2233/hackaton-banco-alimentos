'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import PageContainer from '@/shared/layout/PageContainer';
import { useRewardsService, UserReward, UserPoints, PointTransaction } from '@/modules/rewards/services/rewardsService';
import Link from 'next/link';

export default function RewardsHistoryPage() {
    const { getUserRewards, getUserPoints, isLoading } = useRewardsService();

    const [userRewards, setUserRewards] = useState<UserReward[]>([]);
    const [pointsHistory, setPointsHistory] = useState<PointTransaction[]>([]);
    const [userPoints, setUserPoints] = useState<UserPoints | null>(null);
    const [activeTab, setActiveTab] = useState('rewards'); // 'rewards' or 'transactions'

    // Fetch data on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [rewards, points] = await Promise.all([
                    getUserRewards(),
                    getUserPoints()
                ]);

                setUserRewards(rewards);
                setUserPoints(points);
                setPointsHistory(points.history);
            } catch (error) {
                console.error('Error al cargar historial', error);
            }
        };

        fetchData();
    }, []);

    // Get status badge style
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'Assigned':
                return 'bg-blue-100 text-blue-800';
            case 'Redeemed':
                return 'bg-green-100 text-green-800';
            case 'Delivered':
                return 'bg-purple-100 text-purple-800';
            case 'Expired':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Get transaction type badge style
    const getTransactionBadge = (type: string) => {
        switch (type) {
            case 'Earned':
                return 'bg-green-100 text-green-800';
            case 'Spent':
                return 'bg-red-100 text-red-800';
            case 'Expired':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <PageContainer>
                <motion.div
                    className="mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="text-3xl font-bold text-gray-800">Mi Historial</h1>
                    <p className="text-gray-600 mt-2">
                        Revisa tus recompensas y el historial de transacciones de créditos
                    </p>
                </motion.div>

                {/* Points summary */}
                <motion.div
                    className="bg-white rounded-xl shadow-md p-6 mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                >
                    <h2 className="text-xl font-bold mb-4">Resumen de Créditos</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-blue-50 rounded-lg p-4">
                            <p className="text-blue-500 font-medium text-sm mb-1">Disponibles</p>
                            <p className="text-3xl font-bold">{userPoints?.available || 0}</p>
                        </div>
                        <div className="bg-green-50 rounded-lg p-4">
                            <p className="text-green-500 font-medium text-sm mb-1">Total acumulado</p>
                            <p className="text-3xl font-bold">{userPoints?.total || 0}</p>
                        </div>
                        <div className="bg-amber-50 rounded-lg p-4">
                            <p className="text-amber-500 font-medium text-sm mb-1">Utilizados</p>
                            <p className="text-3xl font-bold">{userPoints?.spent || 0}</p>
                        </div>
                    </div>
                </motion.div>

                {/* Tabs */}
                <div className="flex border-b border-gray-200 mb-6">
                    <button
                        className={`py-3 px-6 font-medium text-lg ${activeTab === 'rewards'
                                ? 'text-primary border-b-2 border-primary'
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                        onClick={() => setActiveTab('rewards')}
                    >
                        Mis Recompensas
                    </button>
                    <button
                        className={`py-3 px-6 font-medium text-lg ${activeTab === 'transactions'
                                ? 'text-primary border-b-2 border-primary'
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                        onClick={() => setActiveTab('transactions')}
                    >
                        Historial de Transacciones
                    </button>
                </div>

                {/* Rewards Tab */}
                {activeTab === 'rewards' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4 }}
                    >
                        {isLoading ? (
                            <div className="grid md:grid-cols-2 gap-6">
                                {[1, 2].map(i => (
                                    <div key={i} className="bg-white rounded-xl shadow animate-pulse p-4 flex">
                                        <div className="h-24 w-24 bg-gray-200 rounded-lg mr-4"></div>
                                        <div className="flex-1">
                                            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                                            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                                            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : userRewards.length > 0 ? (
                            <div className="grid md:grid-cols-2 gap-6">
                                {userRewards.map((userReward) => (
                                    <motion.div
                                        key={userReward.id}
                                        className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col md:flex-row"
                                        whileHover={{ y: -4 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <div className="relative h-32 md:h-auto md:w-1/3">
                                            <Image
                                                src={userReward.reward.imageUrl || '/images/rewards/placeholder.jpg'}
                                                alt={userReward.reward.title}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="p-4 md:p-6 flex-1">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="font-bold text-gray-800">{userReward.reward.title}</h3>
                                                <span className={`${getStatusBadge(userReward.status)} text-xs px-2 py-1 rounded-full`}>
                                                    {userReward.status}
                                                </span>
                                            </div>
                                            <p className="text-gray-500 text-sm mb-3">Asignado: {userReward.dateAssigned}</p>
                                            {userReward.uniqueCode && (
                                                <p className="text-xs bg-gray-100 p-2 rounded mb-3 font-mono">
                                                    Código: {userReward.uniqueCode}
                                                </p>
                                            )}
                                            <Link href={`/rewards/${userReward.rewardId}`}>
                                                <motion.div
                                                    className="text-primary font-medium text-sm hover:text-primary-dark"
                                                    whileHover={{ x: 2 }}
                                                >
                                                    Ver detalles
                                                </motion.div>
                                            </Link>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white rounded-xl shadow-md p-8 text-center">
                                <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto flex items-center justify-center mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-bold text-gray-800 mb-2">Aún no tienes recompensas</h3>
                                <p className="text-gray-600 mb-6">
                                    Realiza donaciones y canjea tus créditos por recompensas exclusivas
                                </p>
                                <Link href="/rewards">
                                    <motion.div
                                        className="inline-block bg-primary hover:bg-primary-dark text-white font-bold py-2 px-6 rounded-lg transition-colors"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Ver recompensas disponibles
                                    </motion.div>
                                </Link>
                            </div>
                        )}
                    </motion.div>
                )}

                {/* Transactions Tab */}
                {activeTab === 'transactions' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4 }}
                    >
                        {isLoading ? (
                            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                                <div className="animate-pulse p-4 space-y-4">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="flex justify-between">
                                            <div className="flex-1">
                                                <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                                                <div className="h-4 bg-gray-200 rounded w-1/4 mt-1"></div>
                                            </div>
                                            <div className="w-16 h-6 bg-gray-200 rounded"></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : pointsHistory.length > 0 ? (
                            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                                <ul className="divide-y divide-gray-200">
                                    {pointsHistory.map((transaction) => (
                                        <li key={transaction.id} className="p-4 hover:bg-gray-50">
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <p className="font-medium text-gray-900">{transaction.description}</p>
                                                    <p className="text-sm text-gray-500">{transaction.date}</p>
                                                </div>
                                                <div className="flex items-center">
                                                    <span
                                                        className={`${getTransactionBadge(transaction.type)} text-xs px-2 py-1 rounded-full mr-3`}
                                                    >
                                                        {transaction.type}
                                                    </span>
                                                    <span className={`text-lg font-bold ${transaction.type === 'Earned' ? 'text-green-600' : 'text-red-600'
                                                        }`}>
                                                        {transaction.type === 'Earned' ? '+' : '-'}{transaction.amount}
                                                    </span>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ) : (
                            <div className="bg-white rounded-xl shadow-md p-8 text-center">
                                <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto flex items-center justify-center mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-bold text-gray-800 mb-2">No hay transacciones</h3>
                                <p className="text-gray-600 mb-6">
                                    Realiza donaciones para comenzar a acumular créditos
                                </p>
                                <Link href="/donaciones">
                                    <motion.div
                                        className="inline-block bg-primary hover:bg-primary-dark text-white font-bold py-2 px-6 rounded-lg transition-colors"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Hacer una donación
                                    </motion.div>
                                </Link>
                            </div>
                        )}
                    </motion.div>
                )}
            </PageContainer>
        </div>
    );
}