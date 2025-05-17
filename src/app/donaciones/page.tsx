'use client';
import { useState } from 'react';
import PageContainer from '@/shared/layout/PageContainer';
import DonationForm from '@/modules/donations/componentes/DonationForm';
import { useDonationService } from '@/modules/donations/services/donationService';
import { motion } from 'framer-motion';

export default function DonationsPage() {
    const [isRecurring, setIsRecurring] = useState(true);
    const donationService = useDonationService();
    const benefits = donationService.getDonationBenefits(isRecurring);

    return (
        <div className="py-16 md:py-24 bg-gray-50">
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
                    </motion.div>

                    {/* Formulario de donación */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        <DonationForm isRecurring={isRecurring} onToggleType={setIsRecurring} showToggle={false} />
                    </motion.div>
                </div>

                {/* Nota legal simple */}
                <p className="max-w-5xl mx-auto mt-12 text-xs text-gray-500 text-center px-4">
                    Al donar aceptas nuestros{' '}
                    <a href="#" className="underline">
                        términos y condiciones
                    </a>{' '}
                    y{' '}
                    <a href="#" className="underline">
                        política de privacidad
                    </a>.
                    {isRecurring && ' Autoriza pagos mensuales automáticos hasta cancelación.'}
                </p>
            </PageContainer>
        </div>
    );
}
