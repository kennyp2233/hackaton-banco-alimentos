import { FC, ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'text';
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
    isLoading?: boolean;
}

const Button: FC<ButtonProps> = ({
    children,
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    isLoading = false,
    className = '',
    disabled,
    ...props
}) => {
    // Base classes
    const baseClasses = 'font-bold rounded-lg transition-all';

    // Variant classes
    const variantClasses = {
        primary: 'bg-primary hover:bg-primary/90 text-white',
        secondary: 'bg-white hover:bg-gray-100 text-primary border border-primary',
        outline: 'bg-transparent hover:bg-gray-100 text-gray-800 border border-gray-300',
        text: 'bg-transparent hover:bg-gray-100 text-primary',
    };

    // Size classes
    const sizeClasses = {
        sm: 'text-sm py-2 px-4',
        md: 'py-3 px-6',
        lg: 'text-lg py-4 px-8',
    };

    // Width class
    const widthClass = fullWidth ? 'w-full' : '';

    // Disabled class
    const disabledClass = (disabled || isLoading) ? 'opacity-60 cursor-not-allowed' : '';

    return (
        <button
            className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${widthClass}
        ${disabledClass}
        ${className}
      `}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? (
                <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Cargando...
                </div>
            ) : children}
        </button>
    );
};

export default Button;