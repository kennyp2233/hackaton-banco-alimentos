import { useState, useEffect } from 'react';
import { DonationFormData } from '../services/donationService';

interface UseDonationFormProps {
  isRecurring: boolean;
  initialAmount?: number;
}

interface UseDonationFormReturn {
  formData: DonationFormData;
  selectedAmount: number | null;
  customAmount: string;
  errors: Record<string, string>;
  handleAmountSelect: (amount: number) => void;
  handleCustomAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePaymentMethodChange: (method: string) => void;
  validateForm: () => boolean;
  resetForm: () => void;
  getFinalAmount: () => number;
}

const useDonationForm = ({ isRecurring, initialAmount = 0 }: UseDonationFormProps): UseDonationFormReturn => {
  // Estado para el monto seleccionado
  const [selectedAmount, setSelectedAmount] = useState<number | null>(initialAmount > 0 ? initialAmount : null);
  const [customAmount, setCustomAmount] = useState<string>('');
  
  // Estado para los datos del formulario
  const [formData, setFormData] = useState<DonationFormData>({
    amount: initialAmount,
    name: '',
    email: '',
    paymentMethod: 'card',
    isRecurring: isRecurring,
    phoneNumber: '',
    address: '',
    comments: ''
  });

  // Estado para los errores de validación
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Actualizar isRecurring cuando cambia la prop
  useEffect(() => {
    setFormData(prev => ({ ...prev, isRecurring }));
  }, [isRecurring]);

  // Manejador para seleccionar un monto predefinido
  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
    setFormData(prev => ({ ...prev, amount }));
    
    // Limpiar error de monto si existe
    if (errors.amount) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.amount;
        return newErrors;
      });
    }
  };

  // Manejador para el monto personalizado
  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Solo permitir números y punto decimal
    if (/^\d*\.?\d*$/.test(value) || value === '') {
      setCustomAmount(value);
      setSelectedAmount(null);
      
      const numValue = value ? parseFloat(value) : 0;
      setFormData(prev => ({ ...prev, amount: numValue }));
      
      // Limpiar error de monto si existe y el valor es válido
      if (errors.amount && numValue > 0) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.amount;
          return newErrors;
        });
      }
    }
  };

  // Manejador para los campos de entrada generales
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Limpiar error si el campo tiene valor
    if (errors[name] && value.trim()) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Manejador para el método de pago
  const handlePaymentMethodChange = (method: string) => {
    setFormData(prev => ({ ...prev, paymentMethod: method }));
  };

  // Obtener el monto final (seleccionado o personalizado)
  const getFinalAmount = (): number => {
    if (selectedAmount !== null) {
      return selectedAmount;
    }
    return customAmount ? parseFloat(customAmount) : 0;
  };

  // Validar el formulario
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Validar monto
    const finalAmount = getFinalAmount();
    if (finalAmount <= 0) {
      newErrors.amount = 'Por favor selecciona o ingresa un monto válido';
    }
    
    // Validar nombre
    if (!formData.name.trim()) {
      newErrors.name = 'Por favor ingresa tu nombre';
    }
    
    // Validar email
    if (!formData.email.trim()) {
      newErrors.email = 'Por favor ingresa tu correo electrónico';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Por favor ingresa un correo electrónico válido';
    }
    
    // Validar teléfono si está presente
    if (formData.phoneNumber && !/^\+?[\d\s-]{7,15}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Por favor ingresa un número de teléfono válido';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Resetear el formulario
  const resetForm = () => {
    setSelectedAmount(null);
    setCustomAmount('');
    setFormData({
      amount: 0,
      name: '',
      email: '',
      paymentMethod: 'card',
      isRecurring,
      phoneNumber: '',
      address: '',
      comments: ''
    });
    setErrors({});
  };

  return {
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
  };
};

export default useDonationForm;