'use client';
import { FC, useState, useEffect } from 'react';
import { Formik, Form } from 'formik';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useDonationService } from '../services/donationService';
import PpxButton from '@/shared/components/PpxButton';
import { DONATION_AMOUNTS } from '@/shared/config/constants';
import {
    InputField,
    CheckboxField,
    AmountSelector,
    FormButton,
    PaymentMethodSelector
} from './FormElements';
import { DonationSchema, StepOneSchema } from '../schemas/validationSchema';

interface DonationFormProps {
    isRecurring?: boolean;
    onToggleType?: (isRecurring: boolean) => void;
    initialAmount?: number;
    emergencyId?: string;
    showToggle?: boolean;
}

const DonationForm: FC<DonationFormProps> = ({
    isRecurring = false,
    onToggleType,
    initialAmount = 0,
    emergencyId,
    showToggle = true
}) => {
    // Estados locales
    const [donationType, setDonationType] = useState<boolean>(isRecurring);
    const [showStep, setShowStep] = useState<number>(1);
    const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
    const [pagoPluxData, setPagoPluxData] = useState<any>(null);

    // Usar el servicio de donaciones
    const {
        isLoading,
        error,
        successData,
        processDonation,
        processEmergencyDonation,
        getDonationImpact,
        preparePagoPluxData
    } = useDonationService();

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
                Hemos enviado un comprobante a tu correo electrónico. Tu aporte
                {donationType && ' mensual'} hará una gran diferencia.
            </p>
            <FormButton
                onClick={() => {
                    setFormSubmitted(false);
                    setShowStep(1);
                }}
                variant="primary"
            >
                Realizar otra donación
            </FormButton>
        </motion.div>
    );

    // Valores iniciales para el formulario
    const initialValues = {
        amount: initialAmount,
        customAmount: '',
        name: '',
        email: '',
        phoneNumber: '',
        identification: '',
        address: '',
        paymentMethod: 'card',
        termsAccepted: false,
        comments: ''
    };

    // Manejar el submit del formulario
    const handleSubmit = async (values: any, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {
        setSubmitting(true);

        try {
            // Calcular el monto final (el seleccionado o el personalizado)
            const finalAmount = values.amount || (values.customAmount ? parseFloat(values.customAmount) : 0);

            // Si estamos en el primer paso, avanzar al siguiente
            if (showStep === 1) {
                // Verificar que hay un monto válido
                if (finalAmount <= 0) {
                    return;
                }
                setShowStep(2);
                setSubmitting(false);
                return;
            }

            // Preparar los datos para PagoPlux
            const donationData = {
                ...values,
                amount: finalAmount,
                isRecurring: donationType
            };

            // Configurar callback para procesar la donación una vez completado el pago
            const onPaymentComplete = (response: { status: string; id_transaccion: any; }) => {
                if (response.status === "succeeded") {
                    // Agregar el ID de transacción a los datos de la donación
                    const completeData = {
                        ...donationData,
                        transactionId: response.id_transaccion
                    };

                    // Procesar la donación en nuestro sistema
                    if (emergencyId) {
                        processEmergencyDonation(emergencyId, completeData);
                    } else {
                        processDonation(completeData);
                    }

                    setFormSubmitted(true);
                }
            };

            // Configurar los datos para PagoPlux
            const ppxData = {
                PayboxRemail: "abautista@pagoplux.com",
                PayboxSendmail: values.email,
                PayboxRename: "Banco de Alimentos Quito",
                PayboxSendname: values.name,
                PayboxBase0: "0.00",
                PayboxBase12: finalAmount.toFixed(2),
                PayboxDescription: donationType
                    ? "Donación mensual - Banco de Alimentos Quito"
                    : "Donación única - Banco de Alimentos Quito",
                PayboxProduction: false,
                PayboxEnvironment: "sandbox",
                PayboxLanguage: "es",
                PayboxPagoPlux: true,
                PayboxDirection: values.address,
                PayBoxClientPhone: values.phoneNumber,
                PayBoxClientIdentification: values.identification,
                PayboxRecurrent: donationType,

                // Solo para pagos recurrentes
                ...(donationType && {
                    PayboxIdPlan: 'Plan Mensual',
                    PayboxPermitirCalendarizar: true,
                    PayboxPagoInmediato: false,
                    PayboxCobroPrueba: false,
                }),

                // Callback para cuando el pago se complete
                onAuthorize: onPaymentComplete
            };

            // Activar el componente de PagoPlux
            setPagoPluxData(ppxData);
        } catch (error) {
            console.error("Error al procesar el formulario:", error);
        } finally {
            setSubmitting(false);
        }
    };

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

            {/* Selector de tipo de donación */}
            {showToggle && (
                <div className="flex justify-center items-center gap-6 mb-8">
                    <span
                        className={`text-lg font-medium cursor-pointer select-none ${!donationType ? 'text-gray-900' : 'text-gray-400'}`}
                        onClick={() => handleDonationTypeChange(false)}
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
                            checked={donationType}
                            onChange={() => handleDonationTypeChange(!donationType)}
                        />
                        <span
                            className={`block bg-gray-300 rounded-full h-8 transition-colors ${donationType ? 'bg-green-500' : ''}`}
                        />
                        <span
                            className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${donationType ? 'translate-x-6' : 'translate-x-0'}`}
                        />
                    </label>

                    <span
                        className={`text-lg font-medium cursor-pointer select-none ${donationType ? 'text-gray-900' : 'text-gray-400'}`}
                        onClick={() => handleDonationTypeChange(true)}
                    >
                        Donación Mensual
                    </span>
                </div>
            )}

            {/* Contenido del formulario */}
            {!formSubmitted ? (
                <Formik
                    initialValues={initialValues}
                    validationSchema={DonationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ values, errors, touched, setFieldValue, isSubmitting, handleSubmit }) => (
                        <Form>
                            {/* Pasos del formulario */}
                            <AnimatePresence mode="wait">
                                {showStep === 1 ? (
                                    <motion.div
                                        key="step1"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.4 }}
                                        className="space-y-6"
                                    >
                                        {/* Paso 1: Selección de monto */}
                                        <div>
                                            <h3 className="text-xl font-bold mb-4">¿Con cuánto deseas contribuir?</h3>

                                            <AmountSelector
                                                name="amount"
                                                customAmountName="customAmount"
                                                amounts={DONATION_AMOUNTS}
                                                selectedAmount={values.amount}
                                                onAmountSelect={(amount) => {
                                                    setFieldValue('amount', amount);
                                                    setFieldValue('customAmount', '');
                                                }}
                                                onCustomAmountChange={(e) => {
                                                    const value = e.target.value;
                                                    if (/^\d*\.?\d*$/.test(value) || value === '') {
                                                        setFieldValue('customAmount', value);
                                                        setFieldValue('amount', 0);
                                                    }
                                                }}
                                                customAmount={values.customAmount}
                                            />

                                            {/* Mostrar impacto estimado si hay un monto válido */}
                                            {(values.amount > 0 || parseFloat(values.customAmount) > 0) && (
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
                                                            <p>
                                                                {getDonationImpact(values.amount || parseFloat(values.customAmount) || 0)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </div>

                                        {/* Datos básicos del donante */}
                                        <div>
                                            <h3 className="text-xl font-bold mb-4">Tus datos</h3>

                                            <div className="space-y-4">
                                                <InputField
                                                    label="Nombre completo"
                                                    name="name"
                                                    placeholder="Ingresa tu nombre completo"
                                                    required
                                                />

                                                <InputField
                                                    label="Correo electrónico"
                                                    name="email"
                                                    type="email"
                                                    placeholder="Ingresa tu correo electrónico"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        {/* Botón para continuar al paso 2 */}
                                        <div className="flex justify-end">
                                            <FormButton
                                                type="submit"
                                                disabled={isSubmitting || (values.amount <= 0 && !parseFloat(values.customAmount))}
                                                isLoading={isSubmitting}
                                            >
                                                Continuar
                                            </FormButton>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="step2"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.4 }}
                                        className="space-y-6"
                                    >
                                        {/* Paso 2: Datos para el pago */}
                                        <div>
                                            <h3 className="text-xl font-bold mb-4">Completa tu información de pago</h3>

                                            <div className="space-y-4">
                                                <InputField
                                                    label="Número de teléfono"
                                                    name="phoneNumber"
                                                    type="tel"
                                                    placeholder="Ej: +593 XX XXX XXXX"
                                                    required
                                                />

                                                <InputField
                                                    label="Número de identificación"
                                                    name="identification"
                                                    placeholder="Ingresa tu número de cédula o pasaporte"
                                                    required
                                                />

                                                <InputField
                                                    label="Dirección"
                                                    name="address"
                                                    placeholder="Ingresa tu dirección completa"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        {/* Método de pago */}
                                        <div>
                                            <h3 className="text-xl font-bold mb-4">Método de pago</h3>
                                            <PaymentMethodSelector
                                                name="paymentMethod"
                                                value={values.paymentMethod}
                                                onChange={setFieldValue}
                                            />
                                        </div>

                                        {/* Resumen de la donación */}
                                        <div className="bg-gray-50 p-6 rounded-lg mb-6">
                                            <h4 className="font-bold mb-4">Resumen de tu donación</h4>
                                            <div className="space-y-3">
                                                <div className="flex justify-between">
                                                    <span>Monto:</span>
                                                    <span className="font-bold">
                                                        ${values.amount || parseFloat(values.customAmount) || 0}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Tipo:</span>
                                                    <span>{donationType ? 'Mensual recurrente' : 'Única'}</span>
                                                </div>
                                                {emergencyId && (
                                                    <div className="flex justify-between">
                                                        <span>Destinado a:</span>
                                                        <span>Emergencia</span>
                                                    </div>
                                                )}
                                                <div className="pt-3 border-t border-gray-200 mt-3">
                                                    <div className="flex justify-between font-bold">
                                                        <span>Total:</span>
                                                        <span className="text-primary">
                                                            ${values.amount || parseFloat(values.customAmount) || 0}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>



                                        {/* Términos y condiciones */}
                                        <CheckboxField name="termsAccepted">
                                            Acepto los <Link href="#" className="text-primary hover:underline">términos y condiciones</Link>
                                            y la <Link href="#" className="text-primary hover:underline">política de privacidad</Link>.
                                            {donationType && " Entiendo que esta donación se renovará automáticamente cada mes hasta que decida cancelarla."}
                                        </CheckboxField>

                                        {/* Botones de acción */}
                                        <div className="flex justify-between">
                                            <FormButton
                                                type="button"
                                                variant="secondary"
                                                onClick={() => setShowStep(1)}
                                            >
                                                Volver
                                            </FormButton>

                                            <FormButton
                                                type="submit"
                                                isLoading={isSubmitting}
                                                disabled={!values.termsAccepted}
                                            >
                                                Realizar Donación

                                            </FormButton>

                                        </div>

                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Componente PagoPlux - Oculto hasta que se necesite */}
                            {pagoPluxData && (
                                <>
                                    <PpxButton
                                        data={pagoPluxData}
                                        visible={true}
                                    />
                                </>

                            )}
                        </Form>
                    )}
                </Formik>
            ) : (
                <SuccessComponent />
            )}

            {/* Información de seguridad */}
            <p className="text-center text-sm text-gray-500 mt-6 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Transacción segura y encriptada
            </p>
        </motion.div>
    );
};

export default DonationForm;