const waitForData = (callback: () => void, retries = 15, interval = 300) => {
    if (typeof window !== 'undefined' && (window as any).Data) {
        callback();
    } else if (retries > 0) {
        setTimeout(() => waitForData(callback, retries - 1, interval), interval);
    } else {
        console.error('[PagoPlux] Data no se cargó');
    }
};

const iniciarDatos = (data: any) => {
    waitForData(() => {
        (window as any).Data.init(data);
        setTimeout(() => {
            const payBtn = document.getElementById('pay');
            if (payBtn) payBtn.click();
        }, 300);
    });
};

const reload = (data: any) => {
    if ((window as any).Data) {
        (window as any).Data.reload(data);
    }
};

export { iniciarDatos, reload };
