// src/modules/emergency/services/emergencyService.ts
import { useState } from 'react';
import { IMAGES } from '@/shared/config/constants';

// Interfaces de datos
export interface Emergency {
    id: string;
    title: string;
    description: string;
    longDescription?: string;
    imageUrl: string;
    galleryImages?: string[];
    target: number;
    raised: number;
    daysLeft: number;
    beneficiaries: number;
    critical: boolean;
    updates?: {
        date: string;
        title: string;
        content: string;
    }[];
}

export interface EmergencyListResponse {
    emergencies: Emergency[];
    total: number;
}

// Datos centralizados para todas las emergencias
const EMERGENCIES_DATA: Emergency[] = [
    {
        id: 'em-001',
        title: 'Emergencia por deslizamiento en el sur de Quito',
        description: 'Tras fuertes lluvias en el sur de Quito, varias familias han perdido sus hogares y pertenencias. Estamos trabajando para proporcionar alimentos y suministros básicos a más de 120 personas afectadas.',
        longDescription: `
      <p>El pasado fin de semana, intensas lluvias provocaron deslizamientos de tierra en varios barrios del sur de Quito, afectando gravemente a comunidades vulnerables que ya enfrentaban dificultades económicas.</p>
      
      <p>Las autoridades locales han establecido tres albergues temporales, pero los recursos son limitados. El Banco de Alimentos de Quito está coordinando la respuesta alimentaria para asegurar que todas las familias afectadas reciban tres comidas nutritivas al día durante al menos las próximas dos semanas.</p>
      
      <p>Tu donación contribuirá directamente a:</p>
      <ul>
        <li>Proporcionar alimentos para 120 personas durante las próximas 2 semanas</li>
        <li>Adquirir productos frescos para complementar las donaciones existentes</li>
        <li>Cubrir costos logísticos de transporte y distribución diaria</li>
        <li>Apoyar la instalación de una cocina comunitaria en el albergue principal</li>
      </ul>
      
      <p>La situación es crítica y los próximos días son fundamentales para la recuperación de estas familias. Con tu ayuda, podemos garantizar que al menos sus necesidades alimentarias estén cubiertas mientras buscan soluciones para reconstruir sus hogares.</p>
    `,
        imageUrl: IMAGES.emergencies.landslide,
        galleryImages: IMAGES.emergencies.landslideGallery,
        target: 10000,
        raised: 6500,
        daysLeft: 3,
        beneficiaries: 120,
        critical: true,
        updates: [
            {
                date: '2025-05-15',
                title: 'Primer envío de alimentos entregado',
                content: 'Hoy entregamos el primer cargamento de alimentos a los tres albergues. Gracias a las donaciones recibidas, pudimos proporcionar alimentos para 3 días.',
            },
            {
                date: '2025-05-16',
                title: 'Instalación de cocina comunitaria',
                content: 'Se ha comenzado la instalación de una cocina comunitaria en el albergue principal para facilitar la preparación de alimentos calientes.',
            },
        ],
    },
    {
        id: 'em-002',
        title: 'Apoyo alimentario para familias en albergue temporal',
        description: 'Más de 45 familias se encuentran en un albergue temporal tras haber sido desalojadas. Necesitamos tu ayuda para proporcionarles alimentos durante las próximas semanas.',
        longDescription: `
      <p>Un grupo de 45 familias (aproximadamente 180 personas) han sido recientemente desalojadas de sus viviendas y se encuentran temporalmente en un albergue municipal.</p>
      
      <p>Estas familias, muchas con niños pequeños y adultos mayores, necesitan apoyo alimentario urgente mientras se resuelve su situación habitacional.</p>
      
      <p>El Banco de Alimentos de Quito está coordinando:</p>
      <ul>
        <li>La entrega diaria de alimentos frescos y no perecederos</li>
        <li>Apoyo para la preparación de alimentos en el albergue</li>
        <li>Suministro de productos específicos para dietas especiales (bebés, personas mayores, etc.)</li>
      </ul>
      
      <p>Con tu ayuda podemos asegurar que estas familias tengan acceso a alimentos nutritivos durante este difícil periodo de transición.</p>
    `,
        imageUrl: IMAGES.emergencies.shelter,
        target: 5000,
        raised: 2300,
        daysLeft: 7,
        beneficiaries: 180,
        critical: false,
    },
    {
        id: 'em-003',
        title: 'Ayuda tras inundaciones en zonas rurales de Pichincha',
        description: 'Las recientes inundaciones han afectado gravemente a comunidades rurales cerca de Quito. Estamos coordinando la entrega de alimentos a áreas de difícil acceso.',
        longDescription: `
      <p>Las fuertes lluvias de la última semana han causado inundaciones significativas en varias comunidades rurales de la provincia de Pichincha, dejando aproximadamente a 90 personas sin acceso a alimentos y servicios básicos.</p>
      
      <p>Los caminos de acceso están dañados, lo que complica la llegada de ayuda. El Banco de Alimentos de Quito ha organizado un operativo especial para:</p>
      
      <ul>
        <li>Transportar alimentos no perecederos a zonas de difícil acceso</li>
        <li>Establecer puntos de distribución en comunidades afectadas</li>
        <li>Proporcionar kits de emergencia con alimentos para 2 semanas</li>
      </ul>
      
      <p>Tu donación ayudará a cubrir los costos logísticos excepcionales y la adquisición de alimentos adicionales para estas comunidades aisladas.</p>
    `,
        imageUrl: IMAGES.emergencies.floods,
        target: 8000,
        raised: 1800,
        daysLeft: 5,
        beneficiaries: 90,
        critical: true,
    }
];

