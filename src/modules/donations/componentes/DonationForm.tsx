import { FC, useState, useEffect } from 'react';
import Button from '@/shared/components/common/Button';
import { motion, AnimatePresence } from 'framer-motion';
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
    const [currentStep, setCurrentStep] = useState<number>(1);
    const [formSubmitted, setFormSubmitted] = useState<boolean>(false);

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
        validateStep,
        resetForm,
        getFinalAmount
    } = useDonationForm({
        isRecurring: donationType,
        initialAmount,
        // Añadimos la función validateStep
        validateStep: (step: number) => {
            if (step === 1) {
                if (getFinalAmount() <= 0) {
                    // Mostrar error si no hay monto seleccionado
                    return false;
                }
                return true;
            }

            if (step === 2) {
                // Validar campos del paso 2
                let valid = true;
                let newErrors: Record<string, string> = {};

                if (!formData.name.trim()) {
                    newErrors.name = 'Por favor ingresa tu nombre';
                    valid = false;
                }

                if (!formData.email.trim()) {
                    newErrors.email = 'Por favor ingresa tu correo electrónico';
                    valid = false;
                } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
                    newErrors.email = 'Por favor ingresa un correo electrónico válido';
                    valid = false;
                }

                // Actualizar errores
                // setErrors(newErrors);
                return valid;
            }

            return true;
        }
    });

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

    // Manejador para avanzar al siguiente paso
    const handleNextStep = () => {
        if (currentStep === 1 && getFinalAmount() <= 0) {
            // Mostrar error si no hay monto seleccionado
            return;
        }
        setCurrentStep(prev => prev + 1);
    };

    // Manejador para volver al paso anterior
    const handlePrevStep = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    // Manejador para enviar el formulario
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validar formulario
        if (!validateForm()) {
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
                setFormSubmitted(true);
                // resetForm();
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

    // Contenido según el paso actual
    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.4 }}
                        className="space-y-6"
                    >
                        <h3 className="text-xl font-bold mb-6">1. Selecciona un monto</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                            {amountOptions.map((amount) => (
                                <motion.button
                                    key={amount}
                                    type="button"
                                    className={`
                                        py-4 px-4 rounded-lg border-2 font-bold text-lg transition-all
                                        ${selectedAmount === amount
                                            ? 'bg-primary text-white border-primary shadow-md'
                                            : 'bg-white text-gray-700 border-gray-300 hover:border-primary hover:text-primary'}
                                    `}
                                    onClick={() => handleAmountSelect(amount)}
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    ${amount}
                                </motion.button>
                            ))}
                        </div>

                        <div className="relative mb-6">
                            <div className="flex items-center">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500 text-xl">$</span>
                                <input
                                    type="text"
                                    name="amount"
                                    placeholder="Otro monto"
                                    value={customAmount}
                                    onChange={handleCustomAmountChange}
                                    className={`w-full pl-10 pr-4 py-4 text-lg border-2 rounded-lg focus:outline-none input-focus-contrast ${errors.amount ? 'border-red-500' : 'border-gray-300 focus:border-primary'}`}
                                />
                            </div>
                            {errors.amount && (
                                <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
                            )}
                        </div>

                        {/* Mostrar impacto estimado si hay un monto válido */}
                        {getFinalAmount() > 0 && (
                            <motion.div
                                className="mb-8 bg-blue-50 text-blue-700 p-4 rounded-lg"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="flex items-start">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <div>
                                        <strong className="block mb-1">Tu impacto:</strong>
                                        <p>{donationImpact}</p>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        <div className="flex justify-end">
                            <Button
                                type="button"
                                onClick={handleNextStep}
                                size="lg"
                                elevated
                                disabled={getFinalAmount() <= 0}
                            >
                                Continuar
                            </Button>
                        </div>
                    </motion.div>
                );
            case 2:
                return (
                    <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.4 }}
                        className="space-y-6"
                    >
                        <h3 className="text-xl font-bold mb-6">2. Tus datos</h3>
                        <div className="space-y-5 mb-6">
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
                                    className={`w-full px-4 py-3 text-base border-2 rounded-lg focus:outline-none input-focus-contrast ${errors.name ? 'border-red-500' : 'border-gray-300 focus:border-primary'
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
                                    className={`w-full px-4 py-3 text-base border-2 rounded-lg focus:outline-none input-focus-contrast ${errors.email ? 'border-red-500' : 'border-gray-300 focus:border-primary'
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
                                    className={`w-full px-4 py-3 text-base border-2 rounded-lg focus:outline-none input-focus-contrast ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300 focus:border-primary'
                                        }`}
                                />
                                {errors.phoneNumber && (
                                    <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-between">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handlePrevStep}
                                size="md"
                            >
                                Atrás
                            </Button>
                            <Button
                                type="button"
                                onClick={handleNextStep}
                                size="lg"
                                elevated
                            >
                                Continuar
                            </Button>
                        </div>
                    </motion.div>
                );
            case 3:
                return (
                    <motion.div
                        key="step3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.4 }}
                        className="space-y-6"
                    >
                        <h3 className="text-xl font-bold mb-6">3. Método de pago</h3>

                        <div className="mb-8">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <motion.button
                                    type="button"
                                    className={`
                                        py-4 px-4 rounded-lg border-2 font-medium transition-all flex items-center justify-center
                                        ${formData.paymentMethod === 'card'
                                            ? 'bg-primary/10 text-primary border-primary'
                                            : 'bg-white text-gray-700 border-gray-300 hover:border-primary hover:text-primary'}
                                    `}
                                    onClick={() => handlePaymentMethodChange('card')}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                    </svg>
                                    Tarjeta
                                </motion.button>

                                <motion.button
                                    type="button"
                                    className={`
                                        py-4 px-4 rounded-lg border-2 font-medium transition-all flex items-center justify-center
                                        ${formData.paymentMethod === 'paypal'
                                            ? 'bg-primary/10 text-primary border-primary'
                                            : 'bg-white text-gray-700 border-gray-300 hover:border-primary hover:text-primary'}
                                    `}
                                    onClick={() => handlePaymentMethodChange('paypal')}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
                                    </svg>
                                    PayPal
                                </motion.button>

                                <motion.button
                                    type="button"
                                    className={`
                                        py-4 px-4 rounded-lg border-2 font-medium transition-all flex items-center justify-center
                                        ${formData.paymentMethod === 'transfer'
                                            ? 'bg-primary/10 text-primary border-primary'
                                            : 'bg-white text-gray-700 border-gray-300 hover:border-primary hover:text-primary'}
                                    `}
                                    onClick={() => handlePaymentMethodChange('transfer')}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                                    </svg>
                                    Transferencia
                                </motion.button>
                            </div>
                        </div>

                        {/* Resumen de la donación */}
                        <div className="bg-gray-50 p-4 rounded-lg mb-6">
                            <h4 className="font-bold mb-3">Resumen de tu donación</h4>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span>Monto:</span>
                                    <span className="font-bold">${getFinalAmount()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Tipo:</span>
                                    <span>{donationType ? 'Mensual recurrente' : 'Única'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Método de pago:</span>
                                    <span>{formData.paymentMethod === 'card' ? 'Tarjeta' :
                                        formData.paymentMethod === 'paypal' ? 'PayPal' : 'Transferencia'}</span>
                                </div>
                                {emergencyId && (
                                    <div className="flex justify-between">
                                        <span>Destinado a:</span>
                                        <span>Emergencia #ID-{emergencyId}</span>
                                    </div>
                                )}
                                <div className="pt-2 border-t border-gray-200 mt-2">
                                    <div className="flex justify-between font-bold">
                                        <span>Total:</span>
                                        <span className="text-primary">${getFinalAmount()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Términos y Condiciones */}
                        <div className="mb-6">
                            <label className="flex items-start">
                                <input
                                    type="checkbox"
                                    name="terms"
                                    className="mt-1 h-5 w-5 text-primary border-gray-300 rounded focus:ring-primary"
                                    required
                                />
                                <span className="ml-2 text-sm text-gray-600">
                                    Acepto los <a href="#" className="text-primary hover:underline">términos y condiciones</a> y la <a href="#" className="text-primary hover:underline">política de privacidad</a>.
                                    {donationType && " Entiendo que esta donación se renovará automáticamente cada mes hasta que decida cancelarla."}
                                </span>
                            </label>
                        </div>

                        <div className="flex justify-between">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handlePrevStep}
                                size="md"
                            >
                                Atrás
                            </Button>
                            <Button
                                type="submit"
                                variant="primary"
                                size="lg"
                                elevated
                                isLoading={isLoading}
                            >
                                {donationType
                                    ? 'Confirmar Donación Mensual'
                                    : 'Realizar Donación'
                                }
                            </Button>
                        </div>
                    </motion.div>
                );
            default:
                return null;
        }
    };

    // Componente de éxito después de enviar el formulario
    const SuccessComponent = () => (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-8"
        >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
            </div>
            <h2 className="text-2xl font-bold mb-4">¡Gracias por tu donación!</h2>
            <p className="text-gray-600 mb-6">
                Hemos enviado un comprobante a tu correo electrónico. Tu aporte de ${getFinalAmount()}
                {donationType && ' mensual'} hará una gran diferencia.
            </p>
            <Button
                onClick={() => {
                    resetForm();
                    setFormSubmitted(false);
                    setCurrentStep(1);
                }}
                variant="primary"
                elevated
            >
                Realizar otra donación
            </Button>
        </motion.div>
    );

    // Barra de progreso
    const ProgressBar = () => (
        <div className="mb-8">
            <div className="flex justify-between mb-2">
                {[1, 2, 3].map(step => (
                    <div
                        key={step}
                        className={`flex-1 ${step < 3 ? 'border-b-2' : ''} ${step <= currentStep ? 'border-primary' : 'border-gray-300'
                            }`}
                    >
                        <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step === currentStep
                                    ? 'bg-primary text-white'
                                    : step < currentStep
                                        ? 'bg-primary/20 text-primary'
                                        : 'bg-gray-200 text-gray-500'
                                }`}
                        >
                            {step}
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex justify-between text-xs text-gray-600">
                <span>Monto</span>
                <span>Datos</span>
                <span>Pago</span>
            </div>
        </div>
    );

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

            {!formSubmitted ? (
                <form onSubmit={handleSubmit}>
                    {/* Mostrar la barra de progreso solo si no estamos en modo emergencia */}
                    {!emergencyId && <ProgressBar />}

                    {/* Contenido del paso actual */}
                    <AnimatePresence mode="wait">
                        {renderStepContent()}
                    </AnimatePresence>

                    {/* Security Note */}
                    <p className="text-center text-sm text-gray-500 mt-6 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        Transacción segura y encriptada
                    </p>
                </form>
            ) : (
                <SuccessComponent />
            )}
        </motion.div>
    );
};

export default DonationForm;