// src/configuration/ppx.data.js
// Configuración básica para PagoPlux - Será personalizada antes de cada pago

let data = {
    /* Requerido. Email de la cuenta PagoPlux del Establecimiento */
    PayboxRemail: "abautista@pagoplux.com",

    /* Requerido. Email del usuario que realiza el pago - Se actualiza dinámicamente */
    PayboxSendmail: "",

    /* Requerido. Nombre del establecimiento en PagoPlux */
    PayboxRename: "Banco de Alimentos Quito",

    /* Requerido. Nombre del usuario que realiza el pago - Se actualiza dinámicamente */
    PayboxSendname: "",

    /* Requerido. Monto total de productos o servicios que no aplican impuestos */
    PayboxBase0: "0.00",

    /* Requerido. Monto total de productos o servicios que aplican impuestos, incluye impuesto */
    PayboxBase12: "0.00",

    /* Requerido. Descripción del pago */
    PayboxDescription: "Donación - Banco de Alimentos Quito",

    /* Requerido Tipo de Ejecución: false para pruebas */
    PayboxProduction: false,

    /* Requerido Ambiente de ejecución: sandbox para pruebas */
    PayboxEnvironment: "sandbox",

    /* Requerido. Lenguaje del Paybox */
    PayboxLanguage: "es",

    /* Requerido. Identifica el tipo de iframe de pagoplux */
    PayboxPagoPlux: true,

    /* Requerido. dirección del tarjetahabiente - Se actualiza dinámicamente */
    PayboxDirection: "",

    /* Requerido. Teléfono del tarjetahabiente - Se actualiza dinámicamente */
    PayBoxClientPhone: "",

    /* Requerido. Identificación del tarjetahabiente - Se actualiza dinámicamente */
    PayBoxClientIdentification: "",

    /* Configuración para pagos recurrentes - Por defecto no es recurrente */
    PayboxRecurrent: false,

    /* Función que se ejecuta cuando el pago se completa */
    onAuthorize: (response) => {
        if (response.status === "succeeded") {
            console.log("Transacción exitosa:", response);
            // El manejo específico de la respuesta se implementará 
            // en el componente que usa esta configuración
        }
    }
};

export { data };