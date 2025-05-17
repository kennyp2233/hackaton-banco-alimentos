import { FC, useState } from 'react';
import Button from '@/shared/components/common/Button';
import { motion } from 'framer-motion';

interface DonationFormProps {
    isRecurring?: boolean;
}

const DonationForm: FC<DonationFormProps> = ({ isRecurring = false }) => {
    // Donation amount options
    const amountOptions = [10, 25, 50, 100];

    // Form state
    const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
    const [customAmount, setCustomAmount] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [paymentMethod, setPaymentMethod] = useState<string>('card');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    // Custom amount handler
    const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // Only allow numbers and decimal point
        if (/^\d*\.?\d*$/.test(value) || value === '') {
            setCustomAmount(value);
            setSelectedAmount(null);
        }
    };

    // Selected amount handler
    const handleAmountSelect = (amount: number) => {
        setSelectedAmount(amount);
        setCustomAmount('');
    };

    // Get final amount (selected or custom)
    const getFinalAmount = (): number => {
        if (selectedAmount !== null) {
            return selectedAmount;
        }

        return customAmount ? parseFloat(customAmount) : 0;
    };

    // Form submission handler
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const finalAmount = getFinalAmount();

        if (finalAmount <= 0) {
            alert('Por favor selecciona o ingresa un monto válido');
            return;
        }

        if (!name || !email) {
            alert('Por favor completa todos los campos requeridos');
            return;
        }

        setIsSubmitting(true);

        try {
            // Here you would integrate with your payment gateway
            // For this example, we'll simulate a successful payment after a delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Redirect to success page or show success message
            alert(`¡Gracias por tu donación de $${finalAmount}!`);

            // Reset form (in a real app, you might redirect instead)
            setSelectedAmount(null);
            setCustomAmount('');
            setName('');
            setEmail('');
        } catch (error) {
            console.error('Error processing donation:', error);
            alert('Hubo un error al procesar tu donación. Por favor intenta nuevamente.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl shadow-xl p-6 md:p-8"
        >
            <h2 className="text-2xl font-bold mb-6 text-center">
                {isRecurring ? 'Donación Mensual' : 'Donación Única'}
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
                            placeholder="Otro monto"
                            value={customAmount}
                            onChange={handleCustomAmountChange}
                            className="w-full pl-8 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                        />
                    </div>

                    {isRecurring && (
                        <p className="mt-2 text-sm text-gray-500">
                            Tu donación se procesará automáticamente cada mes. Puedes cancelar en cualquier momento.
                        </p>
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
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                            Correo electrónico:
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                        />
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
                ${paymentMethod === 'card'
                                    ? 'bg-primary/10 text-primary border-primary'
                                    : 'bg-white text-gray-700 border-gray-300 hover:border-primary hover:text-primary'}
              `}
                            onClick={() => setPaymentMethod('card')}
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
                ${paymentMethod === 'paypal'
                                    ? 'bg-primary/10 text-primary border-primary'
                                    : 'bg-white text-gray-700 border-gray-300 hover:border-primary hover:text-primary'}
              `}
                            onClick={() => setPaymentMethod('paypal')}
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
                ${paymentMethod === 'transfer'
                                    ? 'bg-primary/10 text-primary border-primary'
                                    : 'bg-white text-gray-700 border-gray-300 hover:border-primary hover:text-primary'}
              `}
                            onClick={() => setPaymentMethod('transfer')}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                            </svg>
                            Transferencia
                        </button>
                    </div>
                </div>

                {/* Submit Button */}
                <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    fullWidth
                    isLoading={isSubmitting}
                >
                    {isRecurring
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