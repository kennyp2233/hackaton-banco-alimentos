// src/modules/admin/components/UserDonationsTable.tsx
'use client';
import { FC, useState } from 'react';
import { UserData, Donation } from '../types';
import { motion } from 'framer-motion';

interface UserDonationsTableProps {
    user: UserData;
}

const UserDonationsTable: FC<UserDonationsTableProps> = ({ user }) => {
    const [sortField, setSortField] = useState<keyof Donation>('fecha');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

    // Ordenar donaciones
    const sortedDonations = [...user.donaciones].sort((a, b) => {
        if (sortField === 'fecha') {
            return sortDirection === 'asc'
                ? new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
                : new Date(b.fecha).getTime() - new Date(a.fecha).getTime();
        } else if (sortField === 'monto') {
            return sortDirection === 'asc' ? a.monto - b.monto : b.monto - a.monto;
        }
        return 0;
    });

    // Cambiar campo de ordenamiento
    const handleSort = (field: keyof Donation) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('desc');
        }
    };

    // Calcular monto total
    const totalAmount = user.donaciones.reduce((sum, donation) => sum + donation.monto, 0);

    return (
        <motion.div
            className="bg-white rounded-xl shadow-md p-6 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
        >
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Historial de Donaciones</h2>
                <div className="bg-primary/10 text-primary font-bold rounded-full px-4 py-2 text-sm">
                    Total: ${totalAmount}
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full">
                    <thead>
                        <tr>
                            <th
                                className="px-4 py-2 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                onClick={() => handleSort('fecha')}
                            >
                                Fecha
                                {sortField === 'fecha' && (
                                    <span className="ml-1">
                                        {sortDirection === 'asc' ? '↑' : '↓'}
                                    </span>
                                )}
                            </th>
                            <th
                                className="px-4 py-2 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                onClick={() => handleSort('monto')}
                            >
                                Monto
                                {sortField === 'monto' && (
                                    <span className="ml-1">
                                        {sortDirection === 'asc' ? '↑' : '↓'}
                                    </span>
                                )}
                            </th>
                            <th className="px-4 py-2 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Método
                            </th>
                            <th className="px-4 py-2 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Estado
                            </th>
                            <th className="px-4 py-2 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Tipo
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {sortedDonations.map((donation, index) => (
                            <motion.tr
                                key={donation.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.2, delay: 0.05 * index }}
                            >
                                <td className="px-4 py-3 whitespace-nowrap">
                                    {new Date(donation.fecha).toLocaleDateString('es-EC')}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-900">
                                    ${donation.monto}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${donation.metodo === 'tarjeta'
                                            ? 'bg-blue-100 text-blue-800'
                                            : donation.metodo === 'transferencia'
                                                ? 'bg-purple-100 text-purple-800'
                                                : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {donation.metodo === 'tarjeta' && '💳'}
                                        {donation.metodo === 'transferencia' && '🏦'}
                                        {donation.metodo === 'efectivo' && '💵'}
                                        {donation.metodo.charAt(0).toUpperCase() + donation.metodo.slice(1)}
                                    </span>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${donation.estado === 'completado'
                                            ? 'bg-green-100 text-green-800'
                                            : donation.estado === 'pendiente'
                                                ? 'bg-yellow-100 text-yellow-800'
                                                : 'bg-red-100 text-red-800'
                                        }`}>
                                        {donation.estado.charAt(0).toUpperCase() + donation.estado.slice(1)}
                                    </span>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                    {donation.recurrente ? 'Recurrente' : 'Único'}
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
};

export default UserDonationsTable;