'use client';
import { FC, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import ParallaxBackground from '@/shared/components/ParallaxBackground';
import { IMAGES } from '@/shared/config/constants';
import { EmojiFoodParticles, ConfettiExplosion } from '@/shared/components/EmojiFoodParticles';
import GoalProgress from './GoalProgress';

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
    const [activeAmount, setActiveAmount] = useState<number | null>(null);
    const [customAmount, setCustomAmount] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [showParticles, setShowParticles] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [showCustomField, setShowCustomField] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
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

    // Configuración del callback de PagoPlux
    useEffect(() => {
        if (typeof window !== 'undefined') {
            (window as any).Data.$onAuthorize = (response: any) => {
                if (response.status === 'succeeded') {
                    console.log('Transacción exitosa:', response);
                    setIsProcessing(false);
                    setShowConfetti(true);
                    setPaymentSuccess(true);

                    // Reset después de 5 segundos
                    setTimeout(() => {
                        setPaymentSuccess(false);
                        setShowConfetti(false);
                        setActiveAmount(null);
                        setCustomAmount('');
                        setIsOpen(true);
                    }, 5000);
                } else {
                    console.error('Error en la transacción:', response);
                    setIsProcessing(false);
                }
            };
        }
    }, []);

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

    // Funciones para manejar la pasarela de pagos directamente
    const waitForData = (callback: () => void, retries = 15, interval = 300) => {
        if (typeof window !== 'undefined' && (window as any).Data) {
            callback();
        } else if (retries > 0) {
            setTimeout(() => waitForData(callback, retries - 1, interval), interval);
        } else {
            console.error('[PagoPlux] Data no se cargó');
        }
    };

    const iniciarDatos = (data: any) => {
        waitForData(() => {
            (window as any).Data.init(data);
            setTimeout(() => {
                const payBtn = document.getElementById('pay');
                if (payBtn) payBtn.click();
            }, 300);
        });
    };

    // Función para procesar la donación directamente
    const processDonation = () => {
        const finalAmount = activeAmount || (customAmount ? parseFloat(customAmount) : 0);

        if (finalAmount <= 0) return;

        setIsProcessing(true);

        // Configuración para PagoPlux
        const ppxData = {
            PayboxRemail: "abautista@pagoplux.com", // Email de la cuenta PagoPlux del Establecimiento
            PayboxSendmail: "donante@ejemplo.com", // Email genérico para donante anónimo
            PayboxRename: "Banco de Alimentos Quito", // Nombre del establecimiento en PagoPlux
            PayboxSendname: "Donante Anónimo", // Nombre genérico para donación rápida
            PayboxBase0: "0.00", // Monto sin impuestos
            PayboxBase12: finalAmount.toFixed(2), // Monto con impuestos incluidos
            PayboxDescription: "Donación rápida - Banco de Alimentos Quito", // Descripción del pago
            PayboxProduction: false, // Modo prueba
            PayboxEnvironment: "sandbox", // Ambiente de ejecución
            PayboxLanguage: "es", // Lenguaje del Paybox
            PayboxPagoPlux: true, // Tipo de iframe
            PayboxDirection: "No especificada", // Dirección del tarjetahabiente
            PayBoxClientPhone: "No especificado", // Teléfono del tarjetahabiente
            PayBoxClientIdentification: "9999999999", // Identificación genérica para donante anónimo
            PayboxRecurrent: false, // No es pago recurrente para donación rápida
        };

        // Iniciar la pasarela de pago
        iniciarDatos(ppxData);

        // Timer para detectar si la pasarela no se abre correctamente
        const timeoutMs = 10000; // 10 segundos
        let observer: MutationObserver | null = null;
        let timeout: NodeJS.Timeout;

        const stopLoading = () => {
            setIsProcessing(false);
            if (observer) observer.disconnect();
            clearTimeout(timeout);
        };

        // Verificar si ya existe #base antes de observar
        if (document.getElementById('base')) {
            stopLoading();
            return;
        }

        // Observar el DOM por cambios
        observer = new MutationObserver(() => {
            if (document.getElementById('base')) {
                stopLoading();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });

        // Fallback por timeout
        timeout = setTimeout(() => {
            stopLoading();
            console.warn('[Donación] Se alcanzó el tiempo límite esperando a #base');
        }, timeoutMs);
    };

    return (
        <div className="relative overflow-hidden min-h-[90vh] flex items-center">
            {/* Background con efecto parallax */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 overflow-hidden bg-gradient-to-r from-white/95 to-white/80">
                    <ParallaxBackground images={parallaxImages as any} />
                </div>
            </div>

            {/* Contenido principal */}
            <div className="relative text-gray-800 z-10 container mx-auto px-4 py-5 md:py-10 flex flex-col items-center">
                <motion.div
                    className="w-full max-w-4xl mx-auto text-center backdrop-blur-3xl"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <GoalProgress current={152000} goal={200000} unit="$" />

                    <motion.h1
                        className="text-4xl md:text-7xl font-bold my-6 text-text-dark leading-tight"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        Cada donación es
                        <br />
                        <span className="text-primary">esperanza</span> compartida
                    </motion.h1>



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
                            {isOpen && !paymentSuccess && (
                                <motion.div
                                    ref={containerRef}
                                    className="mt-6 p-6 bg-white rounded-2xl shadow-2xl max-w-2xl mx-auto border border-gray-100 relative"
                                    initial={{ opacity: 0, y: -20, height: 0 }}
                                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                                    exit={{ opacity: 0, y: -20, height: 0 }}
                                    transition={{ duration: 0.4, ease: "easeInOut" }}
                                >
                                    <motion.img
                                        src="/images/donacion/don1.png"
                                        alt="Haz tu donación"
                                        className="absolute rotate-12 top-[-100px] left-[-90px] w-52 max-sm:hidden h-auto pointer-events-none select-none"
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
                                        className="absolute -rotate-12 top-[-120px] right-[-40px] w-40 max-sm:w-12 h-auto pointer-events-none select-none"
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
                                        amount={activeAmount || (customAmount ? parseFloat(customAmount) : 0)}
                                        isActive={showParticles}
                                        type="food"
                                        origin={particleOrigin}
                                    />

                                    {/* Componente de confeti para celebración */}
                                    <ConfettiExplosion isActive={showConfetti} />

                                    <h3 className="text-xl font-bold mb-6 text-center">Donación rápida</h3>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
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
                                        type="button"
                                        className={`w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-lg transition-all shadow-md flex items-center justify-center ${!(activeAmount || (customAmount && parseFloat(customAmount) > 0)) || isProcessing
                                            ? 'opacity-50 cursor-not-allowed'
                                            : ''
                                            }`}
                                        whileHover={
                                            activeAmount || (customAmount && parseFloat(customAmount) > 0) && !isProcessing
                                                ? { scale: 1.03 }
                                                : {}
                                        }
                                        whileTap={
                                            activeAmount || (customAmount && parseFloat(customAmount) > 0) && !isProcessing
                                                ? { scale: 0.98 }
                                                : {}
                                        }
                                        onClick={processDonation}
                                        disabled={!(activeAmount || (customAmount && parseFloat(customAmount) > 0)) || isProcessing}
                                    >
                                        {isProcessing ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Procesando...
                                            </>
                                        ) : (
                                            <>
                                                <span className="mr-2">🥕</span> Donar ahora
                                            </>
                                        )}
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

                                    <div className="flex gap-3 mt-4 justify-center opacity-70">
                                        {['visa', 'mastercard', 'americanexpress', 'dinersclub', 'discover'].map(
                                            (brand) => (
                                                <img
                                                    key={brand}
                                                    src={`https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/${brand}.svg`}
                                                    alt={brand}
                                                    className="h-5 w-auto"
                                                />
                                            )
                                        )}
                                    </div>
                                </motion.div>
                            )}

                            {/* Mensaje de éxito después del pago */}
                            {paymentSuccess && (
                                <motion.div
                                    className="mt-6 p-6 bg-white rounded-2xl shadow-2xl max-w-2xl mx-auto border border-gray-100 relative text-center"
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.4 }}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <h3 className="text-2xl font-bold mb-2">¡Gracias por tu donación!</h3>
                                    <p className="text-gray-600 mb-4">
                                        Tu aporte ha sido procesado correctamente. Juntos estamos haciendo la diferencia.
                                    </p>
                                    <motion.button
                                        onClick={() => {
                                            setPaymentSuccess(false);
                                            setShowConfetti(false);
                                            setActiveAmount(null);
                                            setCustomAmount('');
                                            setIsOpen(true);
                                        }}
                                        className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-6 rounded-lg transition-all"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Hacer otra donación
                                    </motion.button>
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

            <div id="modalPaybox" />
            <button id="pay" type="submit" style={{ display: 'none' }} />
        </div>
    );
};

export default Hero;