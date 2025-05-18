import { Suspense } from 'react';
import DonationClientView from '@/modules/donations/componentes/DonationClientView';

export default function DonationsPage() {
    return (
        <Suspense fallback={<div>Cargando...</div>}>
            <DonationClientView />
        </Suspense>
    );
}
