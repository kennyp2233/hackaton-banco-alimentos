'use client';
import { FC, useState, useEffect } from 'react';
import { Formik, Form } from 'formik';
import { motion } from 'framer-motion';
import { useDonationService } from '../services/donationService';
import { DONATION_AMOUNTS } from '@/shared/config/constants';
import { EmojiFoodParticles, ConfetiExplosion } from '@/shared/components/EmojiFoodParticles';
import { InputField, CheckboxField } from './FormElements';
import { DonationSchema } from '../schemas/validationSchema';
import PpxButton from '@/shared/components/PpxButton';

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
    const [donationType, setDonationType] = useState<boolean>(isRecurring);
    const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
    const [showParticles, setShowParticles] = useState<boolean>(false);
    const [showConfetti, setShowConfetti] = useState<boolean>(false);
    const [particleAmount, setParticleAmount] = useState<number>(0);
    const [pagoPluxData, setPagoPluxData] = useState<any>({});

    const {
        processDonation,
        processEmergencyDonation
    } = useDonationService();

    useEffect(() => {
        setDonationType(isRecurring);
    }, [isRecurring]);

    useEffect(() => {
        if (initialAmount > 0) {
            setParticleAmount(initialAmount);
            setShowParticles(true);
            setTimeout(() => setShowParticles(false), 2000);
        }
    }, [initialAmount]);

    const handleAmountSelect = (amount: number, setFieldValue: Function) => {
        setFieldValue('amount', amount);
        setFieldValue('customAmount', '');
        setParticleAmount(amount);
        setShowParticles(true);
        setTimeout(() => setShowParticles(false), 2000);
    };

    const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>, setFieldValue: Function) => {
        const value = e.target.value;
        if (/^\d*\.?\d*$/.test(value) || value === '') {
            setFieldValue('customAmount', value);
            setFieldValue('amount', 0);
            if (value && parseFloat(value) > 0) {
                setParticleAmount(parseFloat(value));
                setShowParticles(true);
                setTimeout(() => setShowParticles(false), 2000);
            }
        }
    };

    const generatePagoPluxData = (values: any, finalAmount: number) => ({
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
        PayboxDirection: "Av. Siempre Viva 123",
        PayBoxClientPhone: "0999999999",
        PayBoxClientIdentification: "1726380098",
        PayboxRecurrent: donationType,
        ...(donationType && {
            PayboxIdPlan: "Plan Mensual",
            PayboxPermitirCalendarizar: true,
            PayboxPagoInmediato: false,
            PayboxCobroPrueba: false,
        }),
        onAuthorize: (response: { status: string; id_transaccion: any }) => {
            if (response.status === "succeeded") {
                const completeData = {
                    ...values,
                    amount: finalAmount,
                    transactionId: response.id_transaccion
                };
                if (emergencyId) {
                    processEmergencyDonation(emergencyId, completeData);
                } else {
                    processDonation(completeData);
                }
                setShowConfetti(true);
                setFormSubmitted(true);
            }
        }
    });

    const initialValues = {
        amount: initialAmount,
        customAmount: '',
        name: '',
        email: '',
        termsAccepted: false
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl shadow-xl p-6 md:p-8 relative"
        >
            <EmojiFoodParticles amount={particleAmount} isActive={showParticles} type="food" />
            <ConfetiExplosion isActive={showConfetti} />

            <h2 className="text-2xl font-bold mb-6 text-center">
                {donationType ? 'Donación Mensual' : 'Donación Única'}
            </h2>

            {!formSubmitted ? (
                <Formik
                    initialValues={initialValues}
                    validationSchema={DonationSchema}
                    onSubmit={() => { }} // Ya no se necesita lógica aquí
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
                                            onClick={() => handleAmountSelect(amount, setFieldValue)}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            ${amount}
                                        </motion.button>
                                    ))}
                                </div>
                                <input
                                    name="customAmount"
                                    type="text"
                                    placeholder="Otro monto"
                                    value={values.customAmount}
                                    onChange={(e) => handleCustomAmountChange(e, setFieldValue)}
                                    className="w-full pl-4 pr-4 py-4 text-lg border-2 rounded-lg border-gray-300"
                                />
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
                                Acepto los <a href="#" className="text-primary hover:underline">términos y condiciones</a> y la <a href="#" className="text-primary hover:underline">política de privacidad</a>.
                            </CheckboxField>

                            <button
                                type="button"
                                disabled={!values.termsAccepted}
                                onClick={() => {
                                    const finalAmount = values.amount || parseFloat(values.customAmount || '0');
                                    if (finalAmount > 0 && values.termsAccepted) {
                                        const data = generatePagoPluxData(values, finalAmount);
                                        setPagoPluxData(data);
                                    }
                                }}
                                className="w-full max-w-xs px-6 py-3 rounded-xl bg-primary text-white text-lg font-semibold shadow-lg hover:bg-primary/90 transition-colors duration-200 flex items-center justify-center gap-2"
                            >
                                Donar ahora con tarjeta 💳
                            </button>

                            <PpxButton data={pagoPluxData} visible={values.termsAccepted && !!pagoPluxData.PayboxBase12} />
                        </Form>
                    )}
                </Formik>
            ) : (
                <div className="text-center py-8">
                    <h2 className="text-2xl font-bold mb-4">¡Gracias por tu donación!</h2>
                    <p className="text-gray-600 mb-6">
                        Hemos enviado un comprobante a tu correo. Tu aporte
                        {donationType && ' mensual'} hará una gran diferencia.
                    </p>
                    <PpxButton data={pagoPluxData} visible={true} />
                </div>
            )}

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
