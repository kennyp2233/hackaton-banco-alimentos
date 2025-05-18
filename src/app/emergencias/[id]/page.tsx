'use client';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import PageContainer from '@/shared/layout/PageContainer';
import { motion } from 'framer-motion';

export default function EmergencyPage() {
    // En producción, obtendríamos los datos de la API
    // Simulación de datos para el hackathon
    const emergencyData = {
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

    // Si no se encuentra la emergencia, redirigir a 404
    if (!emergencyData) {
        notFound();
    }

    // Calcular porcentaje de progreso
    const progressPercentage = Math.min(Math.round((emergencyData.raised / emergencyData.target) * 100), 100);

    return (
        <div className="py-12 md:py-16">
            <PageContainer>
                <div className="max-w-4xl mx-auto">
                    {/* Critical badge */}
                    {emergencyData.critical && (
                        <div className="mb-4">
                            <span className="bg-red-600 text-white text-sm font-bold px-4 py-1 rounded-full">
                                Emergencia Crítica • {emergencyData.daysLeft} días restantes
                            </span>
                        </div>
                    )}

                    <motion.h1
                        className="text-3xl md:text-4xl font-bold mb-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        {emergencyData.title}
                    </motion.h1>

                    {/* Main image */}
                    <motion.div
                        className="relative h-80 w-full rounded-xl overflow-hidden mb-8"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <Image
                            src={emergencyData.imageUrl || '/images/emergency-placeholder.jpg'}
                            alt={emergencyData.title}
                            fill
                            className="object-cover"
                        />
                    </motion.div>

                    {/* Main content area */}
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="md:col-span-2">
                            {/* Description */}
                            <motion.div
                                className="bg-white rounded-xl shadow-md p-6 mb-8"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                            >
                                <h2 className="text-xl font-bold mb-4">Acerca de esta emergencia</h2>
                                <p className="text-gray-700 mb-4">{emergencyData.description}</p>
                                <div
                                    className="text-gray-700 space-y-4"
                                    dangerouslySetInnerHTML={{ __html: emergencyData.longDescription }}
                                />
                            </motion.div>

                            {/* Gallery */}
                            {emergencyData.galleryImages && emergencyData.galleryImages.length > 0 && (
                                <motion.div
                                    className="bg-white rounded-xl shadow-md p-6 mb-8"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.4 }}
                                >
                                    <h2 className="text-xl font-bold mb-4">Galería</h2>
                                    <div className="grid grid-cols-3 gap-2">
                                        {emergencyData.galleryImages.map((img, index) => (
                                            <div key={index} className="relative h-24 rounded-lg overflow-hidden">
                                                <Image
                                                    src={img}
                                                    alt={`Imagen ${index + 1} de ${emergencyData.title}`}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {/* Updates */}
                            {emergencyData.updates && emergencyData.updates.length > 0 && (
                                <motion.div
                                    className="bg-white rounded-xl shadow-md p-6"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.5 }}
                                >
                                    <h2 className="text-xl font-bold mb-4">Actualizaciones</h2>
                                    <div className="space-y-4">
                                        {emergencyData.updates.map((update, index) => (
                                            <div key={index} className="border-l-2 border-primary pl-4 ml-2">
                                                <p className="text-sm text-gray-500">{update.date}</p>
                                                <h3 className="font-bold">{update.title}</h3>
                                                <p className="text-gray-700">{update.content}</p>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div>
                            {/* Progress */}
                            <motion.div
                                className="bg-white rounded-xl shadow-md p-6 mb-6"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                            >
                                <div className="mb-4">
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="font-medium">${emergencyData.raised} recaudados</span>
                                        <span className="text-gray-500">Meta: ${emergencyData.target}</span>
                                    </div>
                                    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-primary rounded-full"
                                            style={{ width: `${progressPercentage}%` }}
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2 mb-4">
                                    <div className="bg-amber-100 text-amber-800 text-xs font-medium px-2.5 py-1 rounded">
                                        {emergencyData.daysLeft} días restantes
                                    </div>
                                    <div className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded">
                                        {emergencyData.beneficiaries} beneficiarios
                                    </div>
                                </div>

                                <button className="w-full bg-primary hover:bg-primary/90 text-white text-center font-bold py-3 px-4 rounded-lg transition-colors">
                                    Donar a esta emergencia
                                </button>
                            </motion.div>

                            {/* Mini donation form or CTA */}
                            <motion.div
                                className="bg-white rounded-xl shadow-md p-6"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                            >
                                <h3 className="text-lg font-bold mb-3">Dona rápidamente</h3>
                                <div className="grid grid-cols-2 gap-2 mb-4">
                                    <button className="bg-gray-100 hover:bg-gray-200 py-2 rounded font-bold">$10</button>
                                    <button className="bg-gray-100 hover:bg-gray-200 py-2 rounded font-bold">$25</button>
                                    <button className="bg-gray-100 hover:bg-gray-200 py-2 rounded font-bold">$50</button>
                                    <button className="bg-gray-100 hover:bg-gray-200 py-2 rounded font-bold">$100</button>
                                </div>
                                <button className="w-full bg-primary hover:bg-primary/90 text-white text-center font-bold py-2 px-4 rounded-lg transition-colors mb-3">
                                    Donar ahora
                                </button>
                                <p className="text-xs text-gray-500 text-center">
                                    O completa el formulario completo para más opciones
                                </p>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </PageContainer>
        </div>
    );
}