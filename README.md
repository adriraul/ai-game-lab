# 🎮 AI Game Lab

Una colección de juegos web interactivos desarrollados con HTML5, CSS3 y JavaScript vanilla. Todos los juegos están optimizados para dispositivos móviles y ofrecen una experiencia de usuario fluida y atractiva.

## 🎯 Juegos Disponibles

### 🧠 Memory
- **Descripción**: Juego de memoria clásico para 2 jugadores
- **Características**:
  - Selector de tamaño de tablero (4x4, 6x6, 8x8)
  - Animaciones 3D suaves para voltear cartas
  - Sistema de turnos automático
  - Estadísticas persistentes
  - Efectos visuales para cartas acertadas
- **Tecnologías**: HTML5, CSS3 (TailwindCSS), JavaScript ES6+

### 💣 Bloques y Bombas
- **Descripción**: Juego de apuestas con bloques numerados
- **Características**:
  - Sistema de rondas múltiples
  - Probabilidades dinámicas
  - Botón "Plantarse" para cobrar ganancias
  - Estadísticas de victorias
  - Animaciones de explosión
- **Tecnologías**: HTML5, CSS3 (TailwindCSS), JavaScript ES6+

### 📈 Crash
- **Descripción**: Juego de apuestas con gráfico en tiempo real
- **Características**:
  - Gráfico animado en tiempo real
  - Sistema de multiplicadores exponenciales
  - Botón "All In" para apostar todo
  - Historial de partidas
  - Animaciones fluidas
- **Tecnologías**: HTML5, CSS3 (TailwindCSS), JavaScript ES6+, Canvas API

## 🚀 Características Generales

### ✨ Funcionalidades Compartidas
- **Modales personalizados**: Sin ventanas del navegador molestas
- **Diseño responsive**: Optimizado para móviles y desktop
- **Animaciones fluidas**: Transiciones suaves en todos los elementos
- **Estadísticas persistentes**: Guardado local con localStorage
- **Navegación intuitiva**: Catálogo principal con navegación entre juegos

### 🎨 Diseño y UX
- **Tema oscuro**: Interfaz moderna con gradientes
- **Efectos visuales**: Backdrop blur, sombras y brillos
- **Iconografía**: Font Awesome para iconos consistentes
- **Tipografía**: Sistema de fuentes optimizado
- **Colores**: Paleta de colores coherente

### 📱 Responsive Design
- **Mobile-first**: Diseño optimizado para dispositivos móviles
- **Breakpoints**: Adaptación automática a diferentes tamaños
- **Touch-friendly**: Botones y elementos táctiles
- **Performance**: Carga rápida y animaciones optimizadas

## 🛠️ Tecnologías Utilizadas

### Frontend
- **HTML5**: Estructura semántica y accesible
- **CSS3**: Estilos modernos con TailwindCSS
- **JavaScript ES6+**: Lógica de juego y interactividad
- **Canvas API**: Gráficos en tiempo real (Crash)

### Librerías y Frameworks
- **TailwindCSS**: Framework CSS utility-first
- **Font Awesome**: Iconografía consistente
- **LocalStorage**: Persistencia de datos del cliente

### Herramientas de Desarrollo
- **ESLint**: Linting de código JavaScript
- **Prettier**: Formateo automático de código
- **Git**: Control de versiones

## 📁 Estructura del Proyecto

```
ai-game-lab/
├── index.html                 # Catálogo principal
├── games/
│   ├── memory/               # Juego Memory
│   │   ├── index.html
│   │   ├── main.js
│   │   └── style.css
│   ├── block-bomb/          # Juego Bloques y Bombas
│   │   ├── index.html
│   │   ├── main.js
│   │   └── style.css
│   └── crash/               # Juego Crash
│       ├── index.html
│       ├── main.js
│       └── style.css
├── shared/                  # Recursos compartidos
│   ├── css/
│   │   └── common.css      # Estilos compartidos
│   └── js/
│       └── common.js       # Funciones compartidas
├── .eslintrc.js            # Configuración ESLint
├── .prettierrc             # Configuración Prettier
└── README.md               # Este archivo
```

## 🚀 Instalación y Uso

### Requisitos
- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Servidor web local (opcional, para desarrollo)

### Instalación
1. Clona el repositorio:
```bash
git clone https://github.com/tu-usuario/ai-game-lab.git
cd ai-game-lab
```

2. Abre `index.html` en tu navegador o inicia un servidor local:
```bash
# Con Python
python -m http.server 8000

# Con Node.js
npx serve .

# Con PHP
php -S localhost:8000
```

3. Navega a `http://localhost:8000` en tu navegador

## 🎮 Cómo Jugar

### Memory
1. Selecciona el número de cartas (4x4, 6x6, 8x8)
2. Haz clic en "Iniciar Partida"
3. Encuentra las parejas de cartas
4. El jugador con más parejas gana

### Bloques y Bombas
1. Haz clic en "Nueva Ronda"
2. Elige un bloque numerado
3. Si no es la bomba, ganas puntos
4. Usa "Plantarse" para cobrar o continúa arriesgando

### Crash
1. Establece tu apuesta
2. Haz clic en "Iniciar"
3. El multiplicador aumenta exponencialmente
4. Haz clic en "Plantarse" antes de que "crashee"

## 🔧 Desarrollo

### Estructura de Código
- **Modular**: Cada juego es independiente
- **Reutilizable**: Funciones y estilos compartidos
- **Mantenible**: Código limpio y bien documentado
- **Escalable**: Fácil añadir nuevos juegos

### Buenas Prácticas
- **Responsive Design**: Mobile-first approach
- **Performance**: Animaciones optimizadas
- **Accesibilidad**: Navegación por teclado
- **SEO**: Meta tags y estructura semántica

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🙏 Agradecimientos

- **TailwindCSS**: Por el increíble framework CSS
- **Font Awesome**: Por los iconos hermosos
- **Comunidad de desarrolladores**: Por la inspiración y feedback

---

**Desarrollado con ❤️ para la comunidad de desarrolladores** 