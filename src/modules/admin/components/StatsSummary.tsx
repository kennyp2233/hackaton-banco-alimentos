// src/modules/admin/components/StatsSummary.tsx
'use client';
import { FC } from 'react';
import { motion } from 'framer-motion';

interface StatsSummaryProps {
    totalUsers: number;
    totalDonations: number;
    totalAmount: number;
    avgDonation: number;
    recurringDonationsPercent: number;
}

const StatsSummary: FC<StatsSummaryProps> = ({
    totalUsers,
    totalDonations,
    totalAmount,
    avgDonation,
    recurringDonationsPercent
}) => {
    const stats = [
        {
            title: 'Total Donantes',
            value: totalUsers,
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            ),
            color: 'bg-blue-500'
        },
        {
            title: 'Total Donaciones',
            value: totalDonations,
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
            ),
            color: 'bg-primary'
        },
        {
            title: 'Monto Total',
            value: `$${totalAmount.toLocaleString()}`,
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            color: 'bg-green-500'
        },
        {
            title: 'Promedio por Donación',
            value: `$${avgDonation.toFixed(2)}`,
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
            ),
            color: 'bg-purple-500'
        },
        {
            title: 'Donaciones Recurrentes',
            value: `${recurringDonationsPercent}%`,
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
            ),
            color: 'bg-yellow-500'
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            {stats.map((stat, index) => (
                <motion.div
                    key={stat.title}
                    className="bg-white rounded-xl shadow-md overflow-hidden"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                >
                    <div className={`${stat.color} p-4 text-white`}>
                        {stat.icon}
                    </div>
                    <div className="p-4">
                        <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                        <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

export default StatsSummary;