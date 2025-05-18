// src/modules/admin/components/ProvinceDistributionChart.tsx
'use client';
import { FC } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { motion } from 'framer-motion';

interface ProvinceDistributionChartProps {
    data: Array<{ provincia: string; cantidad: number; porcentaje: number }>;
}

const COLORS = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#C9CBCF'];

const ProvinceDistributionChart: FC<ProvinceDistributionChartProps> = ({ data }) => {
    return (
        <motion.div
            className="bg-white rounded-xl shadow-md p-6 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
        >
            <h2 className="text-xl font-bold mb-4 text-gray-800">Distribución por Provincia</h2>
            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            labelLine={true}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="cantidad"
                            nameKey="provincia"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip formatter={(value) => `${value} donantes`} />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
};

export default ProvinceDistributionChart;