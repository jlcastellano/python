document.addEventListener('DOMContentLoaded', () => {
    
    /**
     * LÓGICA DE COPIADO DE CÓDIGO
     * Busca todos los bloques <pre> generados por Prism
     * e inyecta un botón de copiar.
     */
    
    const codeBlocks = document.querySelectorAll('.contenido-didactico pre');

    codeBlocks.forEach(block => {
        // 1. Crear el botón
        const button = document.createElement('button');
        button.className = 'copy-button';
        button.textContent = 'Copiar';
        button.type = 'button';
        button.ariaLabel = 'Copiar código al portapapeles';

        // 2. Añadir el botón al bloque <pre>
        block.appendChild(button);

        // 3. Lógica del evento click
        button.addEventListener('click', async () => {
            // Buscamos el tag <code> dentro del <pre>
            const code = block.querySelector('code');
            if (!code) return;

            // Obtenemos el texto
            const textToCopy = code.innerText;

            try {
                // Usamos la API moderna del portapapeles
                await navigator.clipboard.writeText(textToCopy);

                // Feedback visual de éxito
                const originalText = button.textContent;
                button.textContent = '¡Copiado!';
                button.classList.add('copied');

                // Restaurar estado después de 2 segundos
                setTimeout(() => {
                    button.textContent = originalText;
                    button.classList.remove('copied');
                }, 2000);

            } catch (err) {
                console.error('Error al copiar: ', err);
                button.textContent = 'Error';
            }
        });
    });

    /**
     * (OPCIONAL) MANEJO DE DETAILS
     * Si quieres que al abrir un <details> se cierren los otros (modo acordeón)
     * descomenta el siguiente bloque.
     */
    /*
    const details = document.querySelectorAll('.contenido-didactico details');
    details.forEach(targetDetail => {
        targetDetail.addEventListener('click', () => {
            details.forEach(detail => {
                if (detail !== targetDetail) {
                    detail.removeAttribute('open');
                }
            });
        });
    });
    */
});