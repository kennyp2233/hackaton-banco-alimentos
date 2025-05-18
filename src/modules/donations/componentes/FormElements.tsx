// src/modules/donations/componentes/FormElements.tsx
import React from 'react';
import { Field, ErrorMessage } from 'formik';
import { motion } from 'framer-motion';

/**
 * Componente InputField - Campo de entrada personalizado con manejo de errores
 */
export const InputField = ({
    label,
    name,
    type = 'text',
    placeholder = '',
    required = false,
    ...props
}: {
    label: string;
    name: string;
    type?: string;
    placeholder?: string;
    required?: boolean;
    [x: string]: any;
}) => (
    <div className="mb-4">
        <label htmlFor={name} className="block text-gray-700 font-medium mb-2">
            {label}{required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <Field
            id={name}
            name={name}
            type={type}
            placeholder={placeholder}
            className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary input-focus-contrast"
            {...props}
        />
        <ErrorMessage
            name={name}
            component="p"
            className="text-red-500 text-sm mt-1"
        />
    </div>
);

/**
 * Componente TextareaField - Campo de texto multilínea con manejo de errores
 */
export const TextareaField = ({
    label,
    name,
    placeholder = '',
    rows = 4,
    required = false,
    ...props
}: {
    label: string;
    name: string;
    placeholder?: string;
    rows?: number;
    required?: boolean;
    [x: string]: any;
}) => (
    <div className="mb-4">
        <label htmlFor={name} className="block text-gray-700 font-medium mb-2">
            {label}{required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <Field
            as="textarea"
            id={name}
            name={name}
            placeholder={placeholder}
            rows={rows}
            className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary input-focus-contrast"
            {...props}
        />
        <ErrorMessage
            name={name}
            component="p"
            className="text-red-500 text-sm mt-1"
        />
    </div>
);

/**
 * Componente CheckboxField - Campo de checkbox con manejo de errores
 */
export const CheckboxField = ({
    name,
    children,
    ...props
}: {
    name: string;
    children: React.ReactNode;
    [x: string]: any;
}) => (
    <div className="mb-4">
        <label className="flex items-start">
            <Field
                type="checkbox"
                name={name}
                className="mt-1 h-5 w-5 text-primary border-gray-300 rounded focus:ring-primary"
                {...props}
            />
            <span className="ml-2 text-sm text-gray-600">
                {children}
            </span>
        </label>
        <ErrorMessage
            name={name}
            component="p"
            className="text-red-500 text-sm mt-1"
        />
    </div>
);

/**
 * Componente RadioField - Grupo de radio buttons con manejo de errores
 */
export const RadioField = ({
    label,
    name,
    options = [],
    required = false,
    ...props
}: {
    label: string;
    name: string;
    options?: Array<{ value: string; label: string }>;
    required?: boolean;
    [x: string]: any;
}) => (
    <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">
            {label}{required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <div className="space-y-2">
            {options.map((option) => (
                <label key={option.value} className="flex items-center">
                    <Field
                        type="radio"
                        name={name}
                        value={option.value}
                        className="h-5 w-5 text-primary border-gray-300 focus:ring-primary"
                        {...props}
                    />
                    <span className="ml-2 text-base text-gray-700">{option.label}</span>
                </label>
            ))}
        </div>
        <ErrorMessage
            name={name}
            component="p"
            className="text-red-500 text-sm mt-1"
        />
    </div>
);

/**
 * Componente SelectField - Campo de selección con manejo de errores
 */
export const SelectField = ({
    label,
    name,
    options = [],
    placeholder = 'Seleccionar...',
    required = false,
    ...props
}: {
    label: string;
    name: string;
    options?: Array<{ value: string; label: string }>;
    placeholder?: string;
    required?: boolean;
    [x: string]: any;
}) => (
    <div className="mb-4">
        <label htmlFor={name} className="block text-gray-700 font-medium mb-2">
            {label}{required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <Field
            as="select"
            id={name}
            name={name}
            className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary input-focus-contrast"
            {...props}
        >
            <option value="">{placeholder}</option>
            {options.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </Field>
        <ErrorMessage
            name={name}
            component="p"
            className="text-red-500 text-sm mt-1"
        />
    </div>
);

/**
 * Componente AmountSelector - Selector de montos con botones y campo personalizado
 */
export const AmountSelector = ({
    name,
    customAmountName,
    amounts = [10, 25, 50, 100],
    selectedAmount,
    onAmountSelect,
    onCustomAmountChange,
    customAmount = '',
    ...props
}: {
    name: string;
    customAmountName: string;
    amounts?: number[];
    selectedAmount: number | null;
    onAmountSelect: (amount: number) => void;
    onCustomAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    customAmount?: string;
    [x: string]: any;
}) => {
    return (
        <div className="mb-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {amounts.map((amount) => (
                    <motion.button
                        key={amount}
                        type="button"
                        className={`
              py-4 px-4 rounded-lg border-2 font-bold text-lg transition-all
              ${selectedAmount === amount
                                ? 'bg-primary text-white border-primary shadow-md'
                                : 'bg-white text-gray-700 border-gray-300 hover:border-primary hover:text-primary'}
            `}
                        onClick={() => onAmountSelect(amount)}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        ${amount}
                    </motion.button>
                ))}
            </div>

            <div className="relative">
                <div className="flex items-center">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500 text-xl">$</span>
                    <Field
                        name={customAmountName}
                        type="text"
                        placeholder="Otro monto"
                        value={customAmount}
                        onChange={onCustomAmountChange}
                        className="w-full pl-10 pr-4 py-4 text-lg border-2 rounded-lg focus:outline-none input-focus-contrast border-gray-300 focus:border-primary"
                        {...props}
                    />
                </div>
                <ErrorMessage name={customAmountName} component="p" className="text-red-500 text-sm mt-1" />
                <ErrorMessage name={name} component="p" className="text-red-500 text-sm mt-1" />
            </div>
        </div>
    );
};

/**
 * Componente FormButton - Botón estilizado para formularios
 */
export const FormButton = ({
    children,
    type = 'button',
    variant = 'primary',
    isLoading = false,
    disabled = false,
    ...props
}: {
    children: React.ReactNode;
    type?: 'button' | 'submit' | 'reset';
    variant?: 'primary' | 'secondary' | 'outline' | 'danger';
    isLoading?: boolean;
    disabled?: boolean;
    [key: string]: any;
}) => {
    // Clases base para el botón
    const baseClasses = "font-bold py-3 px-6 rounded-lg transition-colors";

    // Variantes de estilo
    const variants = {
        primary: "bg-primary hover:bg-primary/90 text-white",
        secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800",
        outline: "bg-white border-2 border-primary text-primary hover:bg-primary/5",
        danger: "bg-red-600 hover:bg-red-700 text-white",
    };

    // Clases cuando está deshabilitado
    const disabledClasses = "opacity-50 cursor-not-allowed";

    return (
        <motion.button
            type={type}
            className={`
        ${baseClasses} 
        ${variants[variant]} 
        ${(disabled || isLoading) ? disabledClasses : ''}
      `}
            disabled={disabled || isLoading}
            whileHover={!disabled && !isLoading ? { scale: 1.05 } : {}}
            whileTap={!disabled && !isLoading ? { scale: 0.98 } : {}}
            {...props}
        >
            {isLoading ? (
                <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Procesando...
                </div>
            ) : children}
        </motion.button>
    );
};

/**
 * Componente PaymentMethodSelector - Selector de método de pago
 */
export const PaymentMethodSelector = ({
    name,
    value,
    onChange
}: {
    name: string;
    value: string;
    onChange: (name: string, value: string) => void;
}) => {
    const methods = [
        {
            id: 'card',
            label: 'Tarjeta',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
            )
        },
        {
            id: 'paypal',
            label: 'PayPal',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
                </svg>
            )
        },
        {
            id: 'transfer',
            label: 'Transferencia',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                </svg>
            )
        }
    ];

    return (
        <div className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {methods.map((method) => (
                    <motion.button
                        key={method.id}
                        type="button"
                        className={`
              py-4 px-4 rounded-lg border-2 font-medium transition-all flex items-center justify-center
              ${value === method.id
                                ? 'bg-primary/10 text-primary border-primary'
                                : 'bg-white text-gray-700 border-gray-300 hover:border-primary hover:text-primary'}
            `}
                        onClick={() => onChange(name, method.id)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        {method.icon}
                        {method.label}
                    </motion.button>
                ))}
            </div>
            <ErrorMessage name={name} component="p" className="text-red-500 text-sm mt-1" />
        </div>
    );
};

export default {
    InputField,
    TextareaField,
    CheckboxField,
    RadioField,
    SelectField,
    AmountSelector,
    FormButton,
    PaymentMethodSelector
};