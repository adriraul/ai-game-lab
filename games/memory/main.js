// Clase principal del juego Memory
class MemoryGame {
    constructor() {
        this.cards = [];
        this.flippedCards = [];
        this.currentPlayer = 1;
        this.scores = { 1: 0, 2: 0 };
        this.gameActive = false;
        this.matchedPairs = 0;
        this.totalCards = 16; // Por defecto 16 cartas (4x4)
        this.gridSize = 4; // Por defecto 4x4
        this.stats = {
            gamesPlayed: 0,
            player1Wins: 0,
            player2Wins: 0,
        };

        // Símbolos base para las cartas (32 símbolos únicos para máximo 64 cartas)
        this.baseSymbols = [
            // Juegos y entretenimiento
            '🎮',
            '🎲',
            '🎯',
            '🎪',
            '🎨',
            '🎭',
            '🎪',
            '🎯',
            // Animales
            '🐶',
            '🐱',
            '🐭',
            '🐹',
            '🐰',
            '🦊',
            '🐻',
            '🐼',
            // Comida
            '🍎',
            '🍌',
            '🍇',
            '🍓',
            '🍊',
            '🍋',
            '🍉',
            '🍍',
            // Deportes
            '⚽',
            '🏀',
            '🏈',
            '⚾',
            '🎾',
            '🏐',
            '🏉',
            '🎱',
            // Objetos
            '📱',
            '💻',
            '⌚',
            '📷',
            '🎧',
            '📺',
            '🔋',
            '💡',
        ];

        this.initializeElements();
        this.bindEvents();
        this.loadStats();
        this.updateUI();
        this.updateGridSize(); // Inicializar el grid con el valor por defecto
    }

    initializeElements() {
        this.memoryGrid = document.getElementById('memoryGrid');
        this.cardSelector = document.getElementById('cardSelector');
        this.player1Score = document.getElementById('player1Score');
        this.player2Score = document.getElementById('player2Score');
        this.player1Status = document.getElementById('player1Status');
        this.player2Status = document.getElementById('player2Status');
        this.player1Panel = document.getElementById('player1Panel');
        this.player2Panel = document.getElementById('player2Panel');
        this.newGameBtn = document.getElementById('newGameBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.gamesPlayed = document.getElementById('gamesPlayed');
        this.player1Wins = document.getElementById('player1Wins');
        this.player2Wins = document.getElementById('player2Wins');
    }

    bindEvents() {
        this.newGameBtn.addEventListener('click', () => this.startNewGame());
        this.resetBtn.addEventListener('click', () => this.resetStats());
        this.cardSelector.addEventListener('change', () =>
            this.updateGridSize()
        );

        // Configurar selector personalizado
        this.setupCustomSelect();
    }

    startNewGame() {
        this.gameActive = true;
        this.currentPlayer = 1;
        this.scores = { 1: 0, 2: 0 };
        this.matchedPairs = 0;
        this.flippedCards = [];

        this.updateGridSize();
        this.createCards();
        this.updateUI();
        this.updatePlayerStatus();

        // Deshabilitar selector durante el juego
        this.disableCardSelector();
    }

    updateGridSize() {
        // Solo permitir cambios si no hay un juego activo
        if (this.gameActive) {
            return;
        }

        const selectedCards = parseInt(this.cardSelector.value);
        this.totalCards = selectedCards;
        this.gridSize = Math.sqrt(selectedCards);

        // Actualizar el grid CSS
        this.memoryGrid.style.gridTemplateColumns = `repeat(${this.gridSize}, 1fr)`;

        // Limpiar el grid si no hay juego activo
        if (!this.gameActive) {
            this.memoryGrid.innerHTML = '';
        }
    }

    createCards() {
        this.memoryGrid.innerHTML = '';
        this.cards = [];
        
        // Asegurar que el grid esté visible desde el inicio
        this.memoryGrid.style.opacity = '1';

        // Obtener símbolos para el número de cartas seleccionado
        const symbolsNeeded = this.totalCards / 2; // Necesitamos la mitad de símbolos porque cada símbolo aparece 2 veces

        // Seleccionar aleatoriamente los símbolos únicos necesarios (sin repeticiones)
        const shuffledBaseSymbols = this.shuffleArray([...this.baseSymbols]);
        const selectedSymbols = shuffledBaseSymbols.slice(0, symbolsNeeded);

        // Crear array con pares de símbolos (cada símbolo aparece exactamente 2 veces)
        const symbolsForCards = [];
        for (let i = 0; i < selectedSymbols.length; i++) {
            symbolsForCards.push(selectedSymbols[i]); // Primera aparición
            symbolsForCards.push(selectedSymbols[i]); // Segunda aparición
        }

        // Mezclar símbolos
        const shuffledSymbols = this.shuffleArray(symbolsForCards);

        // Crear cartas
        for (let i = 0; i < shuffledSymbols.length; i++) {
            const card = this.createCard(shuffledSymbols[i], i);
            this.cards.push(card);
            this.memoryGrid.appendChild(card.element);
        }

        // Añadir clase para animación de entrada inmediatamente
        this.memoryGrid.classList.add('memory-grid');
    }

    createCard(symbol, index) {
        const cardElement = document.createElement('div');
        cardElement.className = 'memory-card';
        cardElement.innerHTML = `
            <div class="card" data-index="${index}" data-symbol="${symbol}">
                <div class="card-front">
                    <i class="fas fa-question"></i>
                </div>
                <div class="card-back">
                    ${symbol}
                </div>
            </div>
        `;

        const card = {
            element: cardElement,
            symbol: symbol,
            index: index,
            isFlipped: false,
            isMatched: false,
        };

        // Event listener para voltear carta
        cardElement.addEventListener('click', () => this.flipCard(card));

        return card;
    }

    flipCard(card) {
        if (
            !this.gameActive ||
            card.isFlipped ||
            card.isMatched ||
            this.flippedCards.length >= 2
        ) {
            return;
        }

        // Voltear carta
        card.isFlipped = true;
        card.element.querySelector('.card').classList.add('flipped');
        this.flippedCards.push(card);

        // Si se han volteado 2 cartas, verificar si coinciden
        if (this.flippedCards.length === 2) {
            setTimeout(() => this.checkMatch(), 500);
        }
    }

    checkMatch() {
        const [card1, card2] = this.flippedCards;

        if (card1.symbol === card2.symbol) {
            // ¡Coincidencia!
            this.handleMatch(card1, card2);
        } else {
            // No coinciden
            this.handleNoMatch(card1, card2);
        }
    }

    handleMatch(card1, card2) {
        // Marcar cartas como encontradas
        card1.isMatched = true;
        card2.isMatched = true;
        card1.isFlipped = true; // Mantener boca arriba
        card2.isFlipped = true; // Mantener boca arriba

        // Añadir clases para efectos visuales
        const card1Element = card1.element.querySelector('.card');
        const card2Element = card2.element.querySelector('.card');

        card1Element.classList.add('matched', 'flipped');
        card2Element.classList.add('matched', 'flipped');

        // Sumar punto al jugador actual
        this.scores[this.currentPlayer]++;
        this.matchedPairs++;

        // Efecto visual de victoria
        card1Element.classList.add('victory');
        card2Element.classList.add('victory');

        // Limpiar cartas volteadas
        this.flippedCards = [];

        // Verificar si el juego ha terminado
        if (this.matchedPairs === this.totalCards / 2) {
            setTimeout(() => this.endGame(), 1000);
        } else {
            // El jugador actual sigue jugando
            this.updateUI();
            this.updatePlayerStatus();
        }
    }

    handleNoMatch(card1, card2) {
        // Efecto visual de error
        card1.element.querySelector('.card').classList.add('wrong');
        card2.element.querySelector('.card').classList.add('wrong');

        // Volver a girar las cartas después de 1 segundo
        setTimeout(() => {
            card1.isFlipped = false;
            card2.isFlipped = false;
            card1.element
                .querySelector('.card')
                .classList.remove('flipped', 'wrong');
            card2.element
                .querySelector('.card')
                .classList.remove('flipped', 'wrong');

            // Cambiar turno
            this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
            this.flippedCards = [];

            this.updateUI();
            this.updatePlayerStatus();
        }, 1000);
    }

    updatePlayerStatus() {
        // Actualizar panel del jugador 1
        if (this.currentPlayer === 1) {
            this.player1Panel.classList.add('player-active');
            this.player2Panel.classList.remove('player-active');
            this.player1Status.textContent = '🎯 Tu turno';
            this.player2Status.textContent = 'Esperando...';
        } else {
            this.player1Panel.classList.remove('player-active');
            this.player2Panel.classList.add('player-active');
            this.player1Status.textContent = 'Esperando...';
            this.player2Status.textContent = '🎯 Tu turno';
        }
    }

    endGame() {
        this.gameActive = false;
        this.stats.gamesPlayed++;

        let winner = null;
        if (this.scores[1] > this.scores[2]) {
            winner = 1;
            this.stats.player1Wins++;
        } else if (this.scores[2] > this.scores[1]) {
            winner = 2;
            this.stats.player2Wins++;
        }

        this.saveStats();
        this.showVictoryMessage(winner);
        this.updateStats();

        // Habilitar selector después del juego
        this.enableCardSelector();
    }

    showVictoryMessage(winner) {
        let message = '';
        if (winner) {
            message = `🏆 ¡Jugador ${winner} ha ganado!<br><br>Puntuación final:<br>Jugador 1: ${this.scores[1]} puntos<br>Jugador 2: ${this.scores[2]} puntos`;
        } else {
            message = `🤝 ¡Empate!<br><br>Puntuación final:<br>Jugador 1: ${this.scores[1]} puntos<br>Jugador 2: ${this.scores[2]} puntos`;
        }

        const victoryDiv = document.createElement('div');
        victoryDiv.className = 'victory-message';
        victoryDiv.innerHTML = `
            <h2 class="text-2xl font-bold mb-4">🎉 ¡Juego Terminado!</h2>
            <div class="text-lg mb-6">${message}</div>
            <button onclick="this.parentElement.remove()" class="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-lg transition-colors">
                Cerrar
            </button>
        `;

        document.body.appendChild(victoryDiv);

        // Remover automáticamente después de 5 segundos
        setTimeout(() => {
            if (victoryDiv.parentElement) {
                victoryDiv.remove();
            }
        }, 5000);
    }

    updateUI() {
        this.player1Score.textContent = this.scores[1];
        this.player2Score.textContent = this.scores[2];
        this.updateStats();
    }

    updateStats() {
        this.gamesPlayed.textContent = this.stats.gamesPlayed;
        this.player1Wins.textContent = this.stats.player1Wins;
        this.player2Wins.textContent = this.stats.player2Wins;
    }

    resetStats() {
        this.showConfirmModal(
            '¿Estás seguro de que quieres reiniciar todas las estadísticas?',
            () => {
                this.stats = {
                    gamesPlayed: 0,
                    player1Wins: 0,
                    player2Wins: 0,
                };
                this.saveStats();
                this.updateStats();
            }
        );
    }

    showConfirmModal(message, onConfirm) {
        const modalDiv = document.createElement('div');
        modalDiv.className = 'confirm-modal';
        modalDiv.innerHTML = `
            <div class="confirm-content">
                <h3 class="text-xl font-semibold text-white mb-4">⚠️ Confirmar Acción</h3>
                <p class="text-gray-300 mb-6">${message}</p>
                <div class="flex justify-center space-x-4">
                    <button class="confirm-btn confirm-yes bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg transition-colors">
                        Sí, Reiniciar
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
    }

    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    saveStats() {
        localStorage.setItem('memoryGameStats', JSON.stringify(this.stats));
    }

    loadStats() {
        const stats = localStorage.getItem('memoryGameStats');
        if (stats) {
            this.stats = JSON.parse(stats);
        }
    }

    disableCardSelector() {
        this.cardSelector.disabled = true;
        const selectDisplay = document.getElementById('selectDisplay');
        const selectOptions = document.getElementById('selectOptions');

        if (selectDisplay) {
            selectDisplay.style.opacity = '0.5';
            selectDisplay.style.cursor = 'not-allowed';
        }

        if (selectOptions) {
            selectOptions.classList.add('select-hide');
        }
    }

    enableCardSelector() {
        this.cardSelector.disabled = false;
        const selectDisplay = document.getElementById('selectDisplay');

        if (selectDisplay) {
            selectDisplay.style.opacity = '1';
            selectDisplay.style.cursor = 'pointer';
        }
    }

    setupCustomSelect() {
        const selectDisplay = document.getElementById('selectDisplay');
        const selectOptions = document.getElementById('selectOptions');
        const cardSelector = document.getElementById('cardSelector');

        // Establecer valor por defecto (16 cartas)
        cardSelector.value = '16';
        selectDisplay.textContent = '16 cartas (4x4)';

        // Mostrar/ocultar opciones al hacer clic
        selectDisplay.addEventListener('click', () => {
            // Solo permitir cambios si no hay un juego activo
            if (!this.gameActive) {
                selectOptions.classList.toggle('select-hide');
            }
        });

        // Configurar opciones
        const options = selectOptions.querySelectorAll('.select-option');
        options.forEach(option => {
            option.addEventListener('click', () => {
                // Solo permitir cambios si no hay un juego activo
                if (!this.gameActive) {
                    const value = option.getAttribute('data-value');
                    const text = option.textContent;

                    // Actualizar display
                    selectDisplay.textContent = text;

                    // Actualizar select oculto
                    cardSelector.value = value;

                    // Ocultar opciones
                    selectOptions.classList.add('select-hide');

                    // Disparar evento change
                    cardSelector.dispatchEvent(new Event('change'));
                }
            });
        });

        // Cerrar al hacer clic fuera
        document.addEventListener('click', e => {
            if (!e.target.closest('.custom-select')) {
                selectOptions.classList.add('select-hide');
            }
        });
    }
}

// Inicializar el juego cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    new MemoryGame();
});
