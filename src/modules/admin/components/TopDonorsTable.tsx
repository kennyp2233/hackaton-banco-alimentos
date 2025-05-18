// src/modules/admin/components/TopDonorsTable.tsx
'use client';
import { FC } from 'react';
import { TopDonorStats } from '../types';
import { motion } from 'framer-motion';

interface TopDonorsTableProps {
    data: TopDonorStats[];
}

const TopDonorsTable: FC<TopDonorsTableProps> = ({ data }) => {
    return (
        <motion.div
            className="bg-white rounded-xl shadow-md p-6 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
        >
            <h2 className="text-xl font-bold mb-4 text-gray-800">Top Donantes</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Usuario
                            </th>
                            <th className="px-4 py-2 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Total Donado
                            </th>
                            <th className="px-4 py-2 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                # Donaciones
                            </th>
                            <th className="px-4 py-2 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Promedio
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {data.map((donor, index) => (
                            <motion.tr
                                key={donor.userId}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.2, delay: 0.1 * index }}
                            >
                                <td className="px-4 py-3 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
                                            <span className="font-bold text-primary text-sm">{index + 1}</span>
                                        </div>
                                        <div className="ml-3">
                                            <div className="text-sm font-medium text-gray-900">
                                                {donor.nombres} {donor.apellidos}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">${donor.totalDonado}</div>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                    <div className="text-sm text-gray-500">{donor.cantidadDonaciones}</div>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                    <div className="text-sm text-gray-500">
                                        ${(donor.totalDonado / donor.cantidadDonaciones).toFixed(2)}
                                    </div>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
};

export default TopDonorsTable;