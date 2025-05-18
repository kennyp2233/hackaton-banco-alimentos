// src/shared/components/PointsDisplay.tsx
'use client';
import { FC, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRewardsService, UserPoints } from '@/modules/rewards/services/rewardsService';

interface PointsDisplayProps {
    className?: string;
}

const PointsDisplay: FC<PointsDisplayProps> = ({ className = '' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { getUserPoints, isLoading } = useRewardsService();
    const [points, setPoints] = useState<UserPoints | null>(null);

    // Load points when panel opens
    const handleTogglePanel = async () => {
        if (!isOpen && !points) {
            const userPoints = await getUserPoints();
            setPoints(userPoints);
        }
        setIsOpen(!isOpen);
    };

    return (
        <div className={`relative ${className}`}>
            {/* Points button */}
            <motion.button
                onClick={handleTogglePanel}
                className="flex items-center bg-white border border-gray-200 rounded-full px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <span className="flex items-center">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-primary mr-1.5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                    <span className="text-primary font-bold">
                        {isLoading ? '...' : points ? points.available : '320'} <span className="text-xs font-normal">créditos</span>
                    </span>
                </span>
            </motion.button>

            {/* Points panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-200 z-50"
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="p-4">
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="font-bold text-gray-800">Mis Créditos</h3>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="text-gray-400 hover:text-gray-500"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-3 mb-4">
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-600">Disponibles:</span>
                                    <span className="font-bold text-primary">{points?.available || 320}</span>
                                </div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-600">Utilizados:</span>
                                    <span className="font-medium">{points?.spent || 100}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Total acumulado:</span>
                                    <span className="font-medium">{points?.total || 420}</span>
                                </div>
                            </div>

                            <h4 className="font-medium text-sm text-gray-700 mb-2">Movimientos recientes</h4>
                            <div className="max-h-40 overflow-y-auto space-y-2 mb-4">
                                {isLoading ? (
                                    <div className="animate-pulse flex space-x-4">
                                        <div className="flex-1 space-y-2 py-1">
                                            <div className="h-4 bg-gray-200 rounded"></div>
                                            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                                        </div>
                                    </div>
                                ) : (
                                    (points?.history || []).slice(0, 3).map((transaction) => (
                                        <div key={transaction.id} className="text-sm border-l-2 pl-2 py-1"
                                            style={{
                                                borderColor: transaction.type === 'Earned' ? '#22c55e' : '#ef4444'
                                            }}
                                        >
                                            <div className="flex justify-between">
                                                <span className="text-gray-700">{transaction.description}</span>
                                                <span className={transaction.type === 'Earned' ? 'text-green-600' : 'text-red-500'}>
                                                    {transaction.type === 'Earned' ? '+' : '-'}{transaction.amount}
                                                </span>
                                            </div>
                                            <div className="text-xs text-gray-500">{transaction.date}</div>
                                        </div>
                                    ))
                                )}
                            </div>

                            <div className="flex flex-col space-y-2">
                                <Link href="/rewards">
                                    <motion.div
                                        className="w-full bg-primary text-white font-bold py-2 px-4 rounded-lg text-center hover:bg-primary/90 transition-colors"
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Ver recompensas disponibles
                                    </motion.div>
                                </Link>
                                <Link href="/rewards/history">
                                    <motion.div
                                        className="w-full bg-white text-gray-700 border border-gray-300 font-medium py-2 px-4 rounded-lg text-center hover:bg-gray-50 transition-colors"
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Historial completo
                                    </motion.div>
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default PointsDisplay;