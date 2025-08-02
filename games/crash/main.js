// Clase principal del juego Crash
class CrashGame {
    constructor() {
        this.balance = 1000;
        this.currentBet = 0;
        this.currentMultiplier = 1.0;
        this.gameActive = false;
        this.gameCrashed = false;
        this.cashoutMultiplier = 0;
        this.gameHistory = [];
        this.crashPoint = 0;
        this.gameStartTime = 0;
        this.animationId = null;

        // Canvas y contexto
        this.canvas = document.getElementById('crashChart');
        this.ctx = this.canvas.getContext('2d');
        this.chartData = [];

        this.initializeElements();
        this.bindEvents();
        this.loadStats();
        this.setupCanvas();
        this.drawInitialChart();
    }

    initializeElements() {
        this.balanceEl = document.getElementById('balance');
        this.betAmountEl = document.getElementById('betAmount');
        this.multiplierEl = document.getElementById('multiplier');
        this.profitEl = document.getElementById('profit');
        this.startBtn = document.getElementById('startBtn');
        this.cashoutBtn = document.getElementById('cashoutBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.betInput = document.getElementById('betInput');
        this.currentMultiplierEl = document.getElementById('currentMultiplier');
        this.crashStatusEl = document.getElementById('crashStatus');
        this.multiplierOverlay = document.getElementById('multiplierOverlay');
        this.historyContainer = document.getElementById('historyContainer');
    }

    bindEvents() {
        this.startBtn.addEventListener('click', () => this.startGame());
        this.cashoutBtn.addEventListener('click', () => this.cashout());
        this.resetBtn.addEventListener('click', () => this.resetGame());
        this.betInput.addEventListener('input', () => this.updateBetAmount());

        // Botones de apuesta rápida
        document.querySelectorAll('.quick-bet').forEach(btn => {
            btn.addEventListener('click', e => {
                const amount = parseFloat(e.target.dataset.amount);
                this.betInput.value = amount;
                this.updateBetAmount();
            });
        });
    }

    setupCanvas() {
        // Configurar canvas para alta resolución
        const dpr = window.devicePixelRatio || 1;
        const rect = this.canvas.getBoundingClientRect();

        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        this.ctx.scale(dpr, dpr);

        this.canvas.style.width = rect.width + 'px';
        this.canvas.style.height = rect.height + 'px';
    }

    drawInitialChart() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Dibujar grid
        this.drawGrid();

        // Dibujar línea base
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.canvas.height - 50);
        this.ctx.lineTo(this.canvas.width, this.canvas.height - 50);
        this.ctx.stroke();
    }

    drawGrid() {
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        this.ctx.lineWidth = 1;

        // Líneas verticales
        for (let x = 0; x < this.canvas.width; x += 50) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }

        // Líneas horizontales
        for (let y = 0; y < this.canvas.height; y += 50) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
    }

    startGame() {
        const betAmount = parseFloat(this.betInput.value);

        if (!betAmount || betAmount <= 0) {
            this.showMessage('Por favor, ingresa una cantidad válida', 'error');
            return;
        }

        if (betAmount > this.balance) {
            this.showMessage('No tienes suficiente dinero', 'error');
            return;
        }

        // Resetear estado del juego
        this.currentBet = betAmount;
        this.balance -= betAmount;
        this.gameActive = true;
        this.gameCrashed = false;
        this.cashoutMultiplier = 0;
        this.gameStartTime = Date.now();
        this.chartData = [];
        this.currentMultiplier = 1.0;

        // Resetear UI visual
        this.crashStatusEl.textContent = '¡Plántate ahora!';
        this.crashStatusEl.style.color = '#9ca3af';
        this.multiplierEl.textContent = '1.00x';
        this.profitEl.textContent = '$0.00';

        // Generar punto de crash (exponencial)
        this.crashPoint = this.generateCrashPoint();

        // Actualizar UI
        this.updateUI();
        this.startBtn.disabled = true;
        this.cashoutBtn.disabled = false;
        this.multiplierOverlay.classList.remove('hidden');

        // Redibujar gráfico inicial
        this.drawInitialChart();

        // Iniciar animación
        this.animateGame();

        console.log(
            `Nueva partida: Apuesta $${betAmount}, Crash en ${this.crashPoint.toFixed(2)}x`
        );
    }

    generateCrashPoint() {
        // Algoritmo mejorado para generar crash point justo y realista
        // Basado en distribución exponencial real con house edge

        const random = Math.random();
        const houseEdge = 0.1; // 10% edge de la casa (más difícil)

        // Parámetros para distribución exponencial extremadamente desafiante
        const minCrash = 1.0; // Mínimo crash point
        const maxCrash = 20.0; // Máximo crash point (extremadamente raro)
        const lambda = 0.5; // Parámetro extremadamente agresivo para distribución exponencial

        // Distribución exponencial verdadera
        // Esto hace que sea extremadamente probable crashear en valores bajos
        // y exponencialmente más difícil en valores altos
        const exponentialValue = -Math.log(1 - random) / lambda;

        // Mapear el valor exponencial al rango de crash points (extremadamente desafiante)
        // Ajustado para que sea extremadamente difícil ganar
        const crashPoint =
            minCrash +
            (maxCrash - minCrash) * (1 - Math.exp(-exponentialValue / 50));

        // Aplicar house edge para hacer el juego desafiante
        const finalCrashPoint = crashPoint * (1 - houseEdge);

        // Log para debugging (opcional)
        console.log(
            `Crash point generado: ${finalCrashPoint.toFixed(2)}x (random: ${random.toFixed(3)}, exp: ${exponentialValue.toFixed(2)})`
        );

        // Estadísticas de distribución (para verificar que es justa)
        this.logCrashDistribution(finalCrashPoint);

        return Math.max(1.0, finalCrashPoint);
    }

    logCrashDistribution(crashPoint) {
        // Función para mostrar estadísticas de la distribución de crash points
        if (!this.crashStats) {
            this.crashStats = {
                total: 0,
                low: 0, // 1.0 - 1.2x
                medium: 0, // 1.2 - 1.5x
                high: 0, // 1.5 - 3.0x
                veryHigh: 0, // 3.0x+
                maxCrash: 0,
            };
        }

        this.crashStats.total++;
        this.crashStats.maxCrash = Math.max(
            this.crashStats.maxCrash,
            crashPoint
        );

        if (crashPoint < 1.2) this.crashStats.low++;
        else if (crashPoint < 1.5) this.crashStats.medium++;
        else if (crashPoint < 3.0) this.crashStats.high++;
        else this.crashStats.veryHigh++;

        // Mostrar estadísticas cada 10 partidas
        if (this.crashStats.total % 10 === 0) {
            console.log('📊 Estadísticas de Crash Points:');
            console.log(`Total partidas: ${this.crashStats.total}`);
            console.log(
                `1.0-1.2x: ${this.crashStats.low} (${((this.crashStats.low / this.crashStats.total) * 100).toFixed(1)}%)`
            );
            console.log(
                `1.2-1.5x: ${this.crashStats.medium} (${((this.crashStats.medium / this.crashStats.total) * 100).toFixed(1)}%)`
            );
            console.log(
                `1.5-3.0x: ${this.crashStats.high} (${((this.crashStats.high / this.crashStats.total) * 100).toFixed(1)}%)`
            );
            console.log(
                `3.0x+: ${this.crashStats.veryHigh} (${((this.crashStats.veryHigh / this.crashStats.total) * 100).toFixed(1)}%)`
            );
            console.log(
                `Máximo crash: ${this.crashStats.maxCrash.toFixed(2)}x`
            );
        }
    }

    animateGame() {
        const currentTime = Date.now();
        const elapsed = (currentTime - this.gameStartTime) / 1000; // segundos

        // Calcular multiplicador actual (exponencial más rápido y emocionante)
        // Ajustado para crecimiento más agresivo y emocionante
        this.currentMultiplier = Math.pow(Math.E, elapsed * 0.15);

        // Agregar punto a la gráfica
        this.chartData.push({
            time: elapsed,
            multiplier: this.currentMultiplier,
        });

        // Actualizar UI
        this.updateMultiplier();
        this.drawChart();

        // Verificar si se estrelló
        if (this.currentMultiplier >= this.crashPoint) {
            this.crash();
            return;
        }

        // Continuar animación
        this.animationId = requestAnimationFrame(() => this.animateGame());
    }

    updateMultiplier() {
        const multiplierText = `${this.currentMultiplier.toFixed(2)}x`;
        this.multiplierEl.textContent = multiplierText;
        this.currentMultiplierEl.textContent = multiplierText;

        // Calcular ganancia potencial
        const potentialProfit = this.currentBet * this.currentMultiplier;
        this.profitEl.textContent = `$${potentialProfit.toFixed(2)}`;

        // Efectos visuales
        this.currentMultiplierEl.classList.add('multiplier-animation');
        setTimeout(() => {
            this.currentMultiplierEl.classList.remove('multiplier-animation');
        }, 500);

        // Efecto crítico cuando se acerca al crash
        if (this.currentMultiplier > this.crashPoint * 0.8) {
            this.currentMultiplierEl.classList.add('critical-multiplier');
        }
    }

    drawChart() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawGrid();

        if (this.chartData.length < 2) return;

        // Dibujar línea del multiplicador
        this.ctx.strokeStyle = this.gameCrashed ? '#ef4444' : '#22c55e';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();

        const maxTime = Math.max(...this.chartData.map(d => d.time));
        const maxMultiplier = Math.max(
            ...this.chartData.map(d => d.multiplier)
        );

        this.chartData.forEach((point, index) => {
            const x = (point.time / maxTime) * (this.canvas.width - 100) + 50;
            const y =
                this.canvas.height -
                50 -
                ((point.multiplier - 1) / (maxMultiplier - 1)) *
                    (this.canvas.height - 100);

            if (index === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        });

        this.ctx.stroke();

        // Agregar efecto de glow
        this.ctx.shadowColor = this.gameCrashed ? '#ef4444' : '#22c55e';
        this.ctx.shadowBlur = 10;
        this.ctx.stroke();
        this.ctx.shadowBlur = 0;
    }

    cashout() {
        if (!this.gameActive || this.gameCrashed) return;

        this.cashoutMultiplier = this.currentMultiplier;
        const profit = this.currentBet * this.cashoutMultiplier;
        this.balance += profit;

        // Agregar al historial
        this.addToHistory(true, this.cashoutMultiplier, profit);

        // Efectos visuales
        this.profitEl.classList.add('profit-animation');
        this.balanceEl.classList.add('balance-update');

        setTimeout(() => {
            this.profitEl.classList.remove('profit-animation');
            this.balanceEl.classList.remove('balance-update');
        }, 1000);

        // Marcar como plantado pero continuar la animación
        this.gameActive = false;
        this.cashoutBtn.disabled = true;
        this.startBtn.disabled = true;

        // Mostrar mensaje de plantado
        this.showMessage(
            `¡Plantado en ${this.cashoutMultiplier.toFixed(2)}x! Ganaste $${profit.toFixed(2)}`,
            'success'
        );

        // Continuar animación hasta el crash point
        this.continueAnimationUntilCrash();
    }

    continueAnimationUntilCrash() {
        // Continuar la animación hasta que llegue al crash point
        const animate = () => {
            const currentTime = Date.now();
            const elapsed = (currentTime - this.gameStartTime) / 1000;

            // Calcular multiplicador actual
            this.currentMultiplier = Math.pow(Math.E, elapsed * 0.15);

            // Agregar punto a la gráfica
            this.chartData.push({
                time: elapsed,
                multiplier: this.currentMultiplier,
            });

            // Actualizar UI
            this.updateMultiplier();
            this.drawChart();

            // Verificar si se estrelló
            if (this.currentMultiplier >= this.crashPoint) {
                this.crash();
                return;
            }

            // Continuar animación
            requestAnimationFrame(animate);
        };

        animate();
    }

    crash() {
        this.gameCrashed = true;
        this.gameActive = false;

        // Efectos visuales de crash
        this.currentMultiplierEl.classList.add('crash-animation');
        this.crashStatusEl.textContent = '💥 ¡CRASH!';
        this.crashStatusEl.style.color = '#ef4444';

        // Agregar al historial solo si no se había plantado
        if (this.cashoutMultiplier === 0) {
            this.addToHistory(false, this.crashPoint, 0);
        }

        // Continuar animación del crash
        this.animateCrash();

        setTimeout(() => {
            // Mostrar mensaje diferente según si se plantó o no
            if (this.cashoutMultiplier > 0) {
                this.endGame(
                    `¡Se estrelló en ${this.crashPoint.toFixed(2)}x! Te plantaste a tiempo en ${this.cashoutMultiplier.toFixed(2)}x`,
                    'info'
                );
            } else {
                this.endGame(
                    `¡Se estrelló en ${this.crashPoint.toFixed(2)}x! Perdiste $${this.currentBet.toFixed(2)}`,
                    'error'
                );
            }
        }, 2000);
    }

    animateCrash() {
        const crashTime = 2; // segundos de animación de crash
        const startTime = Date.now();

        const animate = () => {
            const elapsed = (Date.now() - startTime) / 1000;
            const progress = Math.min(elapsed / crashTime, 1);

            // Simular caída del multiplicador
            const crashMultiplier = this.crashPoint * (1 - progress * 0.5);
            this.currentMultiplier = crashMultiplier;

            this.updateMultiplier();
            this.drawChart();

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        animate();
    }

    endGame(message, type) {
        this.gameActive = false;
        this.currentBet = 0;
        this.gameCrashed = false;
        this.cashoutMultiplier = 0;

        // Resetear UI
        this.startBtn.disabled = false;
        this.cashoutBtn.disabled = true;
        this.multiplierOverlay.classList.add('hidden');

        // Resetear texto de estado
        this.crashStatusEl.textContent = '¡Plántate ahora!';
        this.crashStatusEl.style.color = '#9ca3af';

        // Resetear multiplicador
        this.currentMultiplier = 1.0;
        this.multiplierEl.textContent = '1.00x';
        this.profitEl.textContent = '$0.00';

        // Limpiar datos del gráfico
        this.chartData = [];

        // Redibujar gráfico inicial
        this.drawInitialChart();

        this.updateUI();
        this.saveStats();

        // Limpiar animación
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }

        // Mostrar mensaje
        this.showMessage(message, type);
    }

    resetGame() {
        if (
            confirm(
                '¿Estás seguro de que quieres reiniciar el juego? Perderás todo tu progreso.'
            )
        ) {
            this.balance = 1000;
            this.currentBet = 0;
            this.currentMultiplier = 1.0;
            this.gameActive = false;
            this.gameCrashed = false;
            this.gameHistory = [];

            this.updateUI();
            this.saveStats();
            this.drawInitialChart();
            this.clearHistory();

            this.showMessage('Juego reiniciado. Balance: $1000', 'info');
        }
    }

    updateBetAmount() {
        const amount = parseFloat(this.betInput.value) || 0;
        this.betAmountEl.textContent = `$${amount.toFixed(2)}`;

        // Validar que no exceda el balance
        if (amount > this.balance) {
            this.betInput.style.borderColor = '#ef4444';
        } else {
            this.betInput.style.borderColor = 'rgba(255, 255, 255, 0.3)';
        }
    }

    updateUI() {
        this.balanceEl.textContent = `$${this.balance.toFixed(2)}`;
        this.betAmountEl.textContent = `$${this.currentBet.toFixed(2)}`;
        this.multiplierEl.textContent = `${this.currentMultiplier.toFixed(2)}x`;
        this.profitEl.textContent = `$${(this.currentBet * this.currentMultiplier).toFixed(2)}`;
    }

    addToHistory(won, multiplier, profit) {
        const historyItem = {
            won,
            multiplier,
            profit,
            timestamp: new Date().toLocaleTimeString(),
        };

        this.gameHistory.unshift(historyItem);

        // Mantener solo los últimos 10 resultados
        if (this.gameHistory.length > 10) {
            this.gameHistory.pop();
        }

        this.updateHistory();
    }

    updateHistory() {
        this.historyContainer.innerHTML = '';

        this.gameHistory.forEach(item => {
            const historyEl = document.createElement('div');
            historyEl.className = `history-item ${item.won ? 'history-win' : 'history-loss'}`;

            const icon = item.won ? '💰' : '💥';
            const result = item.won ? 'GANÓ' : 'PERDIÓ';
            const amount = item.won
                ? `+$${item.profit.toFixed(2)}`
                : `-$${this.currentBet.toFixed(2)}`;

            historyEl.innerHTML = `
                <div class="flex justify-between items-center">
                    <span>${icon} ${result}</span>
                    <span class="font-bold">${item.multiplier.toFixed(2)}x</span>
                    <span class="text-sm">${amount}</span>
                </div>
                <div class="text-xs text-gray-400">${item.timestamp}</div>
            `;

            this.historyContainer.appendChild(historyEl);
        });
    }

    clearHistory() {
        this.historyContainer.innerHTML = '';
    }

    showMessage(text, type = 'info') {
        // Crear mensaje temporal
        const messageEl = document.createElement('div');
        messageEl.className = `fixed top-4 right-4 p-4 rounded-lg text-white font-semibold z-50 fade-in`;

        switch (type) {
            case 'success':
                messageEl.style.background =
                    'linear-gradient(135deg, #22c55e, #16a34a)';
                break;
            case 'error':
                messageEl.style.background =
                    'linear-gradient(135deg, #ef4444, #dc2626)';
                break;
            default:
                messageEl.style.background =
                    'linear-gradient(135deg, #3b82f6, #2563eb)';
        }

        messageEl.textContent = text;
        document.body.appendChild(messageEl);

        setTimeout(() => {
            messageEl.remove();
        }, 3000);
    }

    saveStats() {
        localStorage.setItem(
            'crashGameStats',
            JSON.stringify({
                balance: this.balance,
                gameHistory: this.gameHistory,
            })
        );
    }

    loadStats() {
        const stats = localStorage.getItem('crashGameStats');
        if (stats) {
            const parsedStats = JSON.parse(stats);
            this.balance = parsedStats.balance || 1000;
            this.gameHistory = parsedStats.gameHistory || [];
            this.updateUI();
            this.updateHistory();
        }
    }
}

// Inicializar el juego cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    const game = new CrashGame();

    // Hacer el juego disponible globalmente para debugging
    window.game = game;
});
