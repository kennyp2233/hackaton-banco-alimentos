import { FC, useState, useEffect } from 'react';
import Button from '@/shared/components/common/Button';
import { motion } from 'framer-motion';
import useDonationForm from '../hooks/useDonationForm';
import useDonationService from '../services/donationService';

interface DonationFormProps {
    isRecurring?: boolean;
    onToggleType?: (isRecurring: boolean) => void; // Callback para cuando el usuario cambia el tipo
    initialAmount?: number;
    emergencyId?: string; // Opcional, para donaciones específicas a emergencias
    showToggle?: boolean; // Si se debe mostrar el toggle entre recurrente y único
}

const DonationForm: FC<DonationFormProps> = ({
    isRecurring = false,
    onToggleType,
    initialAmount = 0,
    emergencyId,
    showToggle = true
}) => {
    // Estado local para el tipo de donación (recurrente o única)
    const [donationType, setDonationType] = useState<boolean>(isRecurring);

    // Hooks personalizados
    const {
        formData,
        selectedAmount,
        customAmount,
        errors,
        handleAmountSelect,
        handleCustomAmountChange,
        handleInputChange,
        handlePaymentMethodChange,
        validateForm,
        resetForm,
        getFinalAmount
    } = useDonationForm({ isRecurring: donationType, initialAmount });

    const {
        isLoading,
        error,
        successData,
        processDonation,
        processEmergencyDonation,
        getDonationImpact
    } = useDonationService();

    // Opciones de monto
    const amountOptions = [10, 25, 50, 100];

    // Actualizar el tipo de donación cuando cambia la prop
    useEffect(() => {
        setDonationType(isRecurring);
    }, [isRecurring]);

    // Manejador para cambiar entre donación recurrente y única
    const handleDonationTypeChange = (recurring: boolean) => {
        setDonationType(recurring);
        if (onToggleType) {
            onToggleType(recurring);
        }
    };

    // Manejador para enviar el formulario
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validar formulario
        if (!validateForm()) {
            // Mostrar mensaje para corregir errores
            return;
        }

        try {
            let response;

            // Determinar si es una donación a emergencia o regular
            if (emergencyId) {
                response = await processEmergencyDonation(emergencyId, formData);
            } else {
                response = await processDonation(formData);
            }

            if (response.success) {
                // Éxito - podríamos redirigir a una página de agradecimiento
                // o mostrar un mensaje de confirmación
                resetForm();
                alert(`¡Gracias por tu donación de $${getFinalAmount()}!`);
            } else {
                // Manejar error
                alert(`Error: ${response.error || 'Ha ocurrido un problema al procesar tu donación'}`);
            }
        } catch (err) {
            console.error('Error procesando donación:', err);
            alert('Ha ocurrido un error inesperado. Por favor intenta nuevamente.');
        }
    };

    // Calcular el impacto estimado de la donación
    const donationImpact = getDonationImpact(getFinalAmount());

    return (
        <motion.div
            key={donationType ? "recurring" : "single"}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl shadow-xl p-6 md:p-8"
        >
            <h2 className="text-2xl font-bold mb-6 text-center">
                {donationType ? 'Donación Mensual' : 'Donación Única'}
            </h2>



            <form onSubmit={handleSubmit}>
                {/* Amount Selection */}
                <div className="mb-6">
                    <label className="block text-gray-700 font-medium mb-2">
                        Selecciona un monto:
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                        {amountOptions.map((amount) => (
                            <button
                                key={amount}
                                type="button"
                                className={`
                  py-3 px-4 rounded-lg border font-bold transition-all
                  ${selectedAmount === amount
                                        ? 'bg-primary text-white border-primary'
                                        : 'bg-white text-gray-700 border-gray-300 hover:border-primary hover:text-primary'}
                `}
                                onClick={() => handleAmountSelect(amount)}
                            >
                                ${amount}
                            </button>
                        ))}
                    </div>

                    <div className="relative mt-4">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                        <input
                            type="text"
                            name="amount"
                            placeholder="Otro monto"
                            value={customAmount}
                            onChange={handleCustomAmountChange}
                            className={`w-full pl-8 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 ${errors.amount ? 'border-red-500' : 'border-gray-300 focus:border-primary'
                                }`}
                        />
                        {errors.amount && (
                            <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
                        )}
                    </div>

                    {/* Mostrar impacto estimado si hay un monto válido */}
                    {getFinalAmount() > 0 && (
                        <div className="mt-3 bg-blue-50 text-blue-700 p-3 rounded-lg text-sm">
                            <strong>Impacto estimado:</strong> {donationImpact}
                        </div>
                    )}
                </div>

                {/* Personal Information */}
                <div className="space-y-4 mb-6">
                    <div>
                        <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                            Nombre completo:
                        </label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 ${errors.name ? 'border-red-500' : 'border-gray-300 focus:border-primary'
                                }`}
                        />
                        {errors.name && (
                            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                            Correo electrónico:
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 ${errors.email ? 'border-red-500' : 'border-gray-300 focus:border-primary'
                                }`}
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="phoneNumber" className="block text-gray-700 font-medium mb-2">
                            Teléfono (opcional):
                        </label>
                        <input
                            id="phoneNumber"
                            name="phoneNumber"
                            type="tel"
                            value={formData.phoneNumber || ''}
                            onChange={handleInputChange}
                            className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300 focus:border-primary'
                                }`}
                        />
                        {errors.phoneNumber && (
                            <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>
                        )}
                    </div>
                </div>

                {/* Payment Method */}
                <div className="mb-8">
                    <label className="block text-gray-700 font-medium mb-2">
                        Método de pago:
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        <button
                            type="button"
                            className={`
                py-3 px-4 rounded-lg border font-medium transition-all flex items-center justify-center
                ${formData.paymentMethod === 'card'
                                    ? 'bg-primary/10 text-primary border-primary'
                                    : 'bg-white text-gray-700 border-gray-300 hover:border-primary hover:text-primary'}
              `}
                            onClick={() => handlePaymentMethodChange('card')}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                            </svg>
                            Tarjeta
                        </button>

                        <button
                            type="button"
                            className={`
                py-3 px-4 rounded-lg border font-medium transition-all flex items-center justify-center
                ${formData.paymentMethod === 'paypal'
                                    ? 'bg-primary/10 text-primary border-primary'
                                    : 'bg-white text-gray-700 border-gray-300 hover:border-primary hover:text-primary'}
              `}
                            onClick={() => handlePaymentMethodChange('paypal')}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
                            </svg>
                            PayPal
                        </button>

                        <button
                            type="button"
                            className={`
                py-3 px-4 rounded-lg border font-medium transition-all flex items-center justify-center
                ${formData.paymentMethod === 'transfer'
                                    ? 'bg-primary/10 text-primary border-primary'
                                    : 'bg-white text-gray-700 border-gray-300 hover:border-primary hover:text-primary'}
              `}
                            onClick={() => handlePaymentMethodChange('transfer')}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                            </svg>
                            Transferencia
                        </button>
                    </div>
                </div>

                {/* Términos y Condiciones */}
                <div className="mb-6">
                    <label className="flex items-start">
                        <input
                            type="checkbox"
                            name="terms"
                            className="mt-1 h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                            required
                        />
                        <span className="ml-2 text-sm text-gray-600">
                            Acepto los <a href="#" className="text-primary hover:underline">términos y condiciones</a> y la <a href="#" className="text-primary hover:underline">política de privacidad</a>.
                            {donationType && " Entiendo que esta donación se renovará automáticamente cada mes hasta que decida cancelarla."}
                        </span>
                    </label>
                </div>

                {/* Submit Button */}
                <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    fullWidth
                    isLoading={isLoading}
                >
                    {donationType
                        ? 'Confirmar Donación Mensual'
                        : 'Realizar Donación'
                    }
                </Button>

                {/* Security Note */}
                <p className="text-center text-sm text-gray-500 mt-4 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Transacción segura y encriptada
                </p>
            </form>
        </motion.div>
    );
};

export default DonationForm;