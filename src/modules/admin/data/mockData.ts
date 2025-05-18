// src/modules/admin/data/mockData.ts
import { UserData, MonthlyDonationStats, TopDonorStats } from '../types';

// Datos de usuarios de ejemplo
export const mockUsers: UserData[] = [
    {
        id: '1',
        nombres: 'Juan Carlos',
        apellidos: 'Pérez Gómez',
        cedula: '1712345678',
        fechaNacimiento: '1985-06-12',
        direccion: 'Av. Amazonas N36-152',
        ciudad: 'Quito',
        provincia: 'Pichincha',
        telefono: '0991234567',
        correo: 'jcperez@example.com',
        donaciones: [
            { id: 'd1', fecha: '2025-04-15', monto: 50, metodo: 'tarjeta', estado: 'completado', recurrente: true },
            { id: 'd2', fecha: '2025-03-15', monto: 50, metodo: 'tarjeta', estado: 'completado', recurrente: true },
            { id: 'd3', fecha: '2025-02-15', monto: 50, metodo: 'tarjeta', estado: 'completado', recurrente: true },
            { id: 'd4', fecha: '2025-01-15', monto: 50, metodo: 'tarjeta', estado: 'completado', recurrente: true }
        ]
    },
    {
        id: '2',
        nombres: 'María Fernanda',
        apellidos: 'Rodríguez Torres',
        cedula: '1798765432',
        fechaNacimiento: '1990-03-25',
        direccion: 'Calle La Niña E4-45',
        ciudad: 'Quito',
        provincia: 'Pichincha',
        telefono: '0987654321',
        correo: 'mfrodriguez@example.com',
        donaciones: [
            { id: 'd5', fecha: '2025-04-10', monto: 100, metodo: 'tarjeta', estado: 'completado', recurrente: false },
            { id: 'd6', fecha: '2025-03-05', monto: 75, metodo: 'transferencia', estado: 'completado', recurrente: false }
        ]
    },
    {
        id: '3',
        nombres: 'Luis Alberto',
        apellidos: 'Sánchez Vega',
        cedula: '0603214567',
        fechaNacimiento: '1978-11-30',
        direccion: 'Av. 6 de Diciembre N25-67',
        ciudad: 'Quito',
        provincia: 'Pichincha',
        telefono: '0998876543',
        correo: 'lasanchez@example.com',
        donaciones: [
            { id: 'd7', fecha: '2025-04-20', monto: 200, metodo: 'transferencia', estado: 'completado', recurrente: false },
            { id: 'd8', fecha: '2025-02-18', monto: 150, metodo: 'transferencia', estado: 'completado', recurrente: false },
            { id: 'd9', fecha: '2025-01-15', monto: 200, metodo: 'transferencia', estado: 'completado', recurrente: false }
        ]
    },
    {
        id: '4',
        nombres: 'Ana Cristina',
        apellidos: 'Morales Díaz',
        cedula: '1756789012',
        fechaNacimiento: '1992-07-08',
        direccion: 'Calle Juan León Mera N16-34',
        ciudad: 'Quito',
        provincia: 'Pichincha',
        telefono: '0993456789',
        correo: 'acmorales@example.com',
        donaciones: [
            { id: 'd10', fecha: '2025-04-05', monto: 30, metodo: 'tarjeta', estado: 'completado', recurrente: true },
            { id: 'd11', fecha: '2025-03-05', monto: 30, metodo: 'tarjeta', estado: 'completado', recurrente: true },
            { id: 'd12', fecha: '2025-02-05', monto: 30, metodo: 'tarjeta', estado: 'completado', recurrente: true },
            { id: 'd13', fecha: '2025-01-05', monto: 30, metodo: 'tarjeta', estado: 'completado', recurrente: true },
            { id: 'd14', fecha: '2024-12-05', monto: 30, metodo: 'tarjeta', estado: 'completado', recurrente: true }
        ]
    },
    {
        id: '5',
        nombres: 'Carlos Eduardo',
        apellidos: 'Valencia Luna',
        cedula: '0908123456',
        fechaNacimiento: '1983-05-17',
        direccion: 'Calle Reina Victoria N24-58',
        ciudad: 'Quito',
        provincia: 'Pichincha',
        telefono: '0998123456',
        correo: 'cevalencia@example.com',
        donaciones: [
            { id: 'd15', fecha: '2025-04-25', monto: 500, metodo: 'transferencia', estado: 'completado', recurrente: false }
        ]
    }
];

// Estadísticas mensuales (último semestre)
export const monthlyDonationStats: MonthlyDonationStats[] = [
    { mes: 'Noviembre', totalDonaciones: 1200, cantidadDonaciones: 45 },
    { mes: 'Diciembre', totalDonaciones: 2350, cantidadDonaciones: 78 },
    { mes: 'Enero', totalDonaciones: 1850, cantidadDonaciones: 60 },
    { mes: 'Febrero', totalDonaciones: 1650, cantidadDonaciones: 52 },
    { mes: 'Marzo', totalDonaciones: 2100, cantidadDonaciones: 65 },
    { mes: 'Abril', totalDonaciones: 2560, cantidadDonaciones: 80 }
];

// Estadísticas por método de pago
export const paymentMethodStats = [
    { metodo: 'Tarjeta', porcentaje: 65, cantidad: 247 },
    { metodo: 'Transferencia', porcentaje: 30, cantidad: 114 },
    { metodo: 'Efectivo', porcentaje: 5, cantidad: 19 }
];

// Top donantes
export const topDonorStats: TopDonorStats[] = [
    { userId: '5', nombres: 'Carlos Eduardo', apellidos: 'Valencia Luna', totalDonado: 500, cantidadDonaciones: 1 },
    { userId: '3', nombres: 'Luis Alberto', apellidos: 'Sánchez Vega', totalDonado: 550, cantidadDonaciones: 3 },
    { userId: '2', nombres: 'María Fernanda', apellidos: 'Rodríguez Torres', totalDonado: 175, cantidadDonaciones: 2 },
    { userId: '1', nombres: 'Juan Carlos', apellidos: 'Pérez Gómez', totalDonado: 200, cantidadDonaciones: 4 },
    { userId: '4', nombres: 'Ana Cristina', apellidos: 'Morales Díaz', totalDonado: 150, cantidadDonaciones: 5 }
];

// Distribución por provincia
export const provinciaStats = [
    { provincia: 'Pichincha', cantidad: 250, porcentaje: 65 },
    { provincia: 'Guayas', cantidad: 80, porcentaje: 21 },
    { provincia: 'Azuay', cantidad: 25, porcentaje: 7 },
    { provincia: 'Manabí', cantidad: 15, porcentaje: 4 },
    { provincia: 'Otras', cantidad: 10, porcentaje: 3 }
];