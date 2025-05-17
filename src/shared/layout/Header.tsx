import { FC } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

const Header: FC = () => {
    return (
        <header className="bg-white shadow-sm sticky top-0 z-50">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between py-4">
                    {/* Logo */}
                    <Link href="/" className="flex items-center">
                        <div className="relative h-10 w-10 mr-2">
                            <Image
                                src="/logo.svg"
                                alt="Banco de Alimentos Quito"
                                fill
                                className="object-contain"
                            />
                        </div>
                        <span className="font-bold text-lg">Banco de Alimentos Quito</span>
                    </Link>

                    {/* Navigation - Desktop */}
                    <nav className="hidden md:flex items-center space-x-8">
                        <Link href="/" className="text-gray-700 hover:text-primary font-medium transition-colors">
                            Inicio
                        </Link>
                        <Link href="/donaciones" className="text-gray-700 hover:text-primary font-medium transition-colors">
                            Donar
                        </Link>
                        <Link href="/emergencias" className="text-gray-700 hover:text-primary font-medium transition-colors">
                            Emergencias
                        </Link>
                        <Link
                            href="/donaciones"
                            className="bg-primary hover:bg-primary/90 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                        >
                            Contribuir ahora
                        </Link>
                    </nav>

                    {/* Mobile Menu Button */}
                    <button className="md:hidden text-gray-700 focus:outline-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Navigation - Hidden by default */}
            <div className="hidden md:hidden">
                <div className="container mx-auto px-4 py-4">
                    <nav className="flex flex-col space-y-4">
                        <Link href="/" className="text-gray-700 hover:text-primary font-medium transition-colors">
                            Inicio
                        </Link>
                        <Link href="/donaciones" className="text-gray-700 hover:text-primary font-medium transition-colors">
                            Donar
                        </Link>
                        <Link href="/emergencias" className="text-gray-700 hover:text-primary font-medium transition-colors">
                            Emergencias
                        </Link>
                        <Link
                            href="/donaciones"
                            className="bg-primary hover:bg-primary/90 text-white font-bold py-2 px-4 rounded-lg text-center transition-colors"
                        >
                            Contribuir ahora
                        </Link>
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Header;