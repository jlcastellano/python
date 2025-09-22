// Funciones principales de la aplicación
class EducationalPlatform {
    constructor() {
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.initializeCodeHighlighting();
            this.setupCopyButtons();
            this.setupPageNavigation();
        });
    }

    initializeCodeHighlighting() {
        // Inicializar highlight.js si está disponible
        if (typeof hljs !== 'undefined') {
            hljs.highlightAll();
        }
    }

    setupCopyButtons() {
        // Agregar event listeners a todos los botones de copia
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('copy-button')) {
                this.copyCode(e.target);
            }
        });
    }

    copyCode(button) {
        const codeBlock = button.parentElement.querySelector('code');
        if (!codeBlock) return;

        const text = codeBlock.textContent;
        
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => {
                this.showCopyFeedback(button);
            }).catch(() => {
                this.fallbackCopyText(text, button);
            });
        } else {
            this.fallbackCopyText(text, button);
        }
    }

    fallbackCopyText(text, button) {
        // Método alternativo para copiar texto
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
            this.showCopyFeedback(button);
        } catch (err) {
            console.error('Error al copiar:', err);
        }
        
        document.body.removeChild(textArea);
    }

    showCopyFeedback(button) {
        const originalText = button.textContent;
        const originalColor = button.style.backgroundColor;
        
        button.textContent = '¡Copiado!';
        button.style.backgroundColor = '#10b981';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.backgroundColor = originalColor;
        }, 2000);
    }

    setupPageNavigation() {
        // Configurar navegación entre páginas si existe
        const pageNav = document.querySelector('.page-navigation');
        if (pageNav && typeof navigationManager !== 'undefined') {
            const currentPage = window.location.pathname.split('/').pop() || 'index.html';
            const navInfo = navigationManager.getPageNavigation(currentPage);
            
            this.updatePageNavigation(navInfo);
        }
    }

    updatePageNavigation(navInfo) {
        const prevButton = document.querySelector('.nav-button:first-child');
        const nextButton = document.querySelector('.nav-button:last-child');

        if (prevButton) {
            if (navInfo.previous) {
                prevButton.href = navInfo.previous.url;
                prevButton.textContent = `← ${navInfo.previous.title}`;
                prevButton.classList.remove('disabled');
            } else {
                prevButton.classList.add('disabled');
                prevButton.href = '#';
            }
        }

        if (nextButton) {
            if (navInfo.next) {
                nextButton.href = navInfo.next.url;
                nextButton.textContent = `${navInfo.next.title} →`;
                nextButton.classList.remove('disabled');
            } else {
                nextButton.classList.add('disabled');
                nextButton.href = '#';
            }
        }
    }

    // Función para actualizar el contenido de la página
    updatePageContent(title, subtitle, content) {
        const titleElement = document.getElementById('page-title');
        const subtitleElement = document.getElementById('page-subtitle');
        const contentElement = document.getElementById('lesson-content');

        if (titleElement) titleElement.textContent = title;
        if (subtitleElement) subtitleElement.textContent = subtitle;
        if (contentElement) contentElement.innerHTML = content;

        // Re-inicializar highlighting después de actualizar contenido
        this.initializeCodeHighlighting();
    }

    // Función helper para crear contenedores de código
    createCodeContainer(title, language, code) {
        return `
            <div class="code-container">
                <div class="code-header">
                    <span>${title}</span>
                    <span class="language-badge">${language}</span>
                </div>
                <div class="code-content">
                    <button class="copy-button">Copiar</button>
                    <pre><code class="language-${language.toLowerCase()}">${this.escapeHtml(code)}</code></pre>
                </div>
            </div>
        `;
    }

    // Función helper para crear cajas de información
    createInfoBox(type, title, content) {
        return `
            <div class="info-box ${type}">
                <div class="info-box-title">${title}</div>
                <p>${content}</p>
            </div>
        `;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Inicializar la plataforma
const educationalPlatform = new EducationalPlatform();