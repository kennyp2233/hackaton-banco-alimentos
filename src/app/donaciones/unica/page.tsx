import { Metadata } from 'next';
import DonationForm from '@/modules/donations/componentes/DonationForm';
import PageContainer from '@/shared/layout/PageContainer';
import { motion } from 'framer-motion';

export const metadata: Metadata = {
    title: 'Donación Única | Banco de Alimentos Quito',
    description: 'Realiza una donación única para apoyar al Banco de Alimentos de Quito.',
};

export default function SingleDonationPage() {
    return (
        <div className="py-16 md:py-24 bg-gray-50">
            <PageContainer>
                <motion.div
                    className="max-w-2xl mx-auto text-center mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="text-4xl font-bold mb-6">Realiza una Donación</h1>
                    <p className="text-lg text-gray-700">
                        Tu contribución única ayuda a combatir el hambre y reducir el desperdicio de alimentos.
                        Cada aporte hace la diferencia para las familias en situación de vulnerabilidad.
                    </p>
                </motion.div>

                <div className="max-w-xl mx-auto">
                    <DonationForm isRecurring={false} />
                </div>

                <motion.div
                    className="max-w-3xl mx-auto mt-16 bg-white p-8 rounded-xl shadow-md"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                >
                    <h2 className="text-2xl font-bold mb-6 text-center">Preguntas Frecuentes</h2>

                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-bold mb-2">¿Cómo se utilizará mi donación?</h3>
                            <p className="text-gray-700">
                                Tu donación se destina a financiar la logística de rescate y distribución de alimentos,
                                así como a la adquisición de alimentos complementarios para asegurar una nutrición balanceada
                                para las familias beneficiarias.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold mb-2">¿Recibiré un comprobante de mi donación?</h3>
                            <p className="text-gray-700">
                                Sí, enviaremos un comprobante de donación a tu correo electrónico inmediatamente después
                                de que se procese tu contribución. Este documento puede ser utilizado para fines tributarios.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold mb-2">¿Puedo hacer una donación en nombre de otra persona?</h3>
                            <p className="text-gray-700">
                                ¡Claro! Puedes indicar en los comentarios que la donación es en nombre de otra persona,
                                y podemos enviar un certificado especial a la dirección de correo electrónico que nos proporciones.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold mb-2">¿Mi información personal está segura?</h3>
                            <p className="text-gray-700">
                                Absolutamente. Utilizamos sistemas de encriptación avanzados para proteger tu información
                                personal y financiera. No compartimos tus datos con terceros sin tu consentimiento.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </PageContainer>
        </div>
    );
}