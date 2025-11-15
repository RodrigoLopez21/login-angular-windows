// Pegar esto en la consola del navegador para verificar la seguridad
(function() {
    console.log('🔒 Verificación de Seguridad - Clickjacking');
    console.log('===========================================');
    
    // Verificar headers
    fetch(window.location.href, { method: 'HEAD' })
        .then(response => {
            console.log('📋 Headers de Seguridad:');
            console.log('X-Frame-Options:', response.headers.get('x-frame-options') || '❌ NO CONFIGURADO');
            console.log('Content-Security-Policy:', response.headers.get('content-security-policy') || '❌ NO CONFIGURADO');
            console.log('X-Content-Type-Options:', response.headers.get('x-content-type-options') || '❌ NO CONFIGURADO');
        })
        .catch(error => {
            console.log('Error al verificar headers:', error);
        });

    // Verificar estado de framing
    console.log('\n🖼️  Estado de Framing:');
    try {
        const isFramed = window.self !== window.top;
        console.log('Está en frame:', isFramed ? '❌ SÍ - VULNERABLE' : '✅ NO - SEGURO');
    } catch (e) {
        console.log('Está en frame: ❌ SÍ - VULNERABLE (Cross-origin error)');
    }

    console.log('\n✅ Verificación completada');
    console.log('💡 Para más detalles, ejecute: ng.securityService.securityReport()');
})();