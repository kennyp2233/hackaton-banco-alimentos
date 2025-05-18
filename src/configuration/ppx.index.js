// src/configuration/ppx.index.js
// Funciones para inicializar y recargar el componente de pago PagoPlux

/**
 * Inicializa el procesador de pagos PagoPlux con los datos enviados
 * @param {Object} dataPago - Datos de configuración para el pago
 */
const iniciarDatos = (dataPago) => {
    if (typeof Data !== 'undefined') {
        Data.init(dataPago);
        // Activar el botón de pago después de inicializar
        simulateButtonClick();
    } else {
        console.error("El objeto Data de PagoPlux no está disponible. Asegúrese de que los scripts están cargados correctamente.");
    }
};

/**
 * Recarga el procesador de pagos con nuevos datos
 * @param {Object} data - Nuevos datos de configuración para el pago
 */
const reload = (data) => {
    if (typeof Data !== 'undefined') {
        Data.reload(data);
    } else {
        console.error("El objeto Data de PagoPlux no está disponible para recargar.");
    }
};

/**
 * Simula un clic en el botón de pago para activar el popup de PagoPlux
 * Se debe llamar después de inicializar los datos
 */
const simulateButtonClick = () => {
    setTimeout(() => {
        const payButton = document.getElementById('pay');
        if (payButton) {
            payButton.click();
        } else {
            console.error("El botón de pago no está disponible en el DOM.");
        }
    }, 300); // Pequeño delay para asegurar que todo está cargado
};

/**
 * Obtiene un código generado aleatorio para cifrado
 * @param {number} size - Tamaño del código generado
 * @returns {string} - Código generado
 */
const getGenerado = (size = 32) => {
    const caracteres = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let codigo = '';
    let length = caracteres.length;
    if (size <= 10) {
        length = 10;
    }
    while (codigo.length < size) {
        codigo += caracteres[Math.floor(Math.random() * length)];
    }
    return codigo;
};

// Exportamos las funciones para usar en componentes
export { iniciarDatos, reload, getGenerado };