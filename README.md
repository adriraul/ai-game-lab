# 🎮 AI Game Lab

Un laboratorio de juegos creado con inteligencia artificial, donde encontrarás experiencias únicas y desafiantes.

## 🎯 Características

- **Catálogo de juegos** - Navega fácilmente entre diferentes juegos
- **Diseño moderno** - Interfaz elegante con gradientes y animaciones
- **Responsive** - Funciona perfectamente en móviles y desktop
- **Navegación intuitiva** - Fácil navegación entre juegos
- **Estadísticas persistentes** - Tus progresos se guardan automáticamente

## 🎲 Juegos Disponibles

### 💣 Bloques y Bombas
Un juego de estrategia donde debes hacer clic en bloques para ganar puntos, pero ¡cuidado con la bomba!

**Características:**
- Sistema de rondas múltiples
- Acumulación de puntos
- Probabilidades dinámicas
- Opción de plantarse
- Estadísticas persistentes

**Cómo jugar:**
1. Haz clic en bloques para ganar puntos
2. Cada bloque tiene un número que indica los puntos
3. ¡Cuidado! Uno contiene una bomba
4. Decide si continuar o plantarte
5. Los bloques más altos tienen más riesgo

## 🛠️ Tecnologías

- **HTML5** - Estructura semántica
- **CSS3 + TailwindCSS** - Estilos modernos y responsive
- **JavaScript ES6+** - Lógica de juegos
- **Font Awesome** - Iconos y elementos visuales
- **LocalStorage** - Persistencia de datos

## 🚀 Instalación

1. **Clona el repositorio:**
   ```bash
   git clone <tu-repositorio>
   cd ai-game-lab
   ```

2. **Instala las dependencias:**
   ```bash
   npm install
   ```

3. **Ejecuta el servidor:**
   ```bash
   python3 -m http.server 8000
   ```

4. **Abre en tu navegador:**
   ```
   http://localhost:8000
   ```

## 📁 Estructura del Proyecto

```
ai-game-lab/
├── index.html              # Página principal del catálogo
├── style.css               # Estilos globales
├── package.json            # Dependencias y scripts
├── README.md              # Documentación
└── games/                 # Carpeta de juegos
    └── block-bomb/        # Juego de Bloques y Bombas
        ├── index.html     # Página del juego
        ├── main.js        # Lógica del juego
        └── style.css      # Estilos específicos
```

## 🎨 Diseño

### Página Principal
- **Header elegante** con logo y navegación
- **Grid de juegos** con tarjetas interactivas
- **Estadísticas del laboratorio**
- **Footer** con enlaces sociales

### Juegos Individuales
- **Header con navegación** de regreso al catálogo
- **Interfaz de juego** optimizada
- **Instrucciones detalladas**
- **Estadísticas en tiempo real**

## 📝 Scripts Disponibles

```bash
# Linting
npm run lint          # Verificar código
npm run lint:fix      # Corregir errores automáticamente

# Formateo
npm run format        # Formatear código
npm run format:check  # Verificar formato
```

## 🎯 Funcionalidades

### Navegación
- **Catálogo principal** - Vista general de todos los juegos
- **Navegación entre juegos** - Fácil acceso a cada juego
- **Botón de regreso** - Volver al catálogo desde cualquier juego

### Sistema de Juegos
- **Juegos independientes** - Cada juego en su propia carpeta
- **Estilos modulares** - CSS específico para cada juego
- **Lógica separada** - JavaScript independiente por juego

### Experiencia de Usuario
- **Diseño consistente** - Misma estética en todo el proyecto
- **Animaciones suaves** - Transiciones y efectos visuales
- **Responsive design** - Adaptable a cualquier dispositivo

## 🔧 Desarrollo

El proyecto está configurado con:
- **ESLint** - Linting de código JavaScript
- **Prettier** - Formateo automático de código
- **Configuración moderna** - ES2021, reglas estrictas

## 📱 Compatibilidad

- ✅ Chrome/Chromium
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Móviles (iOS/Android)

## 🎨 Personalización

Puedes modificar:
- **Colores**: Edita las clases de Tailwind en los archivos HTML
- **Animaciones**: Modifica `style.css`
- **Lógica**: Ajusta los archivos `main.js` de cada juego
- **Estructura**: Agrega nuevos juegos en la carpeta `games/`

## 🚀 Agregar Nuevos Juegos

Para agregar un nuevo juego:

1. **Crea una nueva carpeta** en `games/nombre-del-juego/`
2. **Copia la estructura** de `games/block-bomb/`
3. **Modifica el HTML** para tu juego
4. **Implementa la lógica** en `main.js`
5. **Agrega el juego** al catálogo en `index.html`

## 📄 Licencia

MIT License - ¡Siéntete libre de usar y modificar!

---

¡Disfruta explorando el laboratorio de juegos! 🎮✨ 