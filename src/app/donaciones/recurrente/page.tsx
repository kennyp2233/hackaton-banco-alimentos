import { Metadata } from 'next';
import DonationForm from '@/modules/donations/componentes/DonationForm';
import PageContainer from '@/shared/layout/PageContainer';
import { motion } from 'framer-motion';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Donación Recurrente | Banco de Alimentos Quito',
  description: 'Conviértete en donante regular del Banco de Alimentos de Quito y genera un impacto sostenible.',
};

export default function RecurringDonationPage() {
  return (
    <div className="py-16 md:py-24 bg-gray-50">
      <PageContainer>
        <motion.div 
          className="max-w-2xl mx-auto text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold mb-6">Donación Mensual</h1>
          <p className="text-lg text-gray-700">
            Conviértete en donante regular y ayúdanos a planificar nuestras operaciones a largo plazo.
            Tu compromiso mensual genera un impacto sostenible en nuestra comunidad.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 items-start max-w-4xl mx-auto">
          <div>
            <div className="bg-white p-6 rounded-xl shadow-md mb-8">
              <h2 className="text-xl font-bold mb-4">Beneficios de ser donante regular</h2>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Contribuyes a mantener operaciones constantes</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Recibes informes trimestrales sobre el impacto de tu ayuda</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Acceso a eventos especiales para donantes</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Certificado anual para beneficios tributarios</span>
                </li>
              </ul>
            </div>
            
            <div className="relative h-64 w-full rounded-xl overflow-hidden shadow-md">
              <Image
                src="/images/recurring-donation.jpg"
                alt="Donante regular"
                fill
                className="object-cover"
              />
            </div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <DonationForm isRecurring={true} />
          </motion.div>
        </div>
        
        <motion.div 
          className="max-w-3xl mx-auto mt-16 bg-white p-8 rounded-xl shadow-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold mb-6 text-center">Testimonios de Donantes</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="italic text-gray-700 mb-4">
                "Ser donante regular me permite contribuir de manera constante a una causa que me importa.
                Es gratificante recibir los informes y ver cómo mi aporte ayuda a familias reales."
              </p>
              <p className="font-bold">María G.</p>
              <p className="text-sm text-gray-500">Donante desde 2022</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="italic text-gray-700 mb-4">
                "Lo que más valoro es la transparencia. Cada trimestre recibo información detallada
                sobre cómo se utiliza mi donación y el impacto que genera en la comunidad."
              </p>
              <p className="font-bold">Carlos R.</p>
              <p className="text-sm text-gray-500">Donante desde 2021</p>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-gray-700 mb-4">
              Puedes cancelar tu donación recurrente en cualquier momento. 
              Simplemente contáctanos y procesaremos tu solicitud sin ningún inconveniente.
            </p>
          </div>
        </motion.div>
      </PageContainer>
    </div>
  );
}