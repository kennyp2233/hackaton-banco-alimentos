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
    address?: string;
    comments?: string;
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
            // Simulamos un delay para el hackathon
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Simulación de respuesta exitosa
            const response: DonationResponse = {
                success: true,
                transactionId: `TX-${Math.floor(Math.random() * 1000000)}`
            };

            setSuccessData({ transactionId: response.transactionId || '' });
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

    // Obtener información de impacto desde constantes
    const getImpactInfo = (amount: number) => {
        if (amount <= DONATION_IMPACT.small.amount) {
            return DONATION_IMPACT.small.description;
        } else if (amount <= DONATION_IMPACT.medium.amount) {
            return DONATION_IMPACT.medium.description;
        } else {
            return DONATION_IMPACT.large.description;
        }
    };

    // Funcionalidad específica para donaciones recurrentes
    const cancelRecurringDonation = async (subscriptionId: string): Promise<boolean> => {
        setIsLoading(true);

        try {
            // Simulamos una llamada a la API para cancelar la suscripción
            await new Promise(resolve => setTimeout(resolve, 1000));
            return true;
        } catch (err) {
            setError('Error al cancelar la donación recurrente');
            return false;
        } finally {
            setIsLoading(false);
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
            // Simulamos un delay para el hackathon
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Simulación de respuesta exitosa
            const response: DonationResponse = {
                success: true,
                transactionId: `EMRG-${Math.floor(Math.random() * 1000000)}`
            };

            setSuccessData({ transactionId: response.transactionId || '' });
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
            'Recibes informes sobre el impacto de tu ayuda.',
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

    return {
        isLoading,
        error,
        successData,
        processDonation,
        getDonationImpact,
        getImpactInfo,
        cancelRecurringDonation,
        processEmergencyDonation,
        getDonationBenefits
    };
};

export default useDonationService;