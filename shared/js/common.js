/* Funciones compartidas para todos los juegos */

// Clase para manejar modales de confirmación
class ModalManager {
    static showConfirmModal(message, onConfirm, title = '⚠️ Confirmar Acción') {
        const modalDiv = document.createElement('div');
        modalDiv.className = 'confirm-modal';
        modalDiv.innerHTML = `
            <div class="confirm-content">
                <h3 class="text-xl font-semibold text-white mb-4">${title}</h3>
                <p class="text-gray-300 mb-6">${message}</p>
                <div class="flex justify-center space-x-4">
                    <button class="confirm-btn confirm-yes bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg transition-colors">
                        Sí, Confirmar
                    </button>
                    <button class="confirm-btn confirm-no bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-lg transition-colors">
                        Cancelar
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modalDiv);

        // Event listeners
        modalDiv.querySelector('.confirm-yes').addEventListener('click', () => {
            onConfirm();
            modalDiv.remove();
        });

        modalDiv.querySelector('.confirm-no').addEventListener('click', () => {
            modalDiv.remove();
        });

        // Cerrar al hacer clic fuera del modal
        modalDiv.addEventListener('click', (e) => {
            if (e.target === modalDiv) {
                modalDiv.remove();
            }
        });

        // Cerrar con Escape
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                modalDiv.remove();
                document.removeEventListener('keydown', handleEscape);
            }
        };
        document.addEventListener('keydown', handleEscape);
    }
}

// Clase para manejar estadísticas
class StatsManager {
    constructor(storageKey) {
        this.storageKey = storageKey;
        this.stats = this.loadStats();
    }

    loadStats() {
        const stats = localStorage.getItem(this.storageKey);
        return stats ? JSON.parse(stats) : {};
    }

    saveStats() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.stats));
    }

    updateStat(key, value) {
        this.stats[key] = value;
        this.saveStats();
    }

    getStat(key, defaultValue = 0) {
        return this.stats[key] || defaultValue;
    }

    resetStats() {
        this.stats = {};
        this.saveStats();
    }
}

// Clase para manejar mensajes de juego
class MessageManager {
    constructor(messageElement) {
        this.messageElement = messageElement;
    }

    showMessage(text, type = 'info', duration = 3000) {
        if (!this.messageElement) return;

        this.messageElement.classList.remove('hidden');
        const messageEl = this.messageElement.querySelector('p');
        if (messageEl) {
            messageEl.textContent = text;
        }

        // Aplicar estilos según el tipo
        const typeClasses = {
            'success': 'text-green-400',
            'error': 'text-red-400',
            'warning': 'text-yellow-400',
            'info': 'text-blue-400'
        };

        if (messageEl) {
            messageEl.className = `text-lg font-semibold ${typeClasses[type] || typeClasses.info}`;
        }

        // Añadir efecto de victoria si es success
        if (type === 'success') {
            this.messageElement.classList.add('victory-effect');
        }

        // Auto-ocultar después del tiempo especificado
        if (duration > 0) {
            setTimeout(() => {
                this.hideMessage();
            }, duration);
        }
    }

    hideMessage() {
        if (!this.messageElement) return;
        
        this.messageElement.classList.add('hidden');
        this.messageElement.classList.remove('victory-effect');
    }
}

// Utilidades comunes
const GameUtils = {
    // Función para mezclar arrays
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    },

    // Función para generar números aleatorios en un rango
    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    // Función para formatear números con separadores de miles
    formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },

    // Función para formatear moneda
    formatCurrency(amount, currency = '$') {
        return `${currency}${parseFloat(amount).toFixed(2)}`;
    },

    // Función para animar elementos
    animateElement(element, animation, duration = 300) {
        element.style.animation = `${animation} ${duration}ms ease-out`;
        setTimeout(() => {
            element.style.animation = '';
        }, duration);
    },

    // Función para debounce
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Función para throttle
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
};

// Exportar para uso en otros archivos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ModalManager, StatsManager, MessageManager, GameUtils };
} 