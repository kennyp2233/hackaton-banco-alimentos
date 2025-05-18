// src/modules/admin/components/PaymentMethodChart.tsx
'use client';
import { FC } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

interface PaymentMethodChartProps {
    data: Array<{ metodo: string; porcentaje: number; cantidad: number }>;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const PaymentMethodChart: FC<PaymentMethodChartProps> = ({ data }) => {
    return (
        <motion.div
            className="bg-white rounded-xl shadow-md p-6 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
        >
            <h2 className="text-xl font-bold mb-4 text-gray-800">Métodos de Pago</h2>
            <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="porcentaje"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip formatter={(value) => `${value}%`} />
                    </PieChart>
                </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-4">
                {data.map((item, index) => (
                    <div key={item.metodo} className="text-center">
                        <div className="text-sm font-medium">{item.metodo}</div>
                        <div className="flex items-center justify-center gap-2">
                            <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: COLORS[index % COLORS.length] }}
                            />
                            <span className="text-sm text-gray-600">{item.cantidad} donaciones</span>
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

export default PaymentMethodChart;