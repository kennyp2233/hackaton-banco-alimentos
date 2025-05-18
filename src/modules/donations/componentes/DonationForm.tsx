// components/DonationForm.tsx

'use client';
import { FC, useState, useEffect, useRef } from 'react';
import { Formik, Form } from 'formik';
import { AnimatePresence, motion } from 'framer-motion';
import { useDonationService } from '../services/donationService';
import { DONATION_AMOUNTS } from '@/shared/config/constants';
import { EmojiFoodParticles, ConfettiExplosion } from '@/shared/components/EmojiFoodParticles';
import { InputField, CheckboxField } from './FormElements';
import { DonationSchema } from '../schemas/validationSchema';

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
    const containerRef = useRef<HTMLDivElement>(null);
    const [donationType, setDonationType] = useState<boolean>(isRecurring);
    const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
    const [showParticles, setShowParticles] = useState<boolean>(false);
    const [showConfetti, setShowConfetti] = useState<boolean>(false);
    const [particleAmount, setParticleAmount] = useState<number>(0);
    const [particleOrigin, setParticleOrigin] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const [showCustomField, setShowCustomField] = useState<boolean>(false);

    const { processDonation, processEmergencyDonation } = useDonationService();
    const [formValues, setFormValues] = useState<any>(null);
    const [amountValue, setAmountValue] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {
        // Mostrar el campo personalizado si hay un monto inicial que no es uno de los predefinidos
        if (initialAmount > 0 && !DONATION_AMOUNTS.includes(initialAmount)) {
            setShowCustomField(true);
        }

        if (typeof window !== 'undefined') {
            (window as any).Data.$onAuthorize = (response: any) => {
                if (response.status === 'succeeded') {
                    const completeData = {
                        ...(window as any).__formValues,
                        amount: (window as any).__amountValue,
                        transactionId: response.id_transaccion,
                        monto: response.amount,
                        diferidos: response.deferred,
                        tieneIntereses: response.interest,
                        valorIntereses: response.interestValue,
                        montoSinImpuestos: response.amountWoTaxes,
                        tarjetaEncriptada: response.cardInfo,
                        marcaTarjeta: response.cardIssuer,
                        tipoTarjeta: response.cardType,
                        identificacionCliente: response.clientID,
                        nombreCliente: response.clientName,
                        fechaPago: response.fecha,
                        estadoPago: response.state,
                        voucher: response.token,
                        tipoPago: response.tipoPago,
                        emergencyId: (window as any).__emergencyId
                    };


                    // Ocultar contenedor visual si aplica
                    if (typeof window !== 'undefined' && (window as any).jQuery) {
                        (window as any).jQuery('.container-unpayed').hide();
                    }

                    // Feedback visual en frontend
                    (window as any).__setShowConfetti?.(true);
                    (window as any).__setFormSubmitted?.(true);

                    // Registro en consola
                    console.log('Pago completado:', completeData);
                }
            };
        }
    }, [initialAmount]);


    useEffect(() => {
        setDonationType(isRecurring);
    }, [isRecurring]);

    const handleAmountSelect = (
        e: React.MouseEvent<HTMLButtonElement>,
        amount: number,
        setFieldValue: Function
    ) => {
        setFieldValue('amount', amount);
        setFieldValue('customAmount', '');
        setParticleAmount(amount);
        setShowCustomField(false);

        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            const input = e.target as HTMLElement;
            const inputRect = input.getBoundingClientRect();
            setParticleOrigin({
                x: inputRect.left - rect.left + inputRect.width / 2,
                y: inputRect.top - rect.top + inputRect.height / 2
            });
        }

        setShowParticles(true);
        setTimeout(() => setShowParticles(false), 2000);
    };

    const handleShowCustomField = (setFieldValue: Function) => {
        setFieldValue('amount', 0);
        setShowCustomField(true);

        // Focus en el input después de un pequeño retraso para permitir animaciones
        setTimeout(() => {
            const customInput = document.getElementById('custom-amount-field');
            if (customInput) customInput.focus();
        }, 100);
    };

    const handleCustomAmountChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        setFieldValue: Function
    ) => {
        const value = e.target.value;
        if (/^\d*\.?\d*$/.test(value) || value === '') {
            setFieldValue('customAmount', value);
            setFieldValue('amount', 0);
            const num = parseFloat(value || '0');
            if (num > 0 && containerRef.current) {
                setParticleAmount(num);
                const rect = containerRef.current.getBoundingClientRect();
                const inputElement = e.target as HTMLElement;
                const inputRect = inputElement.getBoundingClientRect();
                setParticleOrigin({
                    x: inputRect.left - rect.left + inputRect.width / 2,
                    y: inputRect.top - rect.top + inputRect.height / 2
                });
                setShowParticles(true);
                setTimeout(() => setShowParticles(false), 2000);
            }
        }
    };

    const generatePagoPluxData = (values: any, finalAmount: number) => {
        setFormValues(values);
        setAmountValue(finalAmount);
        if (typeof window !== 'undefined') {
            (window as any).__formValues = values;
            (window as any).__amountValue = finalAmount;
            (window as any).__emergencyId = emergencyId;
            (window as any).__setFormSubmitted = setFormSubmitted;
            (window as any).__setShowConfetti = setShowConfetti;
        }

        const description = emergencyId
            ? `Donación para emergencia #${emergencyId} - Banco de Alimentos Quito`
            : donationType
                ? 'Donación mensual - Banco de Alimentos Quito'
                : 'Donación única - Banco de Alimentos Quito';

        return {
            PayboxRemail: 'abautista@pagoplux.com',
            PayboxSendmail: values.email,
            PayboxRename: 'Banco de Alimentos Quito',
            PayboxSendname: values.name,
            PayboxBase0: '0.00',
            PayboxBase12: finalAmount.toFixed(2),
            PayboxDescription: description,
            PayboxProduction: false,
            PayboxEnvironment: 'sandbox',
            PayboxLanguage: 'es',
            PayboxPagoPlux: true,
            PayboxDirection: 'Av. Siempre Viva 123',
            PayBoxClientPhone: '0999999999',
            PayBoxClientIdentification: '1726380098',
            PayboxRecurrent: donationType && !emergencyId, // No recurrente si es para emergencia
            ...(donationType && !emergencyId && {
                PayboxIdPlan: '749',
                PayboxPermitirCalendarizar: true,
                PayboxPagoInmediato: false,
                PayboxCobroPrueba: false
            }),


        };
    };

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

    // Calcular los valores iniciales
    const getInitialValues = () => {
        // Si el monto inicial está dentro de los predefinidos, lo establecemos como amount
        if (DONATION_AMOUNTS.includes(initialAmount)) {
            return {
                amount: initialAmount,
                customAmount: '',
                name: '',
                email: '',
                termsAccepted: false
            };
        }
        // Si no, lo establecemos como customAmount
        return {
            amount: 0,
            customAmount: initialAmount > 0 ? initialAmount.toString() : '',
            name: '',
            email: '',
            termsAccepted: false
        };
    };

    return (
        <motion.div
            ref={containerRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative bg-white rounded-xl shadow-xl p-6 md:p-8"
        >
            <EmojiFoodParticles
                amount={particleAmount}
                isActive={showParticles}
                type="food"
                origin={particleOrigin}
            />
            <ConfettiExplosion isActive={showConfetti} />

            <h2 className="text-2xl font-bold mb-6 text-center">
                {emergencyId ? 'Donación para Emergencia' : donationType ? 'Donación Mensual' : 'Donación Única'}
            </h2>

            {!formSubmitted ? (
                <Formik
                    initialValues={getInitialValues()}
                    enableReinitialize
                    validationSchema={DonationSchema}
                    onSubmit={() => { }}
                >
                    {({ values, setFieldValue }) => (
                        <Form className="space-y-6">
                            <div>
                                <h3 className="text-xl font-bold mb-4">¿Con cuánto deseas contribuir?</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                                    {DONATION_AMOUNTS.map((amount) => (
                                        <motion.button
                                            key={amount}
                                            type="button"
                                            className={`py-3 px-4 rounded-lg border-2 font-bold text-lg transition-all ${values.amount === amount
                                                ? 'bg-primary text-white border-primary'
                                                : 'bg-white text-gray-700 border-gray-300 hover:border-primary hover:text-primary'
                                                }`}
                                            onClick={(e) => handleAmountSelect(e, amount, setFieldValue)}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            ${amount}
                                        </motion.button>
                                    ))}
                                </div>

                                {/* Botón "Otro monto" */}
                                {!showCustomField && (
                                    <motion.button
                                        type="button"
                                        onClick={() => handleShowCustomField(setFieldValue)}
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
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <div className="relative">
                                                <div className="flex items-center">
                                                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500 text-xl">$</span>
                                                    <input
                                                        id="custom-amount-field"
                                                        name="customAmount"
                                                        type="text"
                                                        placeholder="Ingrese monto personalizado"
                                                        value={values.customAmount}
                                                        onChange={(e) => handleCustomAmountChange(e, setFieldValue)}
                                                        className="w-full pl-10 pr-4 py-4 text-lg border-2 rounded-lg border-gray-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                                                    />
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <div>
                                <h3 className="text-xl font-bold mb-4">Tus datos</h3>
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

                            <CheckboxField name="termsAccepted">
                                Acepto los{' '}
                                <a href="#" className="text-primary hover:underline">
                                    términos y condiciones
                                </a>{' '}
                                y la{' '}
                                <a href="#" className="text-primary hover:underline">
                                    política de privacidad
                                </a>
                                .
                            </CheckboxField>

                            <div className="flex flex-col items-center gap-2 mt-6">
                                <button
                                    type="button"
                                    disabled={!values.termsAccepted || isLoading}
                                    onClick={async () => {
                                        const finalAmount = values.amount || parseFloat(values.customAmount || '0');
                                        if (finalAmount > 0 && values.termsAccepted) {
                                            setIsLoading(true);
                                            const data = generatePagoPluxData(values, finalAmount);
                                            console.log('donationType', donationType);
                                         
                                            iniciarDatos(data);

                                            const timeoutMs = 10000; // 10 segundos
                                            let observer: MutationObserver | null = null;
                                            let timeout: NodeJS.Timeout;

                                            const stopLoading = () => {
                                                setIsLoading(false);
                                                if (observer) observer.disconnect();
                                                clearTimeout(timeout);
                                            };

                                            // Verifica si ya existe #base antes de observar
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
                                        }
                                    }}
                                    className={`w-full max-w-xs px-6 py-3 rounded-xl text-lg font-semibold shadow-lg transition-colors duration-200 flex items-center justify-center gap-2 ${!values.termsAccepted || isLoading
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        : 'bg-primary text-white hover:bg-primary/90'
                                        }`}
                                >
                                    {isLoading ? (
                                        <>
                                            <span className="animate-spin border-2 border-t-transparent border-white rounded-full w-5 h-5" />
                                            <span className="ml-2">Cargando pasarela...</span>
                                        </>
                                    ) : (
                                        'Donar ahora con tarjeta 💳'
                                    )}
                                </button>

                                <div className="flex gap-3 mt-2 opacity-70">
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
                            </div>

                            <div id="modalPaybox" />
                            <button id="pay" type="submit" style={{ display: 'none' }} />
                        </Form>
                    )}
                </Formik>
            ) : (
                <div className="text-center py-8">
                    <p className="text-gray-600 mb-6">
                        Hemos enviado un comprobante a tu correo. Tu aporte
                        {emergencyId
                            ? ' para esta emergencia'
                            : donationType ? ' mensual' : ''} hará una gran diferencia.
                    </p>

                    <img
                        src="/gracias-verduras.png"
                        alt="Gracias por alimentar esperanza"
                        className="mx-auto max-w-xs md:max-w-sm"
                    />
                    <button
                        onClick={() => {
                            setFormSubmitted(false);
                            setShowConfetti(false);
                            setFormValues(null);
                            setAmountValue(0);
                        }}
                        className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl text-lg font-semibold shadow-md transition-all duration-200 cursor-pointer"
                    >
                        Realizar otra donación
                    </button>
                </div>
            )}

            <p className="text-center text-sm text-gray-500 mt-6 flex items-center justify-center">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                </svg>
                Transacción segura y encriptada
            </p>
        </motion.div>
    );
};

export default DonationForm;