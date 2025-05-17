'use client';
import { useState } from 'react';
import PageContainer from '@/shared/layout/PageContainer';
import DonationForm from '@/modules/donations/componentes/DonationForm';

export default function DonationsPage() {
    const [isRecurring, setIsRecurring] = useState(true);

    return (
        <div className="py-16 md:py-24 bg-gray-50">
            <PageContainer>
                <div className="max-w-5xl mx-auto text-center mb-10 px-4">
                    <h1 className="text-4xl font-bold mb-4">Tu donación transforma vidas</h1>
                    <p className="text-lg text-gray-700 max-w-3xl mx-auto">
                        Apoya al Banco de Alimentos de Quito para combatir el hambre y reducir desperdicios.
                        Cada aporte cuenta.
                    </p>
                </div>

                {/* Toggle Donación Mensual / Única */}
                <div className="max-w-5xl mx-auto mb-10 flex justify-center gap-6 px-4">
                    <button
                        onClick={() => setIsRecurring(true)}
                        className={`px-6 py-2 rounded-md font-medium transition ${isRecurring ? 'bg-primary text-white' : 'bg-gray-200'}`}
                    >
                        Donación Mensual
                    </button>
                    <button
                        onClick={() => setIsRecurring(false)}
                        className={`px-6 py-2 rounded-md font-medium transition ${!isRecurring ? 'bg-primary text-white' : 'bg-gray-200'}`}
                    >
                        Donación Única
                    </button>
                </div>

                {/* Layout horizontal: beneficios a la izquierda, formulario a la derecha */}
                <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Beneficios */}
                    <div className="bg-white p-8 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-6 text-center">
                            {isRecurring ? "Beneficios de ser donante regular" : "Beneficios de tu donación"}
                        </h2>
                        <ul className="list-disc list-inside text-gray-700 space-y-4 text-lg">
                            {isRecurring ? (
                                <>
                                    <li>Apoyas sostenidamente a familias en necesidad.</li>
                                    <li>Recibes informes sobre el impacto de tu ayuda.</li>
                                    <li>Certificado anual para beneficios tributarios.</li>
                                </>
                            ) : (
                                <>
                                    <li>Con tu donación alimentas a varias familias por un día.</li>
                                    <li>Recibes comprobante para beneficios tributarios.</li>
                                    <li>Impacto inmediato en la comunidad.</li>
                                </>
                            )}
                        </ul>
                    </div>

                    <DonationForm isRecurring={isRecurring} />
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
