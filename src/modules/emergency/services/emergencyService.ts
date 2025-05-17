// Este servicio gestionaría todas las interacciones con la API para las emergencias
import { useState } from 'react';

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

            // Datos simulados para el hackathon
            const emergencies: Emergency[] = [
                {
                    id: 'em-001',
                    title: 'Emergencia por deslizamiento en el sur de Quito',
                    description: 'Tras fuertes lluvias en el sur de Quito, varias familias han perdido sus hogares y pertenencias. Estamos trabajando para proporcionar alimentos y suministros básicos a más de 120 personas afectadas.',
                    imageUrl: '/images/emergencies/landslide.jpg',
                    target: 10000,
                    raised: 6500,
                    daysLeft: 3,
                    beneficiaries: 120,
                    critical: true,
                },
                {
                    id: 'em-002',
                    title: 'Apoyo alimentario para familias en albergue temporal',
                    description: 'Más de 45 familias se encuentran en un albergue temporal tras haber sido desalojadas. Necesitamos tu ayuda para proporcionarles alimentos durante las próximas semanas.',
                    imageUrl: '/images/emergencies/shelter.jpg',
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
                    imageUrl: '/images/emergencies/floods.jpg',
                    target: 8000,
                    raised: 1800,
                    daysLeft: 5,
                    beneficiaries: 90,
                    critical: true,
                },
            ];

            return {
                emergencies,
                total: emergencies.length
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

            // Buscar en datos simulados para el hackathon
            const emergency = {
                id: 'em-001',
                title: 'Emergencia por deslizamiento en el sur de Quito',
                description: 'Tras fuertes lluvias en el sur de Quito, varias familias han perdido sus hogares y pertenencias. Estamos trabajando para proporcionar alimentos y suministros básicos a más de 120 personas afectadas, muchas de ellas niños y adultos mayores que se encuentran en albergues temporales.',
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
                imageUrl: '/images/emergencies/landslide.jpg',
                galleryImages: [
                    '/images/emergencies/landslide-1.jpg',
                    '/images/emergencies/landslide-2.jpg',
                    '/images/emergencies/landslide-3.jpg',
                ],
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
            };

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

            // Datos simulados para el hackathon - solo retornamos las emergencias críticas
            const criticalEmergencies: Emergency[] = [
                {
                    id: 'em-001',
                    title: 'Emergencia por deslizamiento en el sur de Quito',
                    description: 'Tras fuertes lluvias en el sur de Quito, varias familias han perdido sus hogares y pertenencias.',
                    imageUrl: '/images/emergencies/landslide.jpg',
                    target: 10000,
                    raised: 6500,
                    daysLeft: 3,
                    beneficiaries: 120,
                    critical: true,
                },
                {
                    id: 'em-003',
                    title: 'Ayuda tras inundaciones en zonas rurales de Pichincha',
                    description: 'Las recientes inundaciones han afectado gravemente a comunidades rurales cerca de Quito.',
                    imageUrl: '/images/emergencies/floods.jpg',
                    target: 8000,
                    raised: 1800,
                    daysLeft: 5,
                    beneficiaries: 90,
                    critical: true,
                },
            ];

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