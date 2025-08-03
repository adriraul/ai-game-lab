// Clase principal del juego
class BlockGame {
    constructor() {
        this.currentScore = 0;
        this.totalScore = 0;
        this.gamesWon = 0;
        this.gameActive = false;
        this.blocks = [];
        this.bombPosition = -1;
        this.clickedBlocks = new Set();
        this.currentRound = 0;

        this.initializeElements();
        this.bindEvents();
        this.loadStats();
    }

    initializeElements() {
        this.currentScoreEl = document.getElementById('currentScore');
        this.totalScoreEl = document.getElementById('totalScore');
        this.gamesWonEl = document.getElementById('gamesWon');
        this.blocksContainer = document.getElementById('blocksContainer');
        this.newGameBtn = document.getElementById('newGameBtn');
        this.nextRoundBtn = document.getElementById('nextRoundBtn');
        this.plantBtn = document.getElementById('plantBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.gameMessage = document.getElementById('gameMessage');
    }

    bindEvents() {
        this.newGameBtn.addEventListener('click', () => this.startNewGame());
        this.nextRoundBtn.addEventListener('click', () =>
            this.generateNextRound()
        );
        this.plantBtn.addEventListener('click', () => this.plantGame());
        this.resetBtn.addEventListener('click', () => this.resetGame());
    }

    // Generar probabilidades basadas en el número del bloque
    generateProbabilities(numBlocks) {
        const probabilities = [];
        let totalWeight = 0;

        // Calcular pesos: bloque más alto = más probabilidad
        for (let i = 1; i <= numBlocks; i++) {
            const weight = i; // Peso lineal: bloque 1 = 1, bloque 2 = 2, etc.
            probabilities.push(weight);
            totalWeight += weight;
        }

        // Normalizar probabilidades
        const normalizedProbabilities = probabilities.map(p => p / totalWeight);

        return normalizedProbabilities;
    }

    // Colocar la bomba basándose en las probabilidades
    placeBomb(numBlocks) {
        const probabilities = this.generateProbabilities(numBlocks);
        const random = Math.random();

        let cumulativeProbability = 0;
        for (let i = 0; i < probabilities.length; i++) {
            cumulativeProbability += probabilities[i];
            if (random <= cumulativeProbability) {
                return i; // Retorna el índice (0-based)
            }
        }

        return numBlocks - 1; // Fallback al último bloque
    }

    // Crear un bloque individual
    createBlock(number, index) {
        const block = document.createElement('div');
        block.className =
            'block bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white font-bold rounded-lg border-2 border-blue-400 cursor-pointer flex items-center justify-center min-w-[60px] min-h-[60px] text-lg';
        block.dataset.index = index;
        block.dataset.number = number;

        const numberSpan = document.createElement('span');
        numberSpan.textContent = number;
        numberSpan.className = 'text-lg font-bold';

        block.appendChild(numberSpan);

        block.addEventListener('click', () =>
            this.handleBlockClick(index, number)
        );

        return block;
    }

    // Manejar clic en un bloque
    handleBlockClick(index, number) {
        if (!this.gameActive || this.clickedBlocks.has(index)) {
            return;
        }

        this.clickedBlocks.add(index);
        const block = this.blocksContainer.children[index];
        block.classList.add('clicked');

        if (index === this.bombPosition) {
            // ¡BOOM! El jugador encontró la bomba
            block.classList.add('bomb');
            block.innerHTML = '💣';
            this.endGame(false);
        } else {
            // Bloque seguro
            block.classList.add('safe');
            this.currentScore += number;
            this.updateScore();

            // Habilitar botones después de acertar
            this.plantBtn.disabled = false;
            this.nextRoundBtn.disabled = false;

            // Mostrar mensaje de éxito
            this.showMessage(
                `¡Acertaste! +${number} puntos. Puedes plantarte o continuar.`,
                'success'
            );
        }
    }

    // Generar siguiente ronda
    generateNextRound() {
        this.currentRound++;

        // Generar número aleatorio de bloques (3-10)
        const numBlocks = Math.floor(Math.random() * 8) + 3;
        this.blocks = Array.from({ length: numBlocks }, (_, i) => i + 1);

        // Colocar la bomba
        this.bombPosition = this.placeBomb(numBlocks);

        // Limpiar contenedor y crear bloques
        this.blocksContainer.innerHTML = '';
        this.blocks.forEach((blockNumber, index) => {
            const block = this.createBlock(blockNumber, index);
            this.blocksContainer.appendChild(block);
        });

        // Deshabilitar botones hasta acertar
        this.plantBtn.disabled = true;
        this.nextRoundBtn.disabled = true;

        // Limpiar bloques clickeados
        this.clickedBlocks.clear();

        // Mostrar mensaje de nueva ronda
        this.showMessage(
            `¡Ronda ${this.currentRound + 1}! Nuevos bloques disponibles.`,
            'info'
        );

        console.log(
            `Nueva ronda ${this.currentRound + 1}: ${numBlocks} bloques, bomba en posición ${this.bombPosition + 1}`
        );
    }

    // Iniciar nueva partida
    startNewGame() {
        this.currentScore = 0;
        this.gameActive = true;
        this.currentRound = 0;
        this.clickedBlocks.clear();

        // Generar primera ronda
        this.generateNextRound();

        // Actualizar UI
        this.updateScore();
        this.plantBtn.disabled = true;
        this.nextRoundBtn.disabled = true;
        this.hideMessage();
    }

    // Plantarse y sumar puntos
    plantGame() {
        if (!this.gameActive) return;

        this.totalScore += this.currentScore;
        this.gamesWon++;
        this.gameActive = false;

        this.saveStats();
        this.updateScore();
        this.showMessage(
            `¡Excelente! Te plantaste con ${this.currentScore} puntos acumulados.`,
            'success'
        );

        this.plantBtn.disabled = true;
        this.nextRoundBtn.disabled = true;
    }

    // Terminar juego (por bomba)
    endGame(won) {
        this.gameActive = false;
        this.plantBtn.disabled = true;
        this.nextRoundBtn.disabled = true;

        if (won) {
            this.totalScore += this.currentScore;
            this.gamesWon++;
            this.saveStats();
            this.showMessage(
                `¡Victoria! Ganaste ${this.currentScore} puntos.`,
                'success'
            );
        } else {
            this.showMessage(
                `¡BOOM! Perdiste ${this.currentScore} puntos. La bomba estaba en el bloque ${this.bombPosition + 1}`,
                'error'
            );
        }

        this.updateScore();
    }

    // Reiniciar todo el juego
    resetGame() {
        this.showConfirmModal(
            '¿Estás seguro de que quieres reiniciar todas las estadísticas?',
            () => {
                this.currentScore = 0;
                this.totalScore = 0;
                this.gamesWon = 0;
                this.gameActive = false;
                this.currentRound = 0;
                this.clickedBlocks.clear();

                this.saveStats();
                this.updateScore();
                this.hideMessage();
                this.blocksContainer.innerHTML = '';
                this.plantBtn.disabled = true;
                this.nextRoundBtn.disabled = true;
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

    // Actualizar puntuación en la UI
    updateScore() {
        this.currentScoreEl.textContent = this.currentScore;
        this.totalScoreEl.textContent = this.totalScore;
        this.gamesWonEl.textContent = this.gamesWon;
    }

    // Mostrar mensaje
    showMessage(text, type = 'info') {
        this.gameMessage.classList.remove('hidden');
        const messageEl = this.gameMessage.querySelector('p');
        messageEl.textContent = text;

        // Aplicar estilos según el tipo
        messageEl.className = `text-lg font-semibold ${type === 'success' ? 'text-green-400' : type === 'error' ? 'text-red-400' : 'text-blue-400'}`;

        if (type === 'success') {
            this.gameMessage.classList.add('victory-effect');
        }
    }

    // Ocultar mensaje
    hideMessage() {
        this.gameMessage.classList.add('hidden');
        this.gameMessage.classList.remove('victory-effect');
    }

    // Guardar estadísticas en localStorage
    saveStats() {
        localStorage.setItem(
            'blockGameStats',
            JSON.stringify({
                totalScore: this.totalScore,
                gamesWon: this.gamesWon,
            })
        );
    }

    // Cargar estadísticas desde localStorage
    loadStats() {
        const stats = localStorage.getItem('blockGameStats');
        if (stats) {
            const parsedStats = JSON.parse(stats);
            this.totalScore = parsedStats.totalScore || 0;
            this.gamesWon = parsedStats.gamesWon || 0;
            this.updateScore();
        }
    }
}

// Inicializar el juego cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    const game = new BlockGame();

    // Hacer el juego disponible globalmente para debugging
    window.game = game;
});
