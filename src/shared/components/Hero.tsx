import { FC, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import ParallaxBackground from '@/shared/components/ParallaxBackground';
import { IMAGES } from '@/shared/config/constants';
import { EmojiFoodParticles, ConfettiExplosion } from '@/shared/components/EmojiFoodParticles';

// Definimos las imágenes para el efecto parallax
const parallaxImages = [
    {
        src: IMAGES.parallax.tomatoe,
        alt: "Tomate",
        position: 'left',
        speed: 30
    },
    {
        src: IMAGES.parallax.leaf,
        alt: "Hoja",
        position: 'right',
        speed: 25
    },
    {
        src: IMAGES.parallax.bread,
        alt: "Pan",
        position: 'left',
        speed: 20
    },
    {
        src: IMAGES.parallax.platain,
        alt: "Platano",
        position: 'right',
        speed: 35
    },
];

const Hero: FC = () => {
    const router = useRouter();
    const [activeAmount, setActiveAmount] = useState<number | null>(null);
    const [customAmount, setCustomAmount] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [showParticles, setShowParticles] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [showCustomField, setShowCustomField] = useState(false);
    const controls = useAnimation();
    const containerRef = useRef<HTMLDivElement>(null);
    const [particleOrigin, setParticleOrigin] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

    // Opciones de donación rápida
    const quickDonationOptions = [10, 25, 50, 100];

    // Efecto de animación al cargar
    useEffect(() => {
        controls.start({
            scale: [0.97, 1],
            opacity: [0, 1],
            transition: { duration: 0.8, ease: "easeOut" }
        });

        // Simular apertura automática del CTA después de 1.5 segundos
        const timer = setTimeout(() => {
            setIsOpen(true);
        }, 1500);

        return () => clearTimeout(timer);
    }, [controls]);

    // Evento primero, luego amount
    const handleAmountSelect = (
        e: React.MouseEvent<HTMLButtonElement>,
        amount: number
    ) => {
        setActiveAmount(amount);
        setCustomAmount('');
        setShowCustomField(false);
        setShowParticles(true);

        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const targetRect = (e.target as HTMLElement).getBoundingClientRect();
        setParticleOrigin({
            x: targetRect.left - rect.left + targetRect.width / 2,
            y: targetRect.top - rect.top + targetRect.height / 0.8
        });

        setTimeout(() => setShowParticles(false), 2000);
    };

    // Mostrar campo personalizado
    const handleShowCustomField = () => {
        setActiveAmount(null);
        setShowCustomField(true);
        setCustomAmount('');

        // Focus en el input después de un pequeño retraso para permitir animaciones
        setTimeout(() => {
            const customInput = document.getElementById('custom-amount-input');
            if (customInput) customInput.focus();
        }, 100);
    };

    // Función para manejar la entrada de cantidad personalizada
    const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // Solo permitir números y punto decimal
        if (/^\d*\.?\d*$/.test(value) || value === '') {
            setCustomAmount(value);

            if (parseFloat(value) > 0 && containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                const inputRect = (e.target as HTMLElement).getBoundingClientRect();
                setParticleOrigin({
                    x: inputRect.left - rect.left + inputRect.width / 2,
                    y: inputRect.top - rect.top + inputRect.height / 2
                });
                setShowParticles(true);
                setTimeout(() => setShowParticles(false), 2000);
            }
        }
    };

    // Función para redireccionar a la página de donaciones con el monto preseleccionado
    const handleContinueDonation = () => {
        // Mostrar confeti al continuar
        setShowConfetti(true);

        // Obtener el monto final (seleccionado o personalizado)
        const finalAmount = activeAmount || (customAmount ? parseFloat(customAmount) : 0);

        // Solo redireccionar si hay un monto válido
        if (finalAmount > 0) {
            // Redireccionar después de un breve retraso para ver el confeti
            setTimeout(() => {
                router.push(`/donaciones?amount=${finalAmount}&type=recurring`);
            }, 800);
        }
    };

    // Obtener el monto activo para las partículas
    const particleAmount = activeAmount || (customAmount ? parseFloat(customAmount) : 0);

    return (
        <div className="relative overflow-hidden min-h-[90vh] flex items-center">
            {/* Background con efecto parallax */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 overflow-hidden bg-gradient-to-r from-white/95 to-white/80">
                    <ParallaxBackground images={parallaxImages as any} />
                </div>
            </div>

            {/* Contenido principal */}
            <div className="relative text-gray-800 z-10 container mx-auto px-4 py-20 md:py-32 flex flex-col items-center">
                <motion.div
                    className="w-full max-w-4xl mx-auto text-center"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <span className="bg-primary text-white text-sm font-bold px-4 py-2 rounded-full">
                        JUNTOS CONTRA EL HAMBRE
                    </span>

                    <motion.h1
                        className="text-4xl md:text-7xl font-bold mb-6 text-text-dark leading-tight"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        Cada donación es
                        <br />
                        <span className="text-primary">esperanza</span> compartida
                    </motion.h1>

                    <motion.p
                        className="text-lg md:text-xl mb-10 max-w-3xl mx-auto text-gray-700"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        Tu contribución ayuda a combatir la inseguridad alimentaria y reducir el desperdicio.
                        Cada donación permite que más familias tengan acceso a alimentos nutritivos.
                    </motion.p>

                    {/* CTA Innovador - Panel desplegable de donación rápida */}
                    <div className="relative mb-12">
                        <motion.div
                            className="flex flex-col sm:flex-row gap-4 justify-center"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                        >
                            <motion.button
                                onClick={() => setIsOpen(!isOpen)}
                                className={`bg-primary shadow-elevated ${isOpen ? 'bg-primary-dark' : 'hover:bg-primary-dark'} text-white font-bold py-4 px-10 rounded-full text-lg transition-all flex items-center`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.98 }}
                                animate={isOpen ? { y: 0 } : { y: 0 }}
                            >
                                {isOpen ? 'Cerrar' :
                                    <><span className="mr-2">🍎</span> Donar ahora</>}
                            </motion.button>

                            <Link href="/emergencias">
                                <motion.div
                                    className="bg-white shadow-md hover:bg-gray-100 text-primary border-2 border-primary font-bold py-4 px-10 rounded-full text-lg flex items-center justify-center transition-all"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                    Emergencias
                                </motion.div>
                            </Link>
                        </motion.div>

                        {/* Panel desplegable de donación rápida */}
                        <AnimatePresence>
                            {isOpen && (
                                <motion.div
                                    className="mt-6 p-6 bg-white rounded-2xl shadow-2xl max-w-2xl mx-auto border border-gray-100 relative"
                                    initial={{ opacity: 0, y: -20, height: 0 }}
                                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                                    exit={{ opacity: 0, y: -20, height: 0 }}
                                    transition={{ duration: 0.4, ease: "easeInOut" }}
                                >
                                    <motion.img
                                        src="/images/donacion/don1.png"
                                        alt="Haz tu donación"
                                        className="absolute rotate-12 top-[-100px] left-[-90px] w-40 h-auto pointer-events-none select-none"
                                        animate={{
                                            y: [0, -10, 0, 10, 0],
                                            rotate: [12, 14, 12],
                                        }}
                                        transition={{
                                            duration: 6,
                                            repeat: Infinity,
                                            ease: "easeInOut",
                                        }}
                                    />

                                    <motion.img
                                        src="/images/donacion/don2.png"
                                        alt="Aporta ya"
                                        className="absolute -rotate-12 top-[-120px] right-[-40px] w-40 h-auto pointer-events-none select-none"
                                        animate={{
                                            y: [0, 10, 0, -10, 0],
                                            rotate: [-12, -14, -12],
                                        }}
                                        transition={{
                                            duration: 6,
                                            repeat: Infinity,
                                            ease: "easeInOut",
                                        }}
                                    />


                                    {/* Componente de partículas de alimentos */}
                                    <EmojiFoodParticles
                                        amount={particleAmount}
                                        isActive={showParticles}
                                        type="food"
                                        origin={particleOrigin}
                                    />

                                    {/* Componente de confeti para celebración */}
                                    <ConfettiExplosion isActive={showConfetti} />

                                    <h3 className="text-xl font-bold mb-6 text-center">Donación rápida</h3>

                                    <div ref={containerRef} className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                                        {quickDonationOptions.map((amount) => (
                                            <motion.button
                                                key={amount}
                                                onClick={(e) => handleAmountSelect(e, amount)}
                                                className={`
                                                    py-3 px-4 rounded-lg border-2 font-bold text-lg transition-all relative overflow-hidden
                                                    ${activeAmount === amount
                                                        ? 'bg-primary text-white border-primary shadow-md'
                                                        : 'bg-white text-gray-700 border-gray-300 hover:border-primary hover:text-primary'}
                                                `}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                ${amount}
                                            </motion.button>
                                        ))}
                                    </div>

                                    {/* Botón "Otro monto" */}
                                    {!showCustomField && (
                                        <motion.button
                                            onClick={handleShowCustomField}
                                            className="w-full py-3 mb-3 px-4 rounded-lg border-2 border-gray-300 text-gray-700 hover:border-primary hover:text-primary font-medium transition-all"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            Otro monto
                                        </motion.button>
                                    )}

                                    {/* Campo de monto personalizado (solo visible cuando se solicita) */}
                                    <AnimatePresence>
                                        {showCustomField && (
                                            <motion.div
                                                className="mb-3"
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <div className="relative flex-grow">
                                                    <div className="flex items-center">
                                                        <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500 text-xl">$</span>
                                                        <input
                                                            id="custom-amount-input"
                                                            type="text"
                                                            placeholder="Ingrese monto personalizado"
                                                            value={customAmount}
                                                            onChange={handleCustomAmountChange}
                                                            className="w-full px-4 py-3 pl-10 border-2 border-gray-300 focus:border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all text-center"
                                                        />
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    <motion.button
                                        className={`w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-lg transition-all shadow-md flex items-center justify-center ${!(activeAmount || (customAmount && parseFloat(customAmount) > 0))
                                            ? 'opacity-50 cursor-not-allowed'
                                            : ''
                                            }`}
                                        whileHover={
                                            activeAmount || (customAmount && parseFloat(customAmount) > 0)
                                                ? { scale: 1.03 }
                                                : {}
                                        }
                                        whileTap={
                                            activeAmount || (customAmount && parseFloat(customAmount) > 0)
                                                ? { scale: 0.98 }
                                                : {}
                                        }
                                        onClick={handleContinueDonation}
                                        disabled={!(activeAmount || (customAmount && parseFloat(customAmount) > 0))}
                                    >
                                        <span className="mr-2">🥕</span> Continuar
                                    </motion.button>

                                    {(activeAmount || (customAmount && parseFloat(customAmount) > 0)) && (
                                        <motion.div
                                            className="mt-4 text-center text-sm text-gray-700"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                        >
                                            Con ${activeAmount || parseFloat(customAmount)} puedes proporcionar aproximadamente {(activeAmount || parseFloat(customAmount)) * 2} comidas a personas que lo necesitan.
                                        </motion.div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>

                {/* Estadísticas de impacto */}
                <motion.div
                    className="w-full max-w-5xl mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                >
                    <motion.div
                        className="bg-white p-6 rounded-xl shadow-elevated card-hover-effect"
                        whileHover={{ y: -5 }}
                    >
                        <div className="flex items-center justify-center mb-4">
                            <span className="text-5xl font-bold text-primary">+50k</span>
                        </div>
                        <p className="text-gray-700 text-center">Personas beneficiadas anualmente</p>
                    </motion.div>

                    <motion.div
                        className="bg-white p-6 rounded-xl shadow-elevated card-hover-effect"
                        whileHover={{ y: -5 }}
                    >
                        <div className="flex items-center justify-center mb-4">
                            <span className="text-5xl font-bold text-primary">1,200</span>
                        </div>
                        <p className="text-gray-700 text-center">Toneladas de alimentos rescatados</p>
                    </motion.div>

                    <motion.div
                        className="bg-white p-6 rounded-xl shadow-elevated card-hover-effect"
                        whileHover={{ y: -5 }}
                    >
                        <div className="flex items-center justify-center mb-4">
                            <span className="text-5xl font-bold text-primary">42</span>
                        </div>
                        <p className="text-gray-700 text-center">Instituciones beneficiarias</p>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};

export default Hero;