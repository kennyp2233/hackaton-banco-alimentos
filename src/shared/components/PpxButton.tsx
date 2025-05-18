import { useEffect } from 'react';
import { iniciarDatos } from '@/configuration/ppx.index';

/**
 * Componente PpxButton para integrar el botón de pagos de PagoPlux
 * 
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.data - Datos de configuración para PagoPlux
 * @param {boolean} props.visible - Si el botón debe ser visible o no
 */
const PpxButton = ({ data, visible = false }: { data: object; visible: boolean; }) => {
    // Estilos para el botón de pago
    const buttonStyle = {
        display: visible ? "block" : "none",
        backgroundColor: "#FAFAFA",
        right: "80px",
        backgroundImage: "url(https://sandbox-paybox.pagoplux.com/img/pagar.png?v1)",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        height: "96px",
        width: "215px",
        border: "none",
        cursor: "pointer",
        backgroundSize: "contain",
        outline: "0",
        boxShadow: "0px 2px 2px lightgray",
    };

    // Inicializar datos de PagoPlux cuando el componente se monta o los datos cambian
    useEffect(() => {
        if (data) {
            iniciarDatos(data);
        }
    }, [data]);

    return (
        <>
            {/* Contenedor para el modal de PagoPlux */}
            <div id="modalPaybox"></div>

            {/* Botón que activará el procesador de pagos */}
            <button
                style={buttonStyle}
                id="pay"
                type="button"
                aria-label="Pagar con PagoPlux"
            />
        </>
    );
};

export default PpxButton;