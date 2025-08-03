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

        // Inicializar multiplicadores en 1.00x
        this.multiplierEl.textContent = '1.00x';
        this.currentMultiplierEl.textContent = '1.00x';
        this.currentMultiplierEl.style.color = '#9ca3af';

        // Asegurar que el overlay esté oculto inicialmente
        this.multiplierOverlay.classList.add('hidden');

        // Forzar estilos del scrollbar con JavaScript
        this.forceScrollbarStyles();
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
        this.allInBtn = document.getElementById('allInBtn');
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

        // Botón All In
        this.allInBtn.addEventListener('click', () => this.setAllIn());
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

        // Asegurar que el multiplicador grande muestre 1.00x inicialmente
        this.multiplierEl.textContent = '1.00x';
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

        // Usar una tolerancia pequeña para problemas de precisión decimal
        if (betAmount > this.balance + 0.01) {
            this.showMessage('No tienes suficiente dinero', 'error');
            return;
        }

        // Resetear estado del juego
        this.currentBet = betAmount;
        // Manejar precisión decimal al restar
        this.balance = Math.round((this.balance - betAmount) * 100) / 100;
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

        // Estado inicial del multiplicador superior (parado)
        this.currentMultiplierEl.textContent = '1.00x';
        this.currentMultiplierEl.style.color = '#9ca3af';
        this.currentMultiplierEl.classList.remove(
            'multiplier-animation',
            'critical-multiplier'
        );

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
        if (this.currentMultiplier >= this.crashPoint && !this.gameCrashed) {
            this.crash();
            return;
        }

        // Continuar animación
        this.animationId = requestAnimationFrame(() => this.animateGame());
    }

    updateMultiplier() {
        // Usar el mismo valor exacto para ambos multiplicadores
        const multiplierValue = this.currentMultiplier;
        const multiplierText = `${multiplierValue.toFixed(2)}x`;

        // Actualizar multiplicador grande siempre que esté activo
        if (this.gameActive) {
            this.multiplierEl.textContent = multiplierText;
        }

        // Actualizar multiplicador pequeño siempre que esté activo
        if (this.gameActive) {
            this.currentMultiplierEl.textContent = multiplierText;
        }

        // Calcular ganancia potencial
        const potentialProfit = this.currentBet * multiplierValue;
        this.profitEl.textContent = `$${potentialProfit.toFixed(2)}`;

        // Actualizar texto de estado según si ya se plantó o no
        if (this.cashoutMultiplier > 0) {
            this.crashStatusEl.textContent = `✅ Plantado en ${this.cashoutMultiplier.toFixed(2)}x`;
            this.crashStatusEl.style.color = '#22c55e';
        } else if (this.gameActive) {
            this.crashStatusEl.textContent = '¡Plántate ahora!';
            this.crashStatusEl.style.color = '#9ca3af';
        }

        // Estados del multiplicador superior según el estado del juego
        if (this.gameCrashed) {
            // Estado de crash: rojo y sin animación
            this.currentMultiplierEl.style.color = '#ef4444';
            this.currentMultiplierEl.classList.remove('multiplier-animation');
            this.currentMultiplierEl.classList.add('critical-multiplier');
        } else if (this.gameActive) {
            // Estado activo: naranja y animado
            this.currentMultiplierEl.style.color = '#f97316';
            this.currentMultiplierEl.classList.add('multiplier-animation');
            this.currentMultiplierEl.classList.remove('critical-multiplier');
        } else {
            // Estado inactivo: gris y parado
            this.currentMultiplierEl.style.color = '#9ca3af';
            this.currentMultiplierEl.classList.remove(
                'multiplier-animation',
                'critical-multiplier'
            );
        }

        // Efecto crítico cuando se acerca al crash (solo si está activo)
        if (this.gameActive && multiplierValue > this.crashPoint * 0.8) {
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
        // Manejar precisión decimal al sumar
        this.balance = Math.round((this.balance + profit) * 100) / 100;

        // Guardar la apuesta original para el historial
        const originalBet = this.currentBet;

        // Agregar al historial
        this.addToHistory(true, this.cashoutMultiplier, profit, originalBet);

        // Efectos visuales
        this.profitEl.classList.add('profit-animation');
        this.balanceEl.classList.add('balance-update');

        setTimeout(() => {
            this.profitEl.classList.remove('profit-animation');
            this.balanceEl.classList.remove('balance-update');
        }, 1000);

        // Deshabilitar botones inmediatamente
        this.cashoutBtn.disabled = true;
        this.startBtn.disabled = true;

        // Mostrar mensaje de plantado
        this.showMessage(
            `¡Plantado en ${this.cashoutMultiplier.toFixed(2)}x! Ganaste $${profit.toFixed(2)}`,
            'success'
        );

        // Continuar animación hasta el crash point (NO cambiar gameActive ni gameCrashed)
        this.continueAnimationUntilCrash();

        // Añadir efecto visual de "plantado exitoso"
        this.multiplierEl.classList.add('profit-animation');
        setTimeout(() => {
            this.multiplierEl.classList.remove('profit-animation');
        }, 1000);
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

            // Actualizar UI (sin permitir cashout adicional)
            this.updateMultiplier();
            this.drawChart();

            // Verificar si se estrelló
            if (
                this.currentMultiplier >= this.crashPoint &&
                !this.gameCrashed
            ) {
                this.crash();
                return;
            }

            // Continuar animación solo si no se ha hecho cashout
            if (!this.gameCrashed) {
                requestAnimationFrame(animate);
            }
        };

        animate();
    }

    crash() {
        // Prevenir múltiples crashes
        if (this.gameCrashed) {
            return;
        }

        this.gameCrashed = true;
        this.gameActive = false;

        // Efectos visuales de crash más dramáticos
        this.currentMultiplierEl.classList.add('crash-animation');
        this.crashStatusEl.textContent = '💥 ¡CRASH!';
        this.crashStatusEl.style.color = '#ef4444';
        this.crashStatusEl.classList.add('critical-multiplier');

        // Agregar al historial solo si no se había plantado
        if (this.cashoutMultiplier === 0) {
            this.addToHistory(false, this.crashPoint, 0, this.currentBet);
        }

        // Mostrar el punto de crash en el multiplicador
        this.multiplierEl.textContent = `${this.crashPoint.toFixed(2)}x`;
        this.multiplierEl.style.color = '#ef4444';
        this.multiplierEl.classList.add('crash-animation');

        // Continuar animación del crash
        this.animateCrash();

        setTimeout(() => {
            // Solo mostrar mensaje si no se había plantado antes
            if (this.cashoutMultiplier === 0) {
                this.endGame(
                    `¡CRASH en ${this.crashPoint.toFixed(2)}x! Perdiste $${this.currentBet.toFixed(2)}`,
                    'error'
                );
            } else {
                // Si se plantó, solo resetear sin mensaje
                this.endGame();
            }
        }, 3000); // Aumentar tiempo para que se vea mejor
    }

    animateCrash() {
        const crashTime = 3; // segundos de animación de crash
        const startTime = Date.now();

        // Fijar el multiplicador grande en el punto de crash
        this.multiplierEl.textContent = `${this.crashPoint.toFixed(2)}x`;
        this.multiplierEl.style.color = '#ef4444';
        this.multiplierEl.classList.add('crash-animation');

        // El multiplicador pequeño sí disminuirá
        this.currentMultiplierEl.textContent = `${this.crashPoint.toFixed(2)}x`;
        this.currentMultiplierEl.style.color = '#ef4444';
        this.currentMultiplierEl.classList.add('critical-multiplier');

        const animate = () => {
            const elapsed = (Date.now() - startTime) / 1000;
            const progress = Math.min(elapsed / crashTime, 1);

            // Simular caída del multiplicador solo para la animación
            const crashMultiplier = this.crashPoint * (1 - progress * 0.8);

            // Actualizar solo el multiplicador pequeño
            this.currentMultiplierEl.textContent = `${crashMultiplier.toFixed(2)}x`;

            // Actualizar el gráfico con el multiplicador de crash
            this.drawChart();

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        animate();
    }

    endGame(message, type) {
        // Prevenir múltiples llamadas
        if (this.gameActive === false && this.currentBet === 0) {
            return;
        }

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

        // Asegurar que el multiplicador grande muestre 1.00x
        this.multiplierEl.textContent = '1.00x';

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

        // Solo mostrar mensaje si se proporciona uno
        if (message) {
            this.showMessage(message, type);
        }
    }

    resetGame() {
        ModalManager.showConfirmModal(
            '¿Estás seguro de que quieres reiniciar el juego? Perderás todo tu progreso.',
            () => {
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

                // Resetear multiplicadores a 1.00x
                this.multiplierEl.textContent = '1.00x';
                this.currentMultiplierEl.textContent = '1.00x';
                this.currentMultiplierEl.style.color = '#9ca3af';
                this.currentMultiplierEl.classList.remove(
                    'multiplier-animation',
                    'critical-multiplier'
                );

                this.showMessage('Juego reiniciado. Balance: $1000', 'info');
            }
        );
    }

    updateBetAmount() {
        const amount = parseFloat(this.betInput.value) || 0;
        this.betAmountEl.textContent = `$${amount.toFixed(2)}`;

        // Validar que no exceda el balance con tolerancia para decimales
        if (amount > this.balance + 0.01) {
            this.betInput.style.borderColor = '#ef4444';
        } else {
            this.betInput.style.borderColor = 'rgba(255, 255, 255, 0.3)';
        }
    }

    setAllIn() {
        // Usar todo el balance disponible con manejo de precisión decimal
        const allInAmount = Math.round(this.balance * 100) / 100; // Redondear a 2 decimales
        this.betInput.value = allInAmount.toFixed(2);
        this.updateBetAmount();
        this.showMessage(
            `All In configurado: $${allInAmount.toFixed(2)}`,
            'info'
        );
    }

    updateUI() {
        this.balanceEl.textContent = `$${this.balance.toFixed(2)}`;
        this.betAmountEl.textContent = `$${this.currentBet.toFixed(2)}`;
        this.multiplierEl.textContent = `${this.currentMultiplier.toFixed(2)}x`;
        this.profitEl.textContent = `$${(this.currentBet * this.currentMultiplier).toFixed(2)}`;

        // Asegurar que el multiplicador grande muestre 1.00x cuando no hay juego activo
        if (!this.gameActive) {
            this.multiplierEl.textContent = '1.00x';
        }
    }

    addToHistory(won, multiplier, profit, originalBet = 0) {
        const historyItem = {
            won,
            multiplier,
            profit,
            originalBet: originalBet, // Guardamos la apuesta original para ambos casos
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

        // Calcular profit total (balance actual - balance inicial)
        const initialBalance = 1000;
        const totalProfit = this.balance - initialBalance;

        // Mostrar profit total en la parte superior
        if (this.gameHistory.length > 0) {
            const totalProfitEl = document.createElement('div');
            totalProfitEl.className =
                'mb-3 p-2 bg-white/10 rounded text-center';
            totalProfitEl.innerHTML = `
                <div class="text-xs text-gray-300">Profit Total</div>
                <div class="text-sm font-bold ${totalProfit >= 0 ? 'text-green-400' : 'text-red-400'}">
                    ${totalProfit >= 0 ? '+' : ''}$${totalProfit.toFixed(2)}
                </div>
            `;
            this.historyContainer.appendChild(totalProfitEl);
        }

        // Calcular profit acumulado para cada entrada
        let runningProfit = 0;
        this.gameHistory.forEach((item, index) => {
            const historyEl = document.createElement('div');
            historyEl.className = `history-item ${item.won ? 'history-win' : 'history-loss'}`;

            const icon = item.won ? '💰' : '💥';
            const result = item.won ? 'GANÓ' : 'PERDIÓ';

            // Profit individual de esta partida (ganancia neta)
            const individualProfit = item.won
                ? item.profit - item.originalBet
                : -item.originalBet;

            // Actualizar profit acumulado
            runningProfit += individualProfit;

            // Mostrar importe total recibido y profit acumulado
            const totalReceived = item.won
                ? `+$${item.profit.toFixed(2)}`
                : `-$${item.originalBet.toFixed(2)}`;

            const accumulatedAmount = `${runningProfit >= 0 ? '+' : ''}$${runningProfit.toFixed(2)}`;

            historyEl.innerHTML = `
                <div class="flex justify-between items-center mb-1 text-sm">
                    <span class="flex-shrink-0">${icon} ${result}</span>
                    <span class="font-bold flex-shrink-0 mx-2">${item.multiplier.toFixed(2)}x</span>
                    <span class="text-xs ${item.won ? 'text-green-400' : 'text-red-400'} flex-shrink-0">${totalReceived}</span>
                </div>
                <div class="flex justify-between items-center text-xs">
                    <span class="text-gray-400 flex-shrink-0">${item.timestamp}</span>
                    <span class="${runningProfit >= 0 ? 'text-green-300' : 'text-red-300'} flex-shrink-0">${accumulatedAmount}</span>
                </div>
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

    forceScrollbarStyles() {
        // Crear estilos dinámicamente para forzar la aplicación
        const style = document.createElement('style');
        style.textContent = `
            .history-container::-webkit-scrollbar,
            #historyContainer::-webkit-scrollbar {
                width: 12px !important;
                height: 12px !important;
                background: rgba(0, 0, 0, 0.1) !important;
            }
            
            .history-container::-webkit-scrollbar-track,
            #historyContainer::-webkit-scrollbar-track {
                background: rgba(0, 0, 0, 0.1) !important;
                border-radius: 8px !important;
                margin: 4px 0 !important;
                border: 1px solid rgba(255, 255, 255, 0.1) !important;
            }
            
            .history-container::-webkit-scrollbar-thumb,
            #historyContainer::-webkit-scrollbar-thumb {
                background: #22c55e !important;
                border-radius: 8px !important;
                border: 2px solid rgba(255, 255, 255, 0.2) !important;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3) !important;
                min-height: 20px !important;
            }
            
            .history-container::-webkit-scrollbar-thumb:hover,
            #historyContainer::-webkit-scrollbar-thumb:hover {
                background: #16a34a !important;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4) !important;
                transform: scale(1.1) !important;
            }
            
            .history-container::-webkit-scrollbar-thumb:active,
            #historyContainer::-webkit-scrollbar-thumb:active {
                background: #15803d !important;
                box-shadow: 0 2px 6px rgba(0, 0, 0, 0.5) !important;
            }
            
            .history-container::-webkit-scrollbar-corner,
            #historyContainer::-webkit-scrollbar-corner {
                background: transparent !important;
            }
            
            .history-container::-webkit-scrollbar-button,
            #historyContainer::-webkit-scrollbar-button {
                display: none !important;
                height: 0 !important;
                width: 0 !important;
            }
        `;
        document.head.appendChild(style);
    }
}

// Inicializar el juego cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    const game = new CrashGame();

    // Hacer el juego disponible globalmente para debugging
    window.game = game;
});
