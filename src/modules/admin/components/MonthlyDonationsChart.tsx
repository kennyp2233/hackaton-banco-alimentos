// src/modules/admin/components/MonthlyDonationsChart.tsx
'use client';
import { FC } from 'react';
import { MonthlyDonationStats } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

interface MonthlyDonationsChartProps {
    data: MonthlyDonationStats[];
}

const MonthlyDonationsChart: FC<MonthlyDonationsChartProps> = ({ data }) => {
    return (
        <motion.div
            className="bg-white rounded-xl shadow-md p-6 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
        >
            <h2 className="text-xl font-bold mb-4 text-gray-800">Donaciones Mensuales</h2>
            <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="mes" />
                        <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                        <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                        <Tooltip formatter={(value: any) => typeof value === 'number' ? `$${value}` : value} />
                        <Legend />
                        <Bar yAxisId="left" dataKey="totalDonaciones" name="Monto Total ($)" fill="#8884d8" radius={[4, 4, 0, 0]} />
                        <Bar yAxisId="right" dataKey="cantidadDonaciones" name="Cantidad" fill="#82ca9d" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
};

export default MonthlyDonationsChart;