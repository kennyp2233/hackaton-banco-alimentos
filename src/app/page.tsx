'use client';

import { useEffect, useState } from 'react';
import Hero from '@/shared/components/Hero';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useEmergencyService, Emergency } from '@/modules/emergency/services/emergencyService';
import ParallaxBackground from '@/shared/components/ParallaxBackground';
import { IMAGES } from '@/shared/config/constants';

// Definimos las imágenes para el efecto parallax en la sección About
const aboutParallaxImages = [
  {
    src: IMAGES.parallax.box,
    alt: "Caja de verduras frescas",
    position: 'right' as const,
    speed: 15
  },
  {
    src: IMAGES.parallax.platain,
    alt: "Platano",
    position: 'left' as const,
    speed: 10
  }
];

export default function Home() {
  const { getCriticalEmergencies } = useEmergencyService();
  const [criticalEmergency, setCriticalEmergency] = useState<Emergency | null>(null);

  useEffect(() => {
    const fetchCriticalEmergency = async () => {
      const emergencies = await getCriticalEmergencies();
      if (emergencies.length > 0) {
        setCriticalEmergency(emergencies[0]);
      }
    };

    fetchCriticalEmergency();
  }, []);

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      {isClient && <Hero />}


      {/* About Section */}
      <section className="py-16 md:py-24 bg-gray-50 relative overflow-hidden">
        {/* Parallax Background */}
        <div className="absolute inset-0 z-0">
          <ParallaxBackground images={aboutParallaxImages} />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="max-w-3xl mx-auto text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">El Banco de Alimentos de Quito</h2>
            <p className="text-lg text-gray-700 mb-4">
              Somos una organización sin fines de lucro que trabaja para reducir el desperdicio de alimentos
              y combatir el hambre en Quito y sus alrededores.
            </p>
            <p className="text-lg text-gray-700">
              A través de la recolección, clasificación y distribución de alimentos, ayudamos a miles de
              personas en situación de vulnerabilidad a acceder a una alimentación digna y nutritiva.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div
              className="bg-white p-6 rounded-xl shadow-md"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-center">Rescate de Alimentos</h3>
              <p className="text-gray-600 text-center">
                Recuperamos alimentos en buen estado que serían desperdiciados en supermercados,
                mercados mayoristas y empresas alimentarias.
              </p>
            </motion.div>

            <motion.div
              className="bg-white p-6 rounded-xl shadow-md"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-center">Distribución Equitativa</h3>
              <p className="text-gray-600 text-center">
                Distribuimos los alimentos a organizaciones sociales, comedores comunitarios y
                albergues que atienden a personas en situación de vulnerabilidad.
              </p>
            </motion.div>

            <motion.div
              className="bg-white p-6 rounded-xl shadow-md"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-center">Donaciones Económicas</h3>
              <p className="text-gray-600 text-center">
                Recibimos donaciones económicas que nos permiten cubrir costos operativos y
                adquirir alimentos complementarios para una nutrición balanceada.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-3xl mx-auto text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Nuestro Impacto</h2>
            <p className="text-lg text-gray-700">
              Cada donación contribuye a crear un cambio significativo en nuestra comunidad.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <motion.div
              className="order-2 md:order-1"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-2xl font-bold mb-4">Combatimos el hambre y reducimos el desperdicio</h3>
              <p className="text-gray-700 mb-6">
                Cada año, más de 900 millones de toneladas de alimentos se desperdician a nivel mundial.
                Al mismo tiempo, más de 100,000 personas en Quito sufren de inseguridad alimentaria.
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-gray-700">Rescatamos más de 100 toneladas de alimentos cada mes</p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-gray-700">Beneficiamos a más de 50,000 personas anualmente</p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-gray-700">Colaboramos con 42 instituciones beneficiarias</p>
                </div>
              </div>
              <div className="mt-8">
                <Link
                  href="/donaciones"
                  className="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-8 rounded-lg inline-block transition-colors"
                >
                  Quiero contribuir
                </Link>
              </div>
            </motion.div>

            <motion.div
              className="order-1 md:order-2"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative h-96 rounded-xl overflow-hidden shadow-xl">
                <Image
                  src={IMAGES.impact}
                  alt="Personas recibiendo alimentos"
                  fill
                  className="object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Emergency CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Emergencias Activas</h2>
            <p className="text-lg mb-8">
              {criticalEmergency ? (
                <>
                  <span className="font-bold">{criticalEmergency.title}</span>: {criticalEmergency.description.substring(0, 100)}...
                </>
              ) : (
                "Algunas situaciones requieren atención inmediata. Conoce las campañas de emergencia activas y cómo puedes contribuir."
              )}
            </p>
            <Link
              href="/emergencias"
              className="bg-white text-primary hover:bg-gray-100 font-bold py-3 px-8 rounded-lg inline-block transition-colors"
            >
              Ver emergencias
            </Link>
          </motion.div>
        </div>
      </section>
      <Link
        href="https://wa.me/593998841200?text=Hola%2C%20me%20gustar%C3%ADa%20convertirme%20en%voluntario%20del%20Banco%20de%20Alimentos"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-full shadow-lg transition-all"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M20.52 3.48A11.76 11.76 0 0 0 12 0C5.37 0 0 5.37 0 12a11.93 11.93 0 0 0 1.67 6.17L0 24l6.27-1.65A11.87 11.87 0 0 0 12 24c6.63 0 12-5.37 12-12 0-3.19-1.24-6.2-3.48-8.52ZM12 22c-1.83 0-3.63-.5-5.17-1.44l-.37-.22-3.72.98.98-3.61-.24-.38A9.89 9.89 0 0 1 2 12c0-5.52 4.48-10 10-10s10 4.48 10 10-4.48 10-10 10Zm5.16-7.28c-.28-.14-1.63-.81-1.88-.9-.25-.1-.44-.14-.63.14s-.72.9-.88 1.08c-.16.18-.32.2-.6.07a7.8 7.8 0 0 1-2.3-1.42 8.65 8.65 0 0 1-1.6-2.02c-.17-.29 0-.44.13-.58.14-.14.3-.32.45-.48.15-.16.2-.27.3-.45.1-.18.05-.33-.02-.47-.07-.14-.63-1.52-.87-2.09-.23-.56-.47-.48-.65-.49h-.56c-.19 0-.48.07-.73.33a3.06 3.06 0 0 0-.96 2.28c0 1.34.97 2.63 1.1 2.81.14.18 1.9 3 4.6 4.2.64.28 1.13.45 1.52.58.64.2 1.22.17 1.68.1.51-.08 1.63-.67 1.86-1.31.23-.64.23-1.2.16-1.31-.06-.1-.25-.16-.52-.3Z" />
        </svg>
        <span className="hidden sm:inline font-bold">Conviértete en voluntario</span>
      </Link>

    </div>
  );
}