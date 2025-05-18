'use client';
import Script from 'next/script';

export default function PagoPluxScripts() {
    return (
        <>
            <Script id="jquery"
                src="https://code.jquery.com/jquery-3.4.1.min.js"
                strategy="beforeInteractive" />

            <Script id="pagoplux-sdk"
                src="https://sandbox-paybox.pagoplux.com/paybox/index_angular.js"
                strategy="afterInteractive"
                onLoad={() => console.log('✅ SDK cargado')} />
        </>
    );
}
