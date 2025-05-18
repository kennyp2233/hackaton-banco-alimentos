// src/modules/admin/components/UserSelector.tsx
'use client';
import { FC, useState, useEffect } from 'react';
import { UserData } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface UserSelectorProps {
    users: UserData[];
    onSelectUser: (user: UserData) => void;
    selectedUserId?: string;
}

const UserSelector: FC<UserSelectorProps> = ({ users, onSelectUser, selectedUserId }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [filteredUsers, setFilteredUsers] = useState<UserData[]>(users);

    // Usuario seleccionado actual
    const selectedUser = users.find(user => user.id === selectedUserId);

    // Filtrar usuarios cuando cambie el término de búsqueda
    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredUsers(users);
        } else {
            const lowerSearchTerm = searchTerm.toLowerCase();
            const filtered = users.filter(user =>
                user.nombres.toLowerCase().includes(lowerSearchTerm) ||
                user.apellidos.toLowerCase().includes(lowerSearchTerm) ||
                user.cedula.includes(lowerSearchTerm) ||
                user.correo.toLowerCase().includes(lowerSearchTerm)
            );
            setFilteredUsers(filtered);
        }
    }, [searchTerm, users]);

    // Manejar la selección de un usuario
    const handleSelectUser = (user: UserData) => {
        onSelectUser(user);
        setIsDropdownOpen(false);
        setSearchTerm('');
    };

    return (
        <motion.div
            className="relative mb-6"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div className="flex items-center bg-white shadow-md rounded-xl overflow-hidden">
                <div className="bg-gray-100 p-3 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>

                <div
                    className="flex-grow px-4 py-3 cursor-pointer"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                    {selectedUser ? (
                        <div>
                            <p className="font-medium text-gray-800">{selectedUser.nombres} {selectedUser.apellidos}</p>
                            <p className="text-sm text-gray-500">CI: {selectedUser.cedula} | {selectedUser.correo}</p>
                        </div>
                    ) : (
                        <p className="text-gray-500">Seleccione un usuario para ver detalles</p>
                    )}
                </div>

                <button
                    className="mr-2 p-2 text-gray-400 hover:text-gray-600 focus:outline-none"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transform transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
            </div>

            <AnimatePresence>
                {isDropdownOpen && (
                    <motion.div
                        className="absolute left-0 right-0 mt-2 bg-white rounded-xl shadow-lg z-10 border border-gray-200"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="p-3 border-b">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Buscar usuario..."
                                    className="w-full px-4 py-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>

                        <div className="max-h-72 overflow-y-auto">
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map(user => (
                                    <div
                                        key={user.id}
                                        className={`px-4 py-3 cursor-pointer hover:bg-gray-50 ${selectedUserId === user.id ? 'bg-primary/5 border-l-4 border-primary' : ''}`}
                                        onClick={() => handleSelectUser(user)}
                                    >
                                        <p className="font-medium text-gray-800">{user.nombres} {user.apellidos}</p>
                                        <p className="text-sm text-gray-500">CI: {user.cedula} | {user.correo}</p>
                                    </div>
                                ))
                            ) : (
                                <div className="px-4 py-3 text-gray-500 text-center">
                                    No se encontraron usuarios.
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default UserSelector;