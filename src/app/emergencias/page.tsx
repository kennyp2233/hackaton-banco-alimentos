'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import PageContainer from '@/shared/layout/PageContainer';
import { motion } from 'framer-motion';
import EmergencyCard from '@/modules/emergency/components/EmergencyCard';
import { useEmergencyService, Emergency } from '@/modules/emergency/services/emergencyService';

export default function EmergenciesPage() {
  const { getActiveEmergencies, isLoading } = useEmergencyService();
  const [emergencies, setEmergencies] = useState<Emergency[]>([]);

  useEffect(() => {
    const fetchEmergencies = async () => {
      const response = await getActiveEmergencies();
      setEmergencies(response.emergencies);
    };

    fetchEmergencies();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-primary text-white">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/emergencies/emergency-hero.jpg"
            alt="Personas en una emergencia"
            fill
            priority
            className="object-cover opacity-30"
          />
        </div>

        <div className="relative z-10 py-16 md:py-24">
          <PageContainer>
            <motion.div
              className="max-w-3xl mx-auto text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block bg-white text-primary text-sm font-bold px-4 py-1 rounded-full mb-4">
                ¡Ayuda Urgente!
              </span>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Emergencias Activas</h1>
              <p className="text-lg md:text-xl mb-8">
                Estas situaciones requieren atención inmediata. Tu donación puede hacer
                la diferencia para familias afectadas por desastres y crisis.
              </p>
            </motion.div>
          </PageContainer>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-16">
        <PageContainer>
          {/* Critical Emergencies Banner */}
          <motion.div
            className="bg-red-50 border-l-4 border-red-500 p-4 mb-12 rounded-r-lg"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h2 className="text-lg font-medium text-red-700">Emergencias Críticas</h2>
                <p className="text-red-600 mt-1">
                  Estas situaciones requieren ayuda inmediata. Cada día cuenta para las familias afectadas.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Emergency Cards */}
          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
          >
            {isLoading ? (
              // Mostrar esqueletos de carga si está cargando
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="bg-white rounded-xl overflow-hidden shadow-lg p-6 animate-pulse">
                  <div className="h-48 bg-gray-300 rounded mb-4"></div>
                  <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-full mb-1"></div>
                  <div className="h-4 bg-gray-300 rounded w-5/6 mb-4"></div>
                  <div className="h-2 bg-gray-300 rounded w-full mb-4"></div>
                  <div className="flex gap-2 mb-4">
                    <div className="h-6 bg-gray-300 rounded w-1/3"></div>
                    <div className="h-6 bg-gray-300 rounded w-1/3"></div>
                  </div>
                  <div className="h-10 bg-gray-300 rounded w-full"></div>
                </div>
              ))
            ) : (
              emergencies.map((emergency) => (
                <EmergencyCard key={emergency.id} emergency={emergency} />
              ))
            )}
          </motion.div>

          {/* Info Section */}
          <div className="mt-16 bg-white rounded-xl shadow-md overflow-hidden">
            <div className="md:flex">
              <div className="md:flex-shrink-0 md:w-1/3 relative">
                <div className="h-full w-full md:h-full md:w-full">
                  <Image
                    src="/images/volunteer.jpg"
                    alt="Voluntarios en acción"
                    width={400}
                    height={300}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="p-8">
                <h2 className="text-2xl font-bold mb-4">¿Cómo respondemos a las emergencias?</h2>
                <p className="text-gray-700 mb-4">
                  Cuando ocurre una emergencia, activamos nuestro protocolo de respuesta rápida:
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Evaluación de necesidades alimentarias</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Movilización de recursos y voluntarios</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Distribución coordinada con autoridades locales</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Seguimiento y reportes de impacto</span>
                  </li>
                </ul>
                <Link
                  href="/donaciones"
                  className="inline-block bg-primary hover:bg-primary/90 text-white font-bold py-2 px-6 rounded-lg transition-colors"
                >
                  Quiero ayudar
                </Link>
              </div>
            </div>
          </div>
        </PageContainer>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-100 py-12">
        <PageContainer>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">¿Quieres estar informado sobre emergencias?</h2>
            <p className="text-lg text-gray-700 mb-8">
              Suscríbete a nuestras alertas para recibir notificaciones cuando surjan nuevas emergencias
              y puedas responder rápidamente.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <input
                type="email"
                placeholder="Tu correo electrónico"
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary sm:w-64"
              />
              <button className="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-6 rounded-lg transition-colors">
                Suscribirme
              </button>
            </div>
          </div>
        </PageContainer>
      </div>
    </div>
  );
}