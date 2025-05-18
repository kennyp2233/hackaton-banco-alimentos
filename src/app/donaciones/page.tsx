'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import PageContainer from '@/shared/layout/PageContainer';
import DonationForm from '@/modules/donations/componentes/DonationForm';
import { useDonationService } from '@/modules/donations/services/donationService';
import { motion, AnimatePresence } from 'framer-motion';
import { ConfetiExplosion } from '@/shared/components/EmojiFoodParticles';

export default function DonationsPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isRecurring, setIsRecurring] = useState(true);
    const [initialAmount, setInitialAmount] = useState(0);
    const [showConfetti, setShowConfetti] = useState(false);
    const donationService = useDonationService();
    const benefits = donationService.getDonationBenefits(isRecurring);

    // Procesar los parámetros de la URL cuando la página se carga
    useEffect(() => {
        const amount = searchParams.get('amount');
        const type = searchParams.get('type');
        // Si hay un monto en la URL, establecerlo como monto inicial
        if (amount && !isNaN(Number(amount))) {
            setInitialAmount(Number(amount));

            // Mostrar confeti cuando se carga la página con un monto preseleccionado
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 3000);
        }

        // Si hay un tipo en la URL, establecer el tipo de donación
        if (type === 'recurring') {
            setIsRecurring(true);
        } else if (type === 'single') {
            setIsRecurring(false);
        }
    }, [searchParams]);

    return (
        <div className="py-16 md:py-24 bg-gray-50 relative">
            {/* Explosión de confeti cuando se llega desde el Hero con un monto */}
            <div className="fixed inset-0 pointer-events-none z-50">
                <AnimatePresence>
                    {showConfetti && <ConfetiExplosion isActive={showConfetti} />}
                </AnimatePresence>
            </div>

            <PageContainer>
                <div className="max-w-5xl mx-auto text-center mb-10 px-4">
                    <motion.h1
                        className="text-4xl font-bold mb-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        Tu donación transforma vidas
                    </motion.h1>
                    <motion.p
                        className="text-lg text-gray-700 max-w-3xl mx-auto"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        Apoya al Banco de Alimentos de Quito para combatir el hambre y reducir desperdicios.
                        Cada aporte cuenta.
                    </motion.p>
                </div>

                {/* Switch con etiquetas a los lados */}
                <motion.div
                    className="max-w-5xl mx-auto mb-10 flex justify-center items-center gap-6 px-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                >
                    <span
                        className={`text-lg font-medium cursor-pointer select-none ${!isRecurring ? 'text-gray-900' : 'text-gray-400'
                            }`}
                        onClick={() => setIsRecurring(false)}
                    >
                        Donación Única
                    </span>

                    <label
                        htmlFor="donation-switch"
                        className="relative inline-block w-14 h-8 cursor-pointer"
                    >
                        <input
                            type="checkbox"
                            id="donation-switch"
                            className="sr-only"
                            checked={isRecurring}
                            onChange={() => setIsRecurring(!isRecurring)}
                        />
                        <span
                            className={`block bg-gray-300 rounded-full h-8 transition-colors ${isRecurring ? 'bg-green-500' : ''
                                }`}
                        />
                        <span
                            className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${isRecurring ? 'translate-x-6' : 'translate-x-0'
                                }`}
                        />
                    </label>

                    <span
                        className={`text-lg font-medium cursor-pointer select-none ${isRecurring ? 'text-gray-900' : 'text-gray-400'
                            }`}
                        onClick={() => setIsRecurring(true)}
                    >
                        Donación Mensual
                    </span>
                </motion.div>

                {/* Layout horizontal: beneficios a la izquierda, formulario a la derecha */}
                <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Beneficios */}
                    <motion.div
                        className="bg-white p-8 rounded-lg shadow-md"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        key={isRecurring ? 'recurring' : 'single'}
                    >
                        <h2 className="text-xl font-semibold mb-6 text-center">
                            {isRecurring ? 'Beneficios de ser donante regular' : 'Beneficios de tu donación'}
                        </h2>
                        <ul className="list-disc list-inside text-gray-700 space-y-4 text-lg">
                            {benefits.map((benefit, index) => (
                                <li key={index}>{benefit}</li>
                            ))}
                        </ul>

                        {/* Animación para ilustrar el impacto */}
                        <motion.div
                            className="mt-8 p-4 bg-blue-50 rounded-lg"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}
                        >
                            <div className="flex items-center space-x-2 mb-2">
                                <span className="text-xl">🍎</span>
                                <h3 className="font-bold text-primary">Tu impacto</h3>
                            </div>
                            <p className="text-gray-700">
                                Con una donación {isRecurring ? 'mensual' : 'única'} ayudas a combatir
                                el desperdicio de alimentos y contribuyes directamente a que familias
                                en situación vulnerable reciban alimentos de calidad.
                            </p>

                            {/* Indicador visual de impacto */}
                            <div className="mt-4">
                                <div className="flex justify-between text-sm text-gray-600 mb-1">
                                    <span>Impacto</span>
                                    <span>+Familias beneficiadas</span>
                                </div>
                                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-green-500 rounded-full"
                                        initial={{ width: 0 }}
                                        animate={{ width: '75%' }}
                                        transition={{ duration: 1.5, delay: 1 }}
                                    />
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Formulario de donación */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        <DonationForm
                            isRecurring={isRecurring}
                            onToggleType={setIsRecurring}
                            showToggle={false}
                            initialAmount={initialAmount}
                        />
                    </motion.div>
                </div>

                {/* Nota legal simple */}
                <p className="max-w-5xl mx-auto mt-12 text-xs text-gray-500 text-center px-4">
                    Al donar aceptas nuestros{' '}
                    <a href="#" className="underline hover:text-primary">
                        términos y condiciones
                    </a>{' '}
                    y{' '}
                    <a href="#" className="underline hover:text-primary">
                        política de privacidad
                    </a>.
                    {isRecurring && ' Autoriza pagos mensuales automáticos hasta cancelación.'}
                </p>

                {/* Testimonios de impacto */}
                <motion.div
                    className="max-w-5xl mx-auto mt-16 p-8 bg-white rounded-lg shadow-md"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className="text-2xl font-bold mb-6 text-center">El impacto de tu donación</h2>

                    <div className="grid md:grid-cols-3 gap-6">
                        {/* Testimonio 1 */}
                        <motion.div
                            className="bg-gray-50 p-4 rounded-lg"
                            whileHover={{ y: -5 }}
                        >
                            <div className="flex items-center mb-4">
                                <span className="text-2xl mr-2">👨‍👩‍👧</span>
                                <h3 className="font-bold">Familias</h3>
                            </div>
                            <p className="text-gray-700">
                                "Gracias a las donaciones, ahora tenemos acceso a alimentos saludables para toda nuestra familia cada semana."
                            </p>
                        </motion.div>

                        {/* Testimonio 2 */}
                        <motion.div
                            className="bg-gray-50 p-4 rounded-lg"
                            whileHover={{ y: -5 }}
                        >
                            <div className="flex items-center mb-4">
                                <span className="text-2xl mr-2">🏫</span>
                                <h3 className="font-bold">Comedores comunitarios</h3>
                            </div>
                            <p className="text-gray-700">
                                "Podemos ofrecer comidas nutritivas a decenas de niños cada día gracias al apoyo del Banco de Alimentos."
                            </p>
                        </motion.div>

                        {/* Testimonio 3 */}
                        <motion.div
                            className="bg-gray-50 p-4 rounded-lg"
                            whileHover={{ y: -5 }}
                        >
                            <div className="flex items-center mb-4">
                                <span className="text-2xl mr-2">🌱</span>
                                <h3 className="font-bold">Medio ambiente</h3>
                            </div>
                            <p className="text-gray-700">
                                "Cada kilo de alimento rescatado significa menos desperdicio y un impacto positivo para nuestro planeta."
                            </p>
                        </motion.div>
                    </div>
                </motion.div>
            </PageContainer>
        </div>
    );
}