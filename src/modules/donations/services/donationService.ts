// src/modules/donations/services/donationService.ts
import { useState } from 'react';
import { DONATION_IMPACT } from '@/shared/config/constants';

// Interfaces de datos
export interface DonationFormData {
    amount: number;
    name: string;
    email: string;
    paymentMethod: string;
    isRecurring: boolean;
    phoneNumber?: string;
    identification?: string;
    address?: string;
    comments?: string;
    transactionId?: string;
}

export interface DonationResponse {
    success: boolean;
    transactionId?: string;
    error?: string;
    redirectUrl?: string;
}

// Hook personalizado para el procesamiento de donaciones
export const useDonationService = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [successData, setSuccessData] = useState<{ transactionId: string } | null>(null);

    // Función para procesar donaciones
    const processDonation = async (donationData: DonationFormData): Promise<DonationResponse> => {
        setIsLoading(true);
        setError(null);

        try {
            // En producción, aquí realizaríamos una llamada a la API real
            // Simulamos un delay para el hackatrón
            await new Promise(resolve => setTimeout(resolve, 800));

            // Si ya tenemos un transactionId de PagoPlux, lo usamos directamente
            const transactionId = donationData.transactionId || `TX-${Math.floor(Math.random() * 1000000)}`;

            // Simulación de respuesta exitosa
            const response: DonationResponse = {
                success: true,
                transactionId
            };

            setSuccessData({ transactionId });

            // En una aplicación real, aquí guardaríamos la donación en la base de datos
            console.log('Procesando donación:', {
                ...donationData,
                transactionId
            });

            return response;
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'Error al procesar la donación';
            setError(errorMsg);
            return {
                success: false,
                error: errorMsg
            };
        } finally {
            setIsLoading(false);
        }
    };

    // Función para obtener información sobre el impacto de las donaciones
    const getDonationImpact = (amount: number): string => {
        if (!amount || amount === 0) {
            return "Selecciona un monto para ver el impacto de tu donación.";
        }

        if (amount < 10) {
            return "Tu donación ayuda a distribuir alimentos a familias en situación de vulnerabilidad.";
        } else if (amount < 50) {
            return `Con $${amount} podemos alimentar a ${Math.floor(amount * 0.5)} familias durante un día.`;
        } else if (amount < 100) {
            return `Tu donación de $${amount} permite rescatar aproximadamente ${Math.floor(amount * 2)} kg de alimentos.`;
        } else {
            return `Con $${amount} podemos proporcionar alimentos nutritivos a ${Math.floor(amount * 0.2)} familias durante una semana completa.`;
        }
    };

    // Funcionalidad específica para donaciones a emergencias
    const processEmergencyDonation = async (
        emergencyId: string,
        donationData: DonationFormData
    ): Promise<DonationResponse> => {
        setIsLoading(true);
        setError(null);

        try {
            // En producción, aquí realizaríamos una llamada a la API real
            // Simulamos un delay para el hackatrón
            await new Promise(resolve => setTimeout(resolve, 800));

            // Si ya tenemos un transactionId de PagoPlux, lo usamos directamente
            const transactionId = donationData.transactionId || `EMRG-${Math.floor(Math.random() * 1000000)}`;

            // Simulación de respuesta exitosa
            const response: DonationResponse = {
                success: true,
                transactionId
            };

            setSuccessData({ transactionId });

            // En una aplicación real, aquí guardaríamos la donación de emergencia en la base de datos
            console.log('Procesando donación para emergencia:', {
                ...donationData,
                emergencyId,
                transactionId
            });

            return response;
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'Error al procesar la donación para emergencia';
            setError(errorMsg);
            return {
                success: false,
                error: errorMsg
            };
        } finally {
            setIsLoading(false);
        }
    };

    // Datos centralizados para los beneficios de donación
    const DONATION_BENEFITS = {
        recurring: [
            'Apoyas sostenidamente a familias en necesidad.',
            'Recibes informes mensuales sobre el impacto de tu ayuda.',
            'Certificado anual para beneficios tributarios.',
            'Formas parte de la red de donantes permanentes.'
        ],
        single: [
            'Con tu donación alimentas a varias familias por un día.',
            'Recibes comprobante para beneficios tributarios.',
            'Impacto inmediato en la comunidad.',
            'Contribuyes al rescate de alimentos que serían desperdiciados.'
        ]
    };

    // Función para obtener los beneficios según el tipo de donación
    const getDonationBenefits = (isRecurring: boolean) => {
        return isRecurring ? DONATION_BENEFITS.recurring : DONATION_BENEFITS.single;
    };

    // Función para preparar los datos de pago para PagoPlux
    const preparePagoPluxData = (donationData: DonationFormData) => {
        return {
            PayboxRemail: "abautista@pagoplux.com", // Email de la cuenta PagoPlux del Establecimiento
            PayboxSendmail: donationData.email, // Email del usuario que realiza el pago
            PayboxRename: "Banco de Alimentos Quito", // Nombre del establecimiento en PagoPlux
            PayboxSendname: donationData.name, // Nombre del usuario que realiza el pago
            PayboxBase0: "0.00", // Monto sin impuestos
            PayboxBase12: donationData.amount.toFixed(2), // Monto con impuestos incluidos
            PayboxDescription: donationData.isRecurring
                ? "Donación mensual - Banco de Alimentos Quito"
                : "Donación única - Banco de Alimentos Quito", // Descripción del pago
            PayboxProduction: false, // Modo prueba
            PayboxEnvironment: "sandbox", // Ambiente de ejecución
            PayboxLanguage: "es", // Lenguaje del Paybox
            PayboxPagoPlux: true, // Tipo de iframe
            PayboxDirection: donationData.address || "No especificada", // Dirección del tarjetahabiente
            PayBoxClientPhone: donationData.phoneNumber || "No especificado", // Teléfono del tarjetahabiente
            PayBoxClientIdentification: donationData.identification || "No especificado", // Identificación del tarjetahabiente
            PayboxRecurrent: donationData.isRecurring, // Si es pago recurrente

            // Solo para pagos recurrentes
            ...(donationData.isRecurring && {
                PayboxIdPlan: 'Plan Mensual',
                PayboxPermitirCalendarizar: true,
                PayboxPagoInmediato: false,
                PayboxCobroPrueba: false,
            }),
        };
    };

    return {
        isLoading,
        error,
        successData,
        processDonation,
        getDonationImpact,
        processEmergencyDonation,
        getDonationBenefits,
        preparePagoPluxData
    };
};

export default useDonationService;