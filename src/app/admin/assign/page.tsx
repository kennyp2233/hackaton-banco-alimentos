'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import PageContainer from '@/shared/layout/PageContainer';
import { useRewardsService, Reward, UserReward } from '@/modules/rewards/services/rewardsService';
import Image from 'next/image';
import toast from 'react-hot-toast';

// Mock user data - in a real application, this would come from an API
const MOCK_USERS = [
    { id: '1', name: 'Juan Pérez', email: 'juan.perez@example.com', points: 320 },
    { id: '2', name: 'María López', email: 'maria.lopez@example.com', points: 750 },
    { id: '3', name: 'Carlos Rodríguez', email: 'carlos.rodriguez@example.com', points: 175 },
    { id: '4', name: 'Ana Martínez', email: 'ana.martinez@example.com', points: 430 },
    { id: '5', name: 'Roberto Gómez', email: 'roberto.gomez@example.com', points: 925 },
];

export default function AdminAssignRewardsPage() {
    const {
        getAvailableRewards,
        getUserRewards,
        assignRewardToUser,
        updateUserRewardStatus,
        isLoading
    } = useRewardsService();

    const [rewards, setRewards] = useState<Reward[]>([]);
    const [userRewards, setUserRewards] = useState<UserReward[]>([]);
    const [users, setUsers] = useState(MOCK_USERS);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [isUpdateStatusModalOpen, setIsUpdateStatusModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<typeof MOCK_USERS[0] | null>(null);
    const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
    const [selectedUserReward, setSelectedUserReward] = useState<UserReward | null>(null);
    const [assignNotes, setAssignNotes] = useState('');
    const [newStatus, setNewStatus] = useState<UserReward['status']>('Assigned');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<string | null>(null);

    // Fetch rewards and user rewards on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [rewardsData, userRewardsData] = await Promise.all([
                    getAvailableRewards(),
                    getUserRewards() // This would be modified in a real app to fetch all users' rewards
                ]);

                setRewards(rewardsData);

                // Mock more user rewards for demonstration
                const mockUserRewards: UserReward[] = [
                    ...userRewardsData,
                    {
                        id: 'ur-002',
                        userId: '2',
                        rewardId: 'rw-003',
                        reward: rewardsData.find(r => r.id === 'rw-003')!,
                        dateAssigned: '2025-05-01',
                        status: 'Redeemed',
                        uniqueCode: 'RWRD-ABC123'
                    },
                    {
                        id: 'ur-003',
                        userId: '3',
                        rewardId: 'rw-004',
                        reward: rewardsData.find(r => r.id === 'rw-004')!,
                        dateAssigned: '2025-04-20',
                        status: 'Delivered',
                        uniqueCode: 'RWRD-DEF456'
                    },
                    {
                        id: 'ur-004',
                        userId: '2',
                        rewardId: 'rw-001',
                        reward: rewardsData.find(r => r.id === 'rw-001')!,
                        dateAssigned: '2025-03-15',
                        status: 'Delivered',
                        uniqueCode: 'RWRD-GHI789'
                    }
                ];

                setUserRewards(mockUserRewards);
            } catch (error) {
                console.error('Error fetching data:', error);
                toast.error('Error al cargar los datos');
            }
        };

        fetchData();
    }, []);

    // Open modal for assigning a reward
    const handleOpenAssignModal = (user: typeof MOCK_USERS[0]) => {
        setSelectedUser(user);
        setSelectedReward(null);
        setAssignNotes('');
        setIsAssignModalOpen(true);
    };

    // Open modal for updating reward status
    const handleOpenUpdateStatusModal = (userReward: UserReward) => {
        setSelectedUserReward(userReward);
        setNewStatus(userReward.status);
        setIsUpdateStatusModalOpen(true);
    };

    // Handle assigning a reward to a user
    const handleAssignReward = async () => {
        if (!selectedUser || !selectedReward) {
            toast.error('Por favor selecciona un usuario y una recompensa');
            return;
        }

        try {
            const result = await assignRewardToUser(
                selectedUser.id,
                selectedReward.id,
                assignNotes
            );

            if (result) {
                toast.success(`Recompensa asignada a ${selectedUser.name}`);
                // Add new user reward to list
                setUserRewards([...userRewards, result]);
                setIsAssignModalOpen(false);
            }
        } catch (error) {
            console.error('Error assigning reward:', error);
            toast.error('Error al asignar la recompensa');
        }
    };

    // Handle updating reward status
    const handleUpdateStatus = async () => {
        if (!selectedUserReward || selectedUserReward.status === newStatus) {
            setIsUpdateStatusModalOpen(false);
            return;
        }

        try {
            const result = await updateUserRewardStatus(selectedUserReward.id, newStatus);

            if (result) {
                toast.success('Estado de la recompensa actualizado');
                // Update user reward in list
                setUserRewards(userRewards.map(ur => ur.id === result.id ? result : ur));
                setIsUpdateStatusModalOpen(false);
            }
        } catch (error) {
            console.error('Error updating reward status:', error);
            toast.error('Error al actualizar el estado de la recompensa');
        }
    };

    // Get user name by ID
    const getUserName = (userId: string) => {
        const user = users.find(u => u.id === userId);
        return user ? user.name : 'Usuario Desconocido';
    };

    // Get status badge color
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

    // Filter user rewards based on search and status filter
    const filteredUserRewards = userRewards.filter(ur => {
        const matchesSearch = searchTerm === '' ||
            getUserName(ur.userId).toLowerCase().includes(searchTerm.toLowerCase()) ||
            ur.reward.title.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = filterStatus === null || ur.status === filterStatus;

        return matchesSearch && matchesStatus;
    });

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <PageContainer>
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Asignación de Recompensas</h1>
                        <p className="text-gray-600 mt-2">
                            Gestiona las recompensas asignadas a los usuarios
                        </p>
                    </div>
                </div>

                {/* Users Table */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
                    <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                        <h2 className="text-xl font-bold">Usuarios</h2>
                    </div>

                    {isLoading ? (
                        <div className="p-6 animate-pulse space-y-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="h-10 w-10 bg-gray-200 rounded-full mr-4"></div>
                                        <div>
                                            <div className="h-5 bg-gray-200 rounded w-32 mb-2"></div>
                                            <div className="h-4 bg-gray-200 rounded w-48"></div>
                                        </div>
                                    </div>
                                    <div className="w-24 h-8 bg-gray-200 rounded"></div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Usuario
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Email
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Créditos
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {users.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                                                        <span className="text-gray-500 font-bold">
                                                            {user.name.charAt(0).toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {user.name}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {user.email}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary">
                                                {user.points} créditos
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    className="bg-primary hover:bg-primary-dark text-white px-3 py-1 rounded-lg transition-colors"
                                                    onClick={() => handleOpenAssignModal(user)}
                                                >
                                                    Asignar recompensa
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* User Rewards List */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <h2 className="text-xl font-bold">Recompensas Asignadas</h2>

                        <div className="flex flex-col md:flex-row gap-3">
                            {/* Search input */}
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Buscar por usuario o recompensa"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full md:w-64 pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                                />
                                <div className="absolute left-3 top-2.5 text-gray-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                            </div>

                            {/* Status filter */}
                            <select
                                value={filterStatus || ''}
                                onChange={(e) => setFilterStatus(e.target.value === '' ? null : e.target.value)}
                                className="w-full md:w-auto px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                            >
                                <option value="">Todos los estados</option>
                                <option value="Assigned">Asignada</option>
                                <option value="Redeemed">Canjeada</option>
                                <option value="Delivered">Entregada</option>
                                <option value="Expired">Expirada</option>
                            </select>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="p-6 animate-pulse space-y-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="h-12 w-12 bg-gray-200 rounded-lg mr-4"></div>
                                        <div>
                                            <div className="h-5 bg-gray-200 rounded w-40 mb-2"></div>
                                            <div className="h-4 bg-gray-200 rounded w-24"></div>
                                        </div>
                                    </div>
                                    <div className="w-24 h-8 bg-gray-200 rounded"></div>
                                </div>
                            ))}
                        </div>
                    ) : filteredUserRewards.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Recompensa
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Usuario
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Fecha
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Estado
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Código
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredUserRewards.map((userReward) => (
                                        <tr key={userReward.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10 relative rounded-lg overflow-hidden">
                                                        <Image
                                                            src={userReward.reward.imageUrl || '/images/rewards/placeholder.jpg'}
                                                            alt={userReward.reward.title}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {userReward.reward.title}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            {userReward.reward.pointsRequired} créditos
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {getUserName(userReward.userId)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {userReward.dateAssigned}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`${getStatusBadge(userReward.status)} px-2 py-1 text-xs rounded-full`}>
                                                    {userReward.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                                                {userReward.uniqueCode || '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    className="text-primary hover:text-primary-dark"
                                                    onClick={() => handleOpenUpdateStatusModal(userReward)}
                                                >
                                                    Cambiar estado
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="p-6 text-center">
                            <p className="text-gray-500">No se encontraron resultados</p>
                        </div>
                    )}
                </div>

                {/* Assign Reward Modal */}
                {isAssignModalOpen && selectedUser && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <motion.div
                            className="bg-white rounded-xl shadow-xl max-w-md w-full"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                        >
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h2 className="text-xl font-bold">Asignar Recompensa</h2>
                            </div>

                            <div className="p-6">
                                <div className="mb-6">
                                    <p className="text-gray-700">
                                        Asignar recompensa a <strong>{selectedUser.name}</strong>
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Créditos disponibles: {selectedUser.points}
                                    </p>
                                </div>

                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Seleccionar Recompensa
                                    </label>
                                    <select
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                                        value={selectedReward?.id || ''}
                                        onChange={(e) => {
                                            const reward = rewards.find(r => r.id === e.target.value);
                                            setSelectedReward(reward || null);
                                        }}
                                    >
                                        <option value="">Seleccionar...</option>
                                        {rewards.map((reward) => (
                                            <option
                                                key={reward.id}
                                                value={reward.id}
                                                disabled={reward.pointsRequired > selectedUser.points}
                                            >
                                                {reward.title} ({reward.pointsRequired} créditos)
                                                {reward.pointsRequired > selectedUser.points ? ' - Créditos insuficientes' : ''}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Notas (opcional)
                                    </label>
                                    <textarea
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                                        rows={3}
                                        value={assignNotes}
                                        onChange={(e) => setAssignNotes(e.target.value)}
                                        placeholder="Añade notas sobre esta asignación"
                                    ></textarea>
                                </div>

                                <div className="flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary"
                                        onClick={() => setIsAssignModalOpen(false)}
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="button"
                                        className="px-4 py-2 text-sm font-medium text-white bg-primary border border-transparent rounded-md shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary"
                                        onClick={handleAssignReward}
                                        disabled={!selectedReward}
                                    >
                                        Asignar
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* Update Status Modal */}
                {isUpdateStatusModalOpen && selectedUserReward && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <motion.div
                            className="bg-white rounded-xl shadow-xl max-w-md w-full"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                        >
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h2 className="text-xl font-bold">Actualizar Estado</h2>
                            </div>

                            <div className="p-6">
                                <div className="mb-6">
                                    <p className="text-gray-700">
                                        <strong>{selectedUserReward.reward.title}</strong>
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Asignada a {getUserName(selectedUserReward.userId)} el {selectedUserReward.dateAssigned}
                                    </p>
                                </div>

                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Estado
                                    </label>
                                    <select
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                                        value={newStatus}
                                        onChange={(e) => setNewStatus(e.target.value as UserReward['status'])}
                                    >
                                        <option value="Assigned">Asignada</option>
                                        <option value="Redeemed">Canjeada</option>
                                        <option value="Delivered">Entregada</option>
                                        <option value="Expired">Expirada</option>
                                    </select>
                                </div>

                                <div className="flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary"
                                        onClick={() => setIsUpdateStatusModalOpen(false)}
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="button"
                                        className="px-4 py-2 text-sm font-medium text-white bg-primary border border-transparent rounded-md shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary"
                                        onClick={handleUpdateStatus}
                                    >
                                        Actualizar
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </PageContainer>
        </div>
    );
}