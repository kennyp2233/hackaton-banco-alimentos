'use client';
import { useEffect } from 'react';
import { iniciarDatos } from '@/configuration/ppx.index';

interface PpxButtonProps {
    data: any;
    visible?: boolean;
}

const PpxButton = ({ data, visible = true }: PpxButtonProps) => {
    useEffect(() => {
        if (data) iniciarDatos(data);
        console.log('Data:', data);
    }, [data]);

    return (
        <div className="flex flex-col items-center gap-2 mt-6">
            <div id="modalPaybox" />
            <button
                id="pay"
                type="submit"
                className={`w-full max-w-xs px-6 py-3 rounded-xl bg-primary text-white text-lg font-semibold shadow-lg hover:bg-primary/90 transition-colors duration-200 flex items-center justify-center gap-2 cursor-pointer ${visible ? '' : 'hidden'
                    }`}
            >
                Donar ahora con tarjeta 💳
            </button>
            <div className="flex gap-3 mt-2 opacity-70">
                {['visa', 'mastercard', 'americanexpress', 'dinersclub', 'discover'].map((brand) => (
                    <img
                        key={brand}
                        src={`https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/${brand}.svg`}
                        alt={brand}
                        className="h-5 w-auto"
                    />
                ))}
            </div>
        </div>
    );
};

export default PpxButton;