// Hook personalizado para el servicio de emergencias
export const useEmergencyService = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Función para obtener todas las emergencias activas
    const getActiveEmergencies = async (): Promise<EmergencyListResponse> => {
        setIsLoading(true);
        setError(null);

        try {
            // En producción, aquí realizaríamos una llamada a la API real
            // Simulamos un delay para el hackathon
            await new Promise(resolve => setTimeout(resolve, 800));

            return {
                emergencies: EMERGENCIES_DATA,
                total: EMERGENCIES_DATA.length
            };
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'Error al obtener emergencias';
            setError(errorMsg);
            return {
                emergencies: [],
                total: 0
            };
        } finally {
            setIsLoading(false);
        }
    };

    // Función para obtener una emergencia específica por ID
    const getEmergencyById = async (id: string): Promise<Emergency | null> => {
        setIsLoading(true);
        setError(null);

        try {
            // En producción, aquí realizaríamos una llamada a la API real
            // Simulamos un delay para el hackathon
            await new Promise(resolve => setTimeout(resolve, 800));

            // Buscar la emergencia por ID
            const emergency = EMERGENCIES_DATA.find(e => e.id === id);

            if (!emergency) {
                throw new Error('Emergencia no encontrada');
            }

            return emergency;
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'Error al obtener la emergencia';
            setError(errorMsg);
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    // Función para obtener las emergencias críticas (para el banner de alerta)
    const getCriticalEmergencies = async (): Promise<Emergency[]> => {
        setIsLoading(true);
        setError(null);

        try {
            // En producción, aquí realizaríamos una llamada a la API real
            // Simulamos un delay para el hackathon
            await new Promise(resolve => setTimeout(resolve, 500));

            // Filtramos solo las emergencias críticas
            const criticalEmergencies = EMERGENCIES_DATA.filter(emergency => emergency.critical);

            return criticalEmergencies;
        } catch (err) {
            setError('Error al obtener emergencias críticas');
            return [];
        } finally {
            setIsLoading(false);
        }
    };

    return {
        isLoading,
        error,
        getActiveEmergencies,
        getEmergencyById,
        getCriticalEmergencies
    };
};

export default useEmergencyService;