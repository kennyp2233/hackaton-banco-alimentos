// Color scheme
export const COLORS = {
    primary: '#FF1E44',
    secondary: '#2A2A2A',
    success: '#34D399',
    warning: '#FBBF24',
    error: '#F87171',
    info: '#60A5FA',
    light: '#F9FAFB',
    dark: '#1F2937',
};

// Application URLs
export const URLS = {
    home: '/',
    donations: '/donaciones',
    singleDonation: '/donaciones/unica',
    recurringDonation: '/donaciones/recurrente',
    emergencies: '/emergencias',
    emergency: (id: string) => `/emergencias/${id}`,
};

// Organization Info
export const ORG_INFO = {
    name: 'Banco de Alimentos Quito',
    shortName: 'BAQ',
    address: 'Av. 10 de Agosto y Colón, Quito, Ecuador',
    phone: '+593 2 290 1234',
    email: 'info@bancodealimentosquito.org',
    socialMedia: {
        facebook: 'https://facebook.com/bancodealimentosquito',
        instagram: 'https://instagram.com/bancodealimentosquito',
        twitter: 'https://twitter.com/BAQuito',
    },
};

// Donation Amounts
export const DONATION_AMOUNTS = [10, 25, 50, 100];

// Donation Impact Information
export const DONATION_IMPACT = {
    small: {
        amount: 10,
        description: 'Proporcionan alimentos para 5 familias durante un día',
    },
    medium: {
        amount: 50,
        description: 'Ayudan a rescatar 100kg de alimentos que serían desperdiciados',
    },
    large: {
        amount: 100,
        description: 'Permiten que 20 familias reciban alimentos nutritivos por una semana',
    },
};

// Payment Methods
export const PAYMENT_METHODS = [
    {
        id: 'card',
        name: 'Tarjeta de Crédito/Débito',
        icon: 'card',
    },
    {
        id: 'paypal',
        name: 'PayPal',
        icon: 'paypal',
    },
    {
        id: 'transfer',
        name: 'Transferencia Bancaria',
        icon: 'bank',
    },
];

// API Endpoints (would connect to a real backend in production)
export const API = {
    baseUrl: '/api',
    donations: '/api/donations',
    emergencies: '/api/emergencies',
    payments: '/api/payments',
    users: '/api/users',
};

// Image Paths
export const IMAGES = {
    logo: '/logo.svg',
    logoWhite: '/logo-white.svg',
    hero: '/images/hero-background.jpg',
    impact: '/images/impact.jpg',
    recurringDonation: '/images/recurring-donation.jpg',
    emergencies: {
        placeholder: '/images/emergency-placeholder.jpg',
        landslide: '/images/emergencies/landslide.png',
        landslideGallery: [
            '/images/emergencies/landslide-1.png',
            '/images/emergencies/landslide-2.png',
            '/images/emergencies/landslide-3.png',
        ],
        shelter: '/images/emergencies/shelter.png',
        floods: '/images/emergencies/floods.png',
    },
    parallax: {
        tomatoe: '/images/parallax/tomatoe.png',
        leaf: '/images/parallax/leaf.png',
        platain: '/images/parallax/platain.png',
        hand: '/images/parallax/hand.png',
        bread: '/images/parallax/bread.png',
        box: '/images/parallax/box.png',
    },
};

// App Settings
export const SETTINGS = {
    animationDuration: 0.6,
    animationDelay: 0.2,
};

// Meta Information
export const META = {
    title: 'Banco de Alimentos Quito | Donaciones',
    description: 'Ayuda a combatir el hambre y reducir el desperdicio de alimentos en Quito.',
    keywords: 'banco de alimentos, donaciones, quito, hambre, seguridad alimentaria, donaciones en línea',
    ogImage: '/og-image.jpg',
};