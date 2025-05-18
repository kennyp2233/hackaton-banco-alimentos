'use client';
import { FC, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import PointsDisplay from '@/shared/components/PointsDisplay';

const Header: FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    // Detectar scroll para cambiar el aspecto del header
    useEffect(() => {
        const handleScroll = () => {
            const offset = window.scrollY;
            if (offset > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // Detectar si estamos en la ruta /admin para mostrar el menú de administración
    useEffect(() => {
        const path = window.location.pathname;
        setIsAdmin(path.startsWith('/admin'));
    }, []);

    // Cerrar el menú al cambiar el tamaño de la ventana
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setIsMenuOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <header className={`${scrolled ? 'py-2 shadow-md' : 'py-4 shadow-sm'} bg-white sticky top-0 z-50 transition-all duration-300`}>
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" passHref>
                        <motion.div
                            className="flex items-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            whileHover={{ scale: 1.02 }}
                        >
                            <div className="relative h-10 w-10 mr-2">
                                <Image
                                    src="/logo.svg"
                                    alt="Banco de Alimentos Quito"
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            </div>
                            <span className="font-bold text-lg text-gray-800">Banco de Alimentos Quito</span>
                        </motion.div>
                    </Link>

                    {/* Navigation - Desktop */}
                    <nav className="hidden md:flex items-center space-x-6">
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                        >
                            <Link href="/" className="text-gray-700 hover:text-primary font-medium transition-colors relative group">
                                Inicio
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                            </Link>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <Link href="/donaciones" className="text-gray-700 hover:text-primary font-medium transition-colors relative group">
                                Donar
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                            </Link>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                        >
                            <Link href="/emergencias" className="text-gray-700 hover:text-primary font-medium transition-colors relative group">
                                Emergencias
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                            </Link>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                        >
                            <Link href="/rewards" className="text-gray-700 hover:text-primary font-medium transition-colors relative group">
                                Recompensas
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                            </Link>
                        </motion.div>

                        {/* Admin menu item - Only shown if in /admin path */}
                        {isAdmin && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.4 }}
                            >
                                <Link href="/admin/rewards" className="text-gray-700 hover:text-primary font-medium transition-colors relative group">
                                    Admin Recompensas
                                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                                </Link>
                            </motion.div>
                        )}

                        {/* Points display */}
                        <PointsDisplay className="ml-2" />

                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Link
                                href="/donaciones"
                                className="flex bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded-lg transition-colors shadow-md"
                            >
                                <span className="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    Suscribirse ahora
                                </span>
                            </Link>
                        </motion.div>
                    </nav>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center space-x-4">
                        <PointsDisplay />
                        <motion.button
                            className="text-gray-700 focus:outline-none"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            whileTap={{ scale: 0.9 }}
                            aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d={isMenuOpen
                                        ? "M6 18L18 6M6 6l12 12" // X icon
                                        : "M4 6h16M4 12h16M4 18h16" // Hamburger icon
                                    }
                                />
                            </svg>
                        </motion.button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        className="md:hidden bg-white border-t border-gray-100 shadow-lg"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="container mx-auto px-4 py-4">
                            <nav className="flex flex-col space-y-4">
                                <Link
                                    href="/"
                                    className="text-gray-700 hover:text-primary font-medium transition-colors py-2 border-b border-gray-100"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Inicio
                                </Link>
                              
                                <Link
                                    href="/emergencias"
                                    className="text-gray-700 hover:text-primary font-medium transition-colors py-2 border-b border-gray-100"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Emergencias
                                </Link>
                                <Link
                                    href="/rewards"
                                    className="text-gray-700 hover:text-primary font-medium transition-colors py-2 border-b border-gray-100"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Recompensas
                                </Link>
                                {isAdmin && (
                                    <Link
                                        href="/admin/rewards"
                                        className="text-gray-700 hover:text-primary font-medium transition-colors py-2 border-b border-gray-100"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Admin Recompensas
                                    </Link>
                                )}
                                <Link
                                    href="/donaciones"
                                    className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-4 rounded-lg text-center transition-colors mt-2"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <span className="flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                        Contribuir ahora
                                    </span>
                                </Link>
                            </nav>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Header;