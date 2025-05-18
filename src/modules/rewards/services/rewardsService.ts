// src/modules/rewards/services/rewardsService.ts
import { useState } from 'react';
import { IMAGES } from '@/shared/config/constants';

// Interface definitions
export interface Reward {
    id: string;
    title: string;
    description: string;
    pointsRequired: number;
    imageUrl: string;
    type: 'Badge' | 'Certificate' | 'Experience' | 'Discount';
    active: boolean;
    availableQuantity?: number;
    isHighlighted?: boolean;
}

export interface UserReward {
    id: string;
    userId: string;
    rewardId: string;
    reward: Reward;
    dateAssigned: string;
    status: 'Assigned' | 'Redeemed' | 'Delivered' | 'Expired';
    uniqueCode?: string;
    notes?: string;
}

export interface UserPoints {
    total: number;
    available: number;
    spent: number;
    history: PointTransaction[];
}

export interface PointTransaction {
    id: string;
    amount: number;
    type: 'Earned' | 'Spent' | 'Expired';
    description: string;
    date: string;
    relatedEntityId?: string;
    relatedEntityType?: 'Donation' | 'Redemption';
}

export interface LeaderboardEntry {
    position: number;
    userName: string;
    points: number;
    isAnonymous: boolean;
    isCurrentUser: boolean;
}

// Mock data for rewards
const REWARDS_DATA: Reward[] = [
    {
        id: 'rw-001',
        title: 'Insignia Corazón de Plata',
        description: 'Insignia digital que reconoce tu compromiso con la lucha contra el hambre',
        pointsRequired: 100,
        imageUrl: '/images/rewards/silver-badge.png',
        type: 'Badge',
        active: true,
        isHighlighted: true
    },
    {
        id: 'rw-010',
        title: 'Snack Mix Cibu',
        description: 'Actualmente, el Banco de Alimentos Quito trabaja en el proyecto CIBU, que tiene como objetivo desarrollar productos utilizando alimentos rescatados por el BAQ.',
        pointsRequired: 200,
        imageUrl: '/images/rewards/cibu.png',
        type: 'Badge',
        active: true
    },
    {
        id: 'rw-002',
        title: 'Certificado de Impacto Social',
        description: 'Documento personalizado que acredita tu contribución a la comunidad',
        pointsRequired: 250,
        imageUrl: '/images/rewards/certificate.png',
        type: 'Certificate',
        active: true
    },
    {
        id: 'rw-003',
        title: 'Visita guiada al Banco de Alimentos',
        description: 'Conoce nuestras instalaciones y el impacto de tu ayuda en primera persona',
        pointsRequired: 500,
        imageUrl: '/images/rewards/guided-tour.png',
        type: 'Experience',
        active: true,
        availableQuantity: 5
    },
    {
        id: 'rw-004',
        title: 'Descuento del 15% en tiendas asociadas',
        description: 'Cupón de descuento válido en negocios locales que apoyan nuestra causa',
        pointsRequired: 300,
        imageUrl: '/images/rewards/discount-coupon.png',
        type: 'Discount',
        active: true,
        availableQuantity: 10
    },
    {
        id: 'rw-005',
        title: 'Taller de cocina sin desperdicios',
        description: 'Aprende a aprovechar al máximo los alimentos con nuestros chefs voluntarios',
        pointsRequired: 450,
        imageUrl: '/images/rewards/cooking-workshop.png',
        type: 'Experience',
        active: true,
        availableQuantity: 8
    },
    {
        id: 'rw-006',
        title: 'Insignia Corazón de Oro',
        description: 'Insignia digital exclusiva para donantes recurrentes',
        pointsRequired: 800,
        imageUrl: '/images/rewards/gold-badge.png',
        type: 'Badge',
        active: true
    },
];

// Mock user rewards
const USER_REWARDS_DATA: UserReward[] = [
    {
        id: 'ur-001',
        userId: 'current-user',
        rewardId: 'rw-001',
        reward: REWARDS_DATA[0],
        dateAssigned: '2025-04-10',
        status: 'Assigned'
    }
];

// Mock points data
const USER_POINTS_DATA: UserPoints = {
    total: 420,
    available: 320,
    spent: 100,
    history: [
        {
            id: 'pt-001',
            amount: 100,
            type: 'Earned',
            description: 'Donación única #DON-2354',
            date: '2025-04-02',
            relatedEntityId: 'DON-2354',
            relatedEntityType: 'Donation'
        },
        {
            id: 'pt-002',
            amount: 50,
            type: 'Earned',
            description: 'Donación recurrente mensual',
            date: '2025-04-15',
            relatedEntityId: 'DON-2387',
            relatedEntityType: 'Donation'
        },
        {
            id: 'pt-003',
            amount: 100,
            type: 'Spent',
            description: 'Canje de Insignia Corazón de Plata',
            date: '2025-04-15',
            relatedEntityId: 'rw-001',
            relatedEntityType: 'Redemption'
        },
        {
            id: 'pt-004',
            amount: 120,
            type: 'Earned',
            description: 'Donación de emergencia - Deslizamiento Sur de Quito',
            date: '2025-05-01',
            relatedEntityId: 'DON-2412',
            relatedEntityType: 'Donation'
        },
        {
            id: 'pt-005',
            amount: 150,
            type: 'Earned',
            description: 'Donación única #DON-2450',
            date: '2025-05-12',
            relatedEntityId: 'DON-2450',
            relatedEntityType: 'Donation'
        }
    ]
};

// Mock leaderboard data
const LEADERBOARD_DATA: LeaderboardEntry[] = [
    {
        position: 1,
        userName: 'María Donoso',
        points: 1250,
        isAnonymous: false,
        isCurrentUser: false
    },
    {
        position: 2,
        userName: 'Anónimo 03845',
        points: 980,
        isAnonymous: true,
        isCurrentUser: false
    },
    {
        position: 3,
        userName: 'Juan Pérez',
        points: 870,
        isAnonymous: false,
        isCurrentUser: false
    },
    {
        position: 4,
        userName: 'Carlos Mendoza',
        points: 740,
        isAnonymous: false,
        isCurrentUser: false
    },
    {
        position: 5,
        userName: 'Tú',
        points: 420,
        isAnonymous: false,
        isCurrentUser: true
    },
    {
        position: 6,
        userName: 'Anónimo 02756',
        points: 380,
        isAnonymous: true,
        isCurrentUser: false
    },
    {
        position: 7,
        userName: 'Lucía Sánchez',
        points: 320,
        isAnonymous: false,
        isCurrentUser: false
    },
    {
        position: 8,
        userName: 'Anónimo 06123',
        points: 280,
        isAnonymous: true,
        isCurrentUser: false
    },
    {
        position: 9,
        userName: 'Pedro Alonso',
        points: 220,
        isAnonymous: false,
        isCurrentUser: false
    },
    {
        position: 10,
        userName: 'Sandra Ruiz',
        points: 180,
        isAnonymous: false,
        isCurrentUser: false
    }
];

// Hook for reward service
export const useRewardsService = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Get all available rewards
    const getAvailableRewards = async (): Promise<Reward[]> => {
        setIsLoading(true);
        setError(null);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 800));

            // Filter only active rewards
            return REWARDS_DATA.filter(reward => reward.active);
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'Error al obtener recompensas';
            setError(errorMsg);
            return [];
        } finally {
            setIsLoading(false);
        }
    };

    // Get reward by ID
    const getRewardById = async (id: string): Promise<Reward | null> => {
        setIsLoading(true);
        setError(null);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 600));

            // Find reward by ID
            const reward = REWARDS_DATA.find(r => r.id === id);

            if (!reward) {
                throw new Error('Recompensa no encontrada');
            }

            return reward;
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'Error al obtener la recompensa';
            setError(errorMsg);
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    // Get user rewards
    const getUserRewards = async (): Promise<UserReward[]> => {
        setIsLoading(true);
        setError(null);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 700));

            return USER_REWARDS_DATA;
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'Error al obtener recompensas del usuario';
            setError(errorMsg);
            return [];
        } finally {
            setIsLoading(false);
        }
    };

    // Get user points
    const getUserPoints = async (): Promise<UserPoints> => {
        setIsLoading(true);
        setError(null);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500));

            return USER_POINTS_DATA;
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'Error al obtener puntos del usuario';
            setError(errorMsg);
            return {
                total: 0,
                available: 0,
                spent: 0,
                history: []
            };
        } finally {
            setIsLoading(false);
        }
    };

    // Redeem a reward
    const redeemReward = async (rewardId: string): Promise<{ success: boolean; message: string }> => {
        setIsLoading(true);
        setError(null);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Get the reward
            const reward = REWARDS_DATA.find(r => r.id === rewardId);

            if (!reward) {
                throw new Error('Recompensa no encontrada');
            }

            // Check if user has enough points
            if (USER_POINTS_DATA.available < reward.pointsRequired) {
                throw new Error('No tienes suficientes puntos para canjear esta recompensa');
            }

            // Add to user rewards (in a real app, this would be a POST request)
            const newUserReward: UserReward = {
                id: `ur-${Date.now()}`,
                userId: 'current-user',
                rewardId: reward.id,
                reward: reward,
                dateAssigned: new Date().toISOString().split('T')[0],
                status: 'Assigned',
                uniqueCode: `RWRD-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
            };

            USER_REWARDS_DATA.push(newUserReward);

            // Update user points (in a real app, this would be handled by the server)
            USER_POINTS_DATA.available -= reward.pointsRequired;
            USER_POINTS_DATA.spent += reward.pointsRequired;

            // Add transaction to history
            USER_POINTS_DATA.history.unshift({
                id: `pt-${Date.now()}`,
                amount: reward.pointsRequired,
                type: 'Spent',
                description: `Canje de ${reward.title}`,
                date: new Date().toISOString().split('T')[0],
                relatedEntityId: reward.id,
                relatedEntityType: 'Redemption'
            });

            return {
                success: true,
                message: `¡Has canjeado "${reward.title}" exitosamente!`
            };
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'Error al canjear la recompensa';
            setError(errorMsg);
            return {
                success: false,
                message: errorMsg
            };
        } finally {
            setIsLoading(false);
        }
    };

    // Get leaderboard
    const getLeaderboard = async (): Promise<LeaderboardEntry[]> => {
        setIsLoading(true);
        setError(null);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 800));

            return LEADERBOARD_DATA;
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'Error al obtener tabla de clasificación';
            setError(errorMsg);
            return [];
        } finally {
            setIsLoading(false);
        }
    };

    // Admin functions

    // Create a reward (admin only)
    const createReward = async (rewardData: Omit<Reward, 'id'>): Promise<Reward | null> => {
        setIsLoading(true);
        setError(null);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Create new reward with generated ID
            const newReward: Reward = {
                id: `rw-${Date.now()}`,
                ...rewardData
            };

            // Add to rewards (in a real app, this would be a POST request)
            REWARDS_DATA.push(newReward);

            return newReward;
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'Error al crear la recompensa';
            setError(errorMsg);
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    // Update a reward (admin only)
    const updateReward = async (id: string, rewardData: Partial<Reward>): Promise<Reward | null> => {
        setIsLoading(true);
        setError(null);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 800));

            // Find reward index
            const rewardIndex = REWARDS_DATA.findIndex(r => r.id === id);

            if (rewardIndex === -1) {
                throw new Error('Recompensa no encontrada');
            }

            // Update reward
            REWARDS_DATA[rewardIndex] = {
                ...REWARDS_DATA[rewardIndex],
                ...rewardData
            };

            return REWARDS_DATA[rewardIndex];
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'Error al actualizar la recompensa';
            setError(errorMsg);
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    // Delete a reward (admin only)
    const deleteReward = async (id: string): Promise<{ success: boolean; message: string }> => {
        setIsLoading(true);
        setError(null);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 800));

            // Check if reward is assigned to users
            const isAssigned = USER_REWARDS_DATA.some(ur => ur.rewardId === id);

            if (isAssigned) {
                throw new Error('No se puede eliminar esta recompensa porque ya ha sido asignada a usuarios');
            }

            // Find reward index
            const rewardIndex = REWARDS_DATA.findIndex(r => r.id === id);

            if (rewardIndex === -1) {
                throw new Error('Recompensa no encontrada');
            }

            // Remove reward
            REWARDS_DATA.splice(rewardIndex, 1);

            return {
                success: true,
                message: 'Recompensa eliminada exitosamente'
            };
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'Error al eliminar la recompensa';
            setError(errorMsg);
            return {
                success: false,
                message: errorMsg
            };
        } finally {
            setIsLoading(false);
        }
    };

    // Assign a reward manually (admin only)
    const assignRewardToUser = async (
        userId: string,
        rewardId: string,
        notes?: string
    ): Promise<UserReward | null> => {
        setIsLoading(true);
        setError(null);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Get the reward
            const reward = REWARDS_DATA.find(r => r.id === rewardId);

            if (!reward) {
                throw new Error('Recompensa no encontrada');
            }

            // Create assignment
            const newUserReward: UserReward = {
                id: `ur-${Date.now()}`,
                userId,
                rewardId,
                reward,
                dateAssigned: new Date().toISOString().split('T')[0],
                status: 'Assigned',
                uniqueCode: `RWRD-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
                notes
            };

            // Add to user rewards
            USER_REWARDS_DATA.push(newUserReward);

            return newUserReward;
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'Error al asignar la recompensa';
            setError(errorMsg);
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    // Update user reward status (admin only)
    const updateUserRewardStatus = async (
        userRewardId: string,
        status: UserReward['status']
    ): Promise<UserReward | null> => {
        setIsLoading(true);
        setError(null);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 800));

            // Find user reward
            const userRewardIndex = USER_REWARDS_DATA.findIndex(ur => ur.id === userRewardId);

            if (userRewardIndex === -1) {
                throw new Error('Recompensa de usuario no encontrada');
            }

            // Update status
            USER_REWARDS_DATA[userRewardIndex] = {
                ...USER_REWARDS_DATA[userRewardIndex],
                status
            };

            return USER_REWARDS_DATA[userRewardIndex];
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'Error al actualizar el estado de la recompensa';
            setError(errorMsg);
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        isLoading,
        error,
        // User functions
        getAvailableRewards,
        getRewardById,
        getUserRewards,
        getUserPoints,
        redeemReward,
        getLeaderboard,
        // Admin functions
        createReward,
        updateReward,
        deleteReward,
        assignRewardToUser,
        updateUserRewardStatus
    };
};

export default useRewardsService;