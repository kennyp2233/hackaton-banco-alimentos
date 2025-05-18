// src/modules/admin/components/UserDetailCard.tsx
'use client';
import { FC } from 'react';
import { UserData } from '../types';
import { motion } from 'framer-motion';

interface UserDetailCardProps {
    user: UserData;
}

const UserDetailCard: FC<UserDetailCardProps> = ({ user }) => {
    return (
        <motion.div
            className="bg-white rounded-xl shadow-md p-6 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">
                Información del Usuario
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <div className="mb-4">
                        <p className="text-sm font-semibold text-gray-500">Nombres y Apellidos</p>
                        <p className="text-gray-800">{user.nombres} {user.apellidos}</p>
                    </div>

                    <div className="mb-4">
                        <p className="text-sm font-semibold text-gray-500">Cédula</p>
                        <p className="text-gray-800">{user.cedula}</p>
                    </div>

                    <div className="mb-4">
                        <p className="text-sm font-semibold text-gray-500">Fecha de Nacimiento</p>
                        <p className="text-gray-800">{new Date(user.fechaNacimiento).toLocaleDateString('es-EC')}</p>
                    </div>

                    <div className="mb-4">
                        <p className="text-sm font-semibold text-gray-500">Dirección</p>
                        <p className="text-gray-800">{user.direccion}</p>
                    </div>
                </div>

                <div>
                    <div className="mb-4">
                        <p className="text-sm font-semibold text-gray-500">Ciudad</p>
                        <p className="text-gray-800">{user.ciudad}</p>
                    </div>

                    <div className="mb-4">
                        <p className="text-sm font-semibold text-gray-500">Provincia</p>
                        <p className="text-gray-800">{user.provincia}</p>
                    </div>

                    <div className="mb-4">
                        <p className="text-sm font-semibold text-gray-500">Teléfono</p>
                        <p className="text-gray-800">{user.telefono}</p>
                    </div>

                    <div className="mb-4">
                        <p className="text-sm font-semibold text-gray-500">Correo Electrónico</p>
                        <p className="text-gray-800">{user.correo}</p>
                    </div>
                </div>
            </div>

            <div className="mt-4">
                <p className="text-sm font-semibold text-gray-500">Resumen de Donaciones</p>
                <div className="flex items-center mt-2">
                    <div className="bg-primary/10 text-primary font-bold rounded-full px-4 py-2 text-sm mr-4">
                        ${user.donaciones.reduce((sum, donation) => sum + donation.monto, 0)} Total donado
                    </div>

                    <div className="bg-gray-100 text-gray-600 font-bold rounded-full px-4 py-2 text-sm">
                        {user.donaciones.length} Donaciones
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default UserDetailCard;