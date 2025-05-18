// src/app/admin/dashboard/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PageContainer from '@/shared/layout/PageContainer';
import StatsSummary from '@/modules/admin/components/StatsSummary';
import UserSelector from '@/modules/admin/components/UserSelector';
import UserDetailCard from '@/modules/admin/components/UserDetailCard';
import UserDonationsTable from '@/modules/admin/components/UserDonationsTable';
import MonthlyDonationsChart from '@/modules/admin/components/MonthlyDonationsChart';
import PaymentMethodChart from '@/modules/admin/components/PaymentMethodChart';
import TopDonorsTable from '@/modules/admin/components/TopDonorsTable';
import ProvinceDistributionChart from '@/modules/admin/components/ProvinceDistributionChart';
import { mockUsers, monthlyDonationStats, paymentMethodStats, topDonorStats, provinciaStats } from '@/modules/admin/data/mockData';
import { UserData } from '@/modules/admin/types';

export default function AdminDashboardPage() {
    const [selectedUser, setSelectedUser] = useState<UserData | null>(null);

    // Cálculos para las estadísticas sumarias
    const totalUsers = mockUsers.length;
    const totalDonations = mockUsers.reduce((sum, user) => sum + user.donaciones.length, 0);
    const totalAmount = mockUsers.reduce((sum, user) => {
        return sum + user.donaciones.reduce((donationSum, donation) => donationSum + donation.monto, 0);
    }, 0);
    const avgDonation = totalAmount / totalDonations;

    // Calcular porcentaje de donaciones recurrentes
    const recurringDonations = mockUsers.reduce((sum, user) => {
        return sum + user.donaciones.filter(d => d.recurrente).length;
    }, 0);
    const recurringDonationsPercent = Math.round((recurringDonations / totalDonations) * 100);

    // Seleccionar el primer usuario por defecto
    useEffect(() => {
        if (mockUsers.length > 0 && !selectedUser) {
            setSelectedUser(mockUsers[0]);
        }
    }, []);

    return (
        <PageContainer className="py-8">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">Dashboard Administrativo</h1>

                    <div className="flex items-center">
                        <span className="text-sm text-gray-500 mr-2">Última actualización:</span>
                        <span className="text-sm font-medium">{new Date().toLocaleDateString('es-EC', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}</span>
                    </div>
                </div>

                {/* Estadísticas generales */}
                <StatsSummary
                    totalUsers={totalUsers}
                    totalDonations={totalDonations}
                    totalAmount={totalAmount}
                    avgDonation={avgDonation}
                    recurringDonationsPercent={recurringDonationsPercent}
                />

                {/* Sección principal */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Sección izquierda - Información de usuario */}
                    <div className="lg:col-span-1">
                        <UserSelector
                            users={mockUsers}
                            onSelectUser={setSelectedUser}
                            selectedUserId={selectedUser?.id}
                        />

                        {selectedUser && (
                            <>
                                <UserDetailCard user={selectedUser} />
                                <UserDonationsTable user={selectedUser} />
                            </>
                        )}
                    </div>

                    {/* Sección derecha - Gráficos y estadísticas */}
                    <div className="lg:col-span-2">
                        <MonthlyDonationsChart data={monthlyDonationStats} />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <PaymentMethodChart data={paymentMethodStats} />
                            <ProvinceDistributionChart data={provinciaStats} />
                        </div>

                        <TopDonorsTable data={topDonorStats} />
                    </div>
                </div>
            </motion.div>
        </PageContainer>
    );
}