'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import PageContainer from '@/shared/layout/PageContainer';
import { useRewardsService, Reward } from '@/modules/rewards/services/rewardsService';
import Image from 'next/image';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function AdminRewardsPage() {
    const {
        getAvailableRewards,
        createReward,
        updateReward,
        deleteReward,
        isLoading
    } = useRewardsService();

    const [rewards, setRewards] = useState<Reward[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editingReward, setEditingReward] = useState<Reward | null>(null);
    const [rewardToDelete, setRewardToDelete] = useState<Reward | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        pointsRequired: 100,
        imageUrl: '',
        type: 'Badge' as 'Badge' | 'Certificate' | 'Experience' | 'Discount',
        active: true,
        availableQuantity: undefined as number | undefined,
        isHighlighted: false
    });

    // Fetch rewards on component mount
    useEffect(() => {
        const fetchRewards = async () => {
            try {
                const rewardsData = await getAvailableRewards();
                setRewards(rewardsData);
            } catch (error) {
                console.error('Error fetching rewards:', error);
                toast.error('Error al cargar las recompensas');
            }
        };

        fetchRewards();
    }, []);

    // Open modal for creating new reward
    const handleOpenCreateModal = () => {
        setEditingReward(null);
        setFormData({
            title: '',
            description: '',
            pointsRequired: 100,
            imageUrl: '',
            type: 'Badge',
            active: true,
            availableQuantity: undefined,
            isHighlighted: false
        });
        setIsModalOpen(true);
    };

    // Open modal for editing reward
    const handleOpenEditModal = (reward: Reward) => {
        setEditingReward(reward);
        setFormData({
            title: reward.title,
            description: reward.description,
            pointsRequired: reward.pointsRequired,
            imageUrl: reward.imageUrl,
            type: reward.type,
            active: reward.active,
            availableQuantity: reward.availableQuantity,
            isHighlighted: reward.isHighlighted || false
        });
        setIsModalOpen(true);
    };

    // Open delete confirmation modal
    const handleOpenDeleteModal = (reward: Reward) => {
        setRewardToDelete(reward);
        setIsDeleteModalOpen(true);
    };

    // Handle form input change
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        if (type === 'checkbox') {
            const checkbox = e.target as HTMLInputElement;
            setFormData({ ...formData, [name]: checkbox.checked });
        } else if (name === 'pointsRequired' || name === 'availableQuantity') {
            // Convert to number
            const numValue = value === '' ? (name === 'availableQuantity' ? undefined : 0) : parseInt(value, 10);
            setFormData({ ...formData, [name]: numValue });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (editingReward) {
                // Update existing reward
                const updatedReward = await updateReward(editingReward.id, {
                    title: formData.title,
                    description: formData.description,
                    pointsRequired: formData.pointsRequired,
                    imageUrl: formData.imageUrl,
                    type: formData.type,
                    active: formData.active,
                    availableQuantity: formData.availableQuantity,
                    isHighlighted: formData.isHighlighted
                });

                if (updatedReward) {
                    toast.success('Recompensa actualizada exitosamente');
                    // Update rewards list
                    setRewards(rewards.map(r => r.id === updatedReward.id ? updatedReward : r));
                }
            } else {
                // Create new reward
                const newReward = await createReward({
                    title: formData.title,
                    description: formData.description,
                    pointsRequired: formData.pointsRequired,
                    imageUrl: formData.imageUrl,
                    type: formData.type,
                    active: formData.active,
                    availableQuantity: formData.availableQuantity,
                    isHighlighted: formData.isHighlighted
                });

                if (newReward) {
                    toast.success('Recompensa creada exitosamente');
                    // Add new reward to list
                    setRewards([...rewards, newReward]);
                }
            }

            setIsModalOpen(false);
        } catch (error) {
            console.error('Error saving reward:', error);
            toast.error('Error al guardar la recompensa');
        }
    };

    // Handle reward deletion
    const handleDeleteReward = async () => {
        if (!rewardToDelete) return;

        try {
            const result = await deleteReward(rewardToDelete.id);

            if (result.success) {
                toast.success(result.message);
                // Remove reward from list
                setRewards(rewards.filter(r => r.id !== rewardToDelete.id));
                setIsDeleteModalOpen(false);
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            console.error('Error deleting reward:', error);
            toast.error('Error al eliminar la recompensa');
        }
    };

    // Get badge color based on reward type
    const getBadgeColor = (type: string) => {
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

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <PageContainer>
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Administración de Recompensas</h1>
                        <p className="text-gray-600 mt-2">
                            Gestiona las recompensas disponibles para los donantes
                        </p>
                    </div>
                    <motion.button
                        className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded-lg flex items-center"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleOpenCreateModal}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        Nueva Recompensa
                    </motion.button>
                </div>

                {/* Rewards Table */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                        <h2 className="text-xl font-bold">Recompensas</h2>
                    </div>

                    {isLoading ? (
                        <div className="p-6 animate-pulse space-y-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="flex items-center">
                                    <div className="w-16 h-16 bg-gray-200 rounded-lg mr-4"></div>
                                    <div className="flex-1">
                                        <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                    </div>
                                    <div className="w-24 h-8 bg-gray-200 rounded"></div>
                                </div>
                            ))}
                        </div>
                    ) : rewards.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Recompensa
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Tipo
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Créditos
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Estado
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Destacado
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {rewards.map((reward) => (
                                        <tr key={reward.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-12 w-12 relative rounded-lg overflow-hidden">
                                                        <Image
                                                            src={reward.imageUrl || '/images/rewards/placeholder.jpg'}
                                                            alt={reward.title}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {reward.title}
                                                        </div>
                                                        <div className="text-sm text-gray-500 max-w-xs truncate">
                                                            {reward.description}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`${getBadgeColor(reward.type)} px-2 py-1 text-xs rounded-full`}>
                                                    {reward.type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {reward.pointsRequired}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 text-xs rounded-full ${reward.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {reward.active ? 'Activo' : 'Inactivo'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {reward.isHighlighted ? (
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                    </svg>
                                                ) : (
                                                    <span>–</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    className="text-primary hover:text-primary-dark mr-3"
                                                    onClick={() => handleOpenEditModal(reward)}
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    className="text-red-600 hover:text-red-800"
                                                    onClick={() => handleOpenDeleteModal(reward)}
                                                >
                                                    Eliminar
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="p-6 text-center">
                            <p className="text-gray-500">No hay recompensas disponibles</p>
                        </div>
                    )}
                </div>

                {/* Create/Edit Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <motion.div
                            className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                        >
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h2 className="text-xl font-bold">{editingReward ? 'Editar Recompensa' : 'Nueva Recompensa'}</h2>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Título
                                        </label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Tipo
                                        </label>
                                        <select
                                            name="type"
                                            value={formData.type}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                                        >
                                            <option value="Badge">Insignia</option>
                                            <option value="Certificate">Certificado</option>
                                            <option value="Experience">Experiencia</option>
                                            <option value="Discount">Descuento</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Créditos requeridos
                                        </label>
                                        <input
                                            type="number"
                                            name="pointsRequired"
                                            value={formData.pointsRequired}
                                            onChange={handleInputChange}
                                            min="1"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Cantidad disponible
                                        </label>
                                        <input
                                            type="number"
                                            name="availableQuantity"
                                            value={formData.availableQuantity === undefined ? '' : formData.availableQuantity}
                                            onChange={handleInputChange}
                                            min="0"
                                            placeholder="Ilimitado"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">Deja en blanco para disponibilidad ilimitada</p>
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            URL de la imagen
                                        </label>
                                        <input
                                            type="url"
                                            name="imageUrl"
                                            value={formData.imageUrl}
                                            onChange={handleInputChange}
                                            placeholder="https://ejemplo.com/imagen.jpg"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">Deja en blanco para usar la imagen por defecto</p>
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Descripción
                                        </label>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            rows={4}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                                            required
                                        ></textarea>
                                    </div>

                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="active"
                                            name="active"
                                            checked={formData.active}
                                            onChange={handleInputChange}
                                            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                                        />
                                        <label htmlFor="active" className="ml-2 block text-sm text-gray-900">
                                            Activo
                                        </label>
                                    </div>

                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="isHighlighted"
                                            name="isHighlighted"
                                            checked={formData.isHighlighted}
                                            onChange={handleInputChange}
                                            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                                        />
                                        <label htmlFor="isHighlighted" className="ml-2 block text-sm text-gray-900">
                                            Destacado
                                        </label>
                                    </div>
                                </div>

                                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                                    <button
                                        type="button"
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary"
                                        onClick={() => setIsModalOpen(false)}
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 text-sm font-medium text-white bg-primary border border-transparent rounded-md shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary"
                                    >
                                        {editingReward ? 'Actualizar' : 'Crear'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                {isDeleteModalOpen && rewardToDelete && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <motion.div
                            className="bg-white rounded-xl shadow-xl max-w-md w-full"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                        >
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h2 className="text-xl font-bold text-gray-800">Confirmar eliminación</h2>
                            </div>

                            <div className="p-6">
                                <p className="text-gray-700 mb-4">
                                    ¿Estás seguro de que deseas eliminar la recompensa <strong>{rewardToDelete.title}</strong>?
                                </p>
                                <p className="text-gray-500 mb-6 text-sm">
                                    Esta acción no se puede deshacer.
                                </p>

                                <div className="flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary"
                                        onClick={() => setIsDeleteModalOpen(false)}
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="button"
                                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                                        onClick={handleDeleteReward}
                                    >
                                        Eliminar
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