// src/modules/admin/types/index.ts

export interface UserData {
    id: string;
    nombres: string;
    apellidos: string;
    cedula: string;
    fechaNacimiento: string;
    direccion: string;
    ciudad: string;
    provincia: string;
    telefono: string;
    correo: string;
    donaciones: Donation[];
}

export interface Donation {
    id: string;
    fecha: string;
    monto: number;
    metodo: 'tarjeta' | 'transferencia' | 'efectivo';
    estado: 'completado' | 'pendiente' | 'fallido';
    recurrente: boolean;
}

// Tipos de estadísticas
export interface MonthlyDonationStats {
    mes: string;
    totalDonaciones: number;
    cantidadDonaciones: number;
}

export interface TopDonorStats {
    userId: string;
    nombres: string;
    apellidos: string;
    totalDonado: number;
    cantidadDonaciones: number;
}