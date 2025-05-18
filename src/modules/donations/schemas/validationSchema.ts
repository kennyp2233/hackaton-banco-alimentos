// src/modules/donations/schemas/validationSchema.ts
import * as Yup from 'yup';
import { DONATION_AMOUNTS } from '@/shared/config/constants';

/**
 * Esquema de validación para el formulario de donación
 * Utiliza Yup para definir las reglas de validación
 */
export const DonationSchema = Yup.object().shape({
    // Validación del monto de donación
    amount: Yup.number()
        .min(0, 'El monto debe ser un valor positivo')
        .test(
            'is-valid-amount',
            'Por favor selecciona un monto válido',
            function (value) {
                const { customAmount } = this.parent;
                // Si hay un monto personalizado, no es necesario validar el monto preestablecido
                if (customAmount && parseFloat(customAmount) > 0) return true;
                // Si no hay monto personalizado, el monto preestablecido debe ser mayor a 0
                return value !== undefined && value > 0;
            }
        ),

    // Validación del monto personalizado
    customAmount: Yup.string()
        .test(
            'is-valid-custom-amount',
            'El monto debe ser un valor positivo',
            function (value) {
                const { amount } = this.parent;
                // Si ya hay un monto preestablecido seleccionado, no validamos el monto personalizado
                if (amount > 0 && DONATION_AMOUNTS.includes(amount)) return true;
                // Si el campo está vacío y no hay monto preestablecido, es inválido
                if (!value && amount <= 0) return false;
                // Validar que sea un número positivo
                return !value || parseFloat(value) > 0;
            }
        ),

    // Validación de datos personales
    name: Yup.string()
        .required('Por favor ingresa tu nombre completo')
        .min(3, 'El nombre debe tener al menos 3 caracteres')
        .max(100, 'El nombre no puede exceder los 100 caracteres'),

    email: Yup.string()
        .required('Por favor ingresa tu correo electrónico')
        .email('Ingresa un correo electrónico válido'),

    phoneNumber: Yup.string()
        .required('Por favor ingresa tu número de teléfono')
        .matches(
            /^\+?[\d\s-]{7,15}$/,
            'Ingresa un número de teléfono válido (7-15 dígitos)'
        ),

    identification: Yup.string()
        .required('Por favor ingresa tu número de identificación')
        .min(5, 'La identificación debe tener al menos 5 caracteres')
        .test(
            'is-valid-id',
            'Ingresa una identificación válida',
            // Aquí se puede implementar una validación específica para cédulas ecuatorianas
            (value) => !value || value.length >= 5
        ),

    address: Yup.string()
        .required('Por favor ingresa tu dirección')
        .min(5, 'Ingresa una dirección más detallada'),

    // Validación del método de pago
    paymentMethod: Yup.string()
        .required('Por favor selecciona un método de pago')
        .oneOf(['card', 'paypal', 'transfer'], 'Selecciona un método de pago válido'),

    // Validación de términos y condiciones
    termsAccepted: Yup.boolean()
        .oneOf([true], 'Debes aceptar los términos y condiciones')
        .required('Debes aceptar los términos y condiciones'),

    // Campos opcionales
    comments: Yup.string()
        .max(500, 'Los comentarios no pueden exceder los 500 caracteres'),
});

/**
 * Esquema de validación para el primer paso del formulario
 * Sólo valida el monto para permitir avanzar al siguiente paso
 */
export const StepOneSchema = Yup.object().shape({
    amount: Yup.number()
        .test(
            'is-valid-amount',
            'Por favor selecciona un monto válido',
            function (value) {
                const { customAmount } = this.parent;
                if (customAmount && parseFloat(customAmount) > 0) return true;
                return value !== undefined && value > 0;
            }
        ),
    customAmount: Yup.string()
        .test(
            'is-valid-custom-amount',
            'El monto debe ser un valor positivo',
            function (value) {
                const { amount } = this.parent;
                if (amount > 0 && DONATION_AMOUNTS.includes(amount)) return true;
                if (!value && amount <= 0) return false;
                return !value || parseFloat(value) > 0;
            }
        ),
});

/**
 * Esquema de validación para el segundo paso del formulario
 * Valida los datos personales
 */
export const StepTwoSchema = Yup.object().shape({
    name: Yup.string()
        .required('Por favor ingresa tu nombre completo')
        .min(3, 'El nombre debe tener al menos 3 caracteres'),

    email: Yup.string()
        .required('Por favor ingresa tu correo electrónico')
        .email('Ingresa un correo electrónico válido'),

    phoneNumber: Yup.string()
        .required('Por favor ingresa tu número de teléfono')
        .matches(
            /^\+?[\d\s-]{7,15}$/,
            'Ingresa un número de teléfono válido (7-15 dígitos)'
        ),

    identification: Yup.string()
        .required('Por favor ingresa tu número de identificación'),

    address: Yup.string()
        .required('Por favor ingresa tu dirección'),
});

export default DonationSchema;