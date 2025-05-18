'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import PageContainer from '@/shared/layout/PageContainer';
import RewardCard from '@/modules/rewards/components/RewardCard';
import { useRewardsService, Reward, UserPoints, LeaderboardEntry } from '@/modules/rewards/services/rewardsService';
import toast from 'react-hot-toast';

export default function RewardsPage() {
    const {
        getAvailableRewards,
        getUserPoints,
        redeemReward,
        getLeaderboard,
        isLoading
    } = useRewardsService();

    const [rewards, setRewards] = useState<Reward[]>([]);
    const [userPoints, setUserPoints] = useState<UserPoints | null>(null);
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [activeTab, setActiveTab] = useState('available'); // 'available' or 'leaderboard'
    const [filterType, setFilterType] = useState<string | null>(null);

    // Fetch data on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [rewardsData, pointsData, leaderboardData] = await Promise.all([
                    getAvailableRewards(),
                    getUserPoints(),
                    getLeaderboard()
                ]);

                setRewards(rewardsData);
                setUserPoints(pointsData);
                setLeaderboard(leaderboardData);
            } catch (error) {
                console.error('Error al cargar datos de recompensas', error);
            }
        };

        fetchData();
    }, []);

    // Handle reward redemption
    const handleRedeemReward = async (rewardId: string) => {
        try {
            const result = await redeemReward(rewardId);
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
        }
    };

    // Get unique reward types for filtering
    const rewardTypes = [...new Set(rewards.map(r => r.type))];

    // Filter rewards by type if filter is active
    const filteredRewards = filterType
        ? rewards.filter(r => r.type === filterType)
        : rewards;

    const handleCopyReferral = () => {
        toast.success('Código de referido copiado');
    };


    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            {/* Hero Section */}
            <div className="bg-primary text-white">
                <PageContainer>
                    <div className="py-16 md:py-20">
                        <motion.div
                            className="max-w-3xl mx-auto text-center"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <h1 className="text-4xl md:text-5xl font-bold mb-6">Sistema de Recompensas</h1>
                            <p className="text-lg md:text-xl mb-8">
                                ¡Gracias por tu generosidad! Canjea tus créditos acumulados por recompensas exclusivas y reconocimientos.
                            </p>

                            {/* User points summary */}
                            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 mt-8 shadow-lg">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                                    <div>
                                        <p className="text-white/80 text-sm mb-1">Disponibles</p>
                                        <p className="text-4xl font-bold">{userPoints?.available || '...'}</p>
                                    </div>
                                    <div>
                                        <p className="text-white/80 text-sm mb-1">Total acumulado</p>
                                        <p className="text-4xl font-bold">{userPoints?.total || '...'}</p>
                                    </div>
                                    <div>
                                        <p className="text-white/80 text-sm mb-1">Utilizados</p>
                                        <p className="text-4xl font-bold">{userPoints?.spent || '...'}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </PageContainer>
            </div>

            {/* Main Content */}
            <PageContainer className="mt-8">
                {/* Tabs */}
                <div className="flex border-b border-gray-200 mb-8">
                    <button
                        className={`py-3 px-6 font-medium text-lg ${activeTab === 'available'
                            ? 'text-primary border-b-2 border-primary'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                        onClick={() => setActiveTab('available')}
                    >
                        Recompensas Disponibles
                    </button>
                    <button
                        className={`py-3 px-6 font-medium text-lg ${activeTab === 'leaderboard'
                            ? 'text-primary border-b-2 border-primary'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                        onClick={() => setActiveTab('leaderboard')}
                    >
                        Tabla de Clasificación
                    </button>
                    <button
                        className={`py-3 px-6 font-medium text-lg ${activeTab === 'referrals'
                            ? 'text-primary border-b-2 border-primary'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                        onClick={() => setActiveTab('referrals')}
                    >
                        Referidos
                    </button>

                </div>


                {/* Available Rewards Tab */}
                {activeTab === 'available' && (
                    <>
                        {/* Filter buttons */}
                        <div className="flex flex-wrap gap-2 mb-6">
                            <button
                                className={`px-4 py-2 rounded-full text-sm font-medium ${filterType === null
                                    ? 'bg-primary text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                onClick={() => setFilterType(null)}
                            >
                                Todos
                            </button>
                            {rewardTypes.map((type) => (
                                <button
                                    key={type}
                                    className={`px-4 py-2 rounded-full text-sm font-medium ${filterType === type
                                        ? 'bg-primary text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    onClick={() => setFilterType(type)}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>

                        {/* Rewards grid */}
                        {isLoading ? (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="bg-white rounded-xl shadow p-4 animate-pulse">
                                        <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                                        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                                        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                                        <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
                                        <div className="h-10 bg-gray-200 rounded w-full"></div>
                                    </div>
                                ))}
                            </div>
                        ) : filteredRewards.length > 0 ? (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {filteredRewards.map((reward) => (
                                    <RewardCard
                                        key={reward.id}
                                        reward={reward}
                                        userPoints={userPoints?.available || 0}
                                        onRedeem={handleRedeemReward}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-gray-500 text-lg">No hay recompensas disponibles en este momento.</p>
                            </div>
                        )}
                    </>
                )}

                {/* Leaderboard Tab */}
                {activeTab === 'leaderboard' && (
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                            <h2 className="text-xl font-bold">Tabla de Clasificación - Donantes</h2>
                            <p className="text-gray-600">Los donantes más generosos de nuestra comunidad</p>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Posición
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Donante
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Créditos
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {isLoading ? (
                                        Array(5).fill(0).map((_, i) => (
                                            <tr key={i} className="animate-pulse">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="h-4 bg-gray-200 rounded w-8"></div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="h-4 bg-gray-200 rounded w-40"></div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        leaderboard.map((entry) => (
                                            <tr key={entry.position} className={entry.isCurrentUser ? 'bg-blue-50' : ''}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {entry.position <= 3 ? (
                                                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-yellow-100 text-yellow-800 font-bold">
                                                            {entry.position}
                                                        </span>
                                                    ) : (
                                                        <span className="font-medium">{entry.position}</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                                                            {entry.isAnonymous ? (
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                                </svg>
                                                            ) : (
                                                                <span className="text-gray-500 font-bold">
                                                                    {entry.userName.charAt(0).toUpperCase()}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {entry.userName}
                                                            </div>
                                                            {entry.isAnonymous && (
                                                                <div className="text-xs text-gray-500">Donante anónimo</div>
                                                            )}
                                                        </div>
                                                        {entry.isCurrentUser && (
                                                            <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                                                Tú
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    {entry.points}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                            <p className="text-sm text-gray-500">
                                Los créditos se calculan en base a las donaciones realizadas. Cada donación genera créditos según su monto y frecuencia.
                            </p>
                        </div>
                    </div>
                )}

                {activeTab === 'referrals' && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="bg-white rounded-2xl shadow-lg px-8 py-10 max-w-4xl mx-auto"
                    >
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-extrabold text-gray-800">🎉 Invita y gana recompensas</h2>
                            <p className="text-gray-600 mt-2 max-w-xl mx-auto">
                                Comparte tu código de referido con tus contactos. Cuando alguien done usando tu código, ambos recibirán créditos adicionales como agradecimiento.
                            </p>
                        </div>

                        <div className="flex flex-col md:flex-row items-center justify-center gap-4 bg-gray-50 rounded-xl p-6 border border-dashed border-primary/20">
                            <div className="text-center md:text-left">
                                <p className="text-sm text-gray-500 mb-1">Tu código personal</p>
                                <code className="text-xl font-semibold tracking-wide bg-white text-primary px-6 py-3 rounded-lg shadow-sm font-mono block md:inline-block">
                                    REF-123456
                                </code>
                            </div>
                            <button
                                onClick={handleCopyReferral}
                                className="bg-primary text-white px-6 py-3 rounded-lg font-semibold shadow hover:bg-primary/90 transition"
                            >
                                📋 Copiar código
                            </button>
                        </div>

                        <div className="mt-10 bg-gray-100 rounded-xl p-6 text-sm text-gray-600 leading-relaxed">
                            <p>🔄 Puedes invitar a tantas personas como desees.</p>
                            <p>🏅 Por cada referido que done, ganas <strong>créditos adicionales</strong> automáticamente.</p>
                            <p>❓ ¿Dudas? Visita la sección de ayuda o contáctanos directamente.</p>
                        </div>
                    </motion.div>
                )}




                {/* How it works section */}
                <div className="mt-16">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">¿Cómo funciona?</h2>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-white p-6 rounded-xl shadow-md">
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary text-xl font-bold mb-4">
                                1
                            </div>
                            <h3 className="text-lg font-bold mb-2">Realiza donaciones</h3>
                            <p className="text-gray-600">
                                Cada vez que realizas una donación, obtienes créditos proporcionales al monto donado. Las donaciones recurrentes reciben créditos adicionales.
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-md">
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary text-xl font-bold mb-4">
                                2
                            </div>
                            <h3 className="text-lg font-bold mb-2">Acumula créditos</h3>
                            <p className="text-gray-600">
                                Tus créditos se acumulan en tu cuenta. Puedes ver tu saldo actual en cualquier momento en la parte superior de esta página o en el menú.
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-md">
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary text-xl font-bold mb-4">
                                3
                            </div>
                            <h3 className="text-lg font-bold mb-2">Canjea recompensas</h3>
                            <p className="text-gray-600">
                                Utiliza tus créditos para obtener insignias digitales, certificados, descuentos y experiencias exclusivas como agradecimiento por tu apoyo.
                            </p>
                        </div>
                    </div>
                </div>
            </PageContainer>
        </div>
    );
}