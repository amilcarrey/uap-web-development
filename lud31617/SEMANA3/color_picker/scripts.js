// Elementos DOM
const redSlider = document.getElementById('red');
const greenSlider = document.getElementById('green');
const blueSlider = document.getElementById('blue');
const alphaSlider = document.getElementById('alpha');

const redValueSpan = document.getElementById('red-value');
const greenValueSpan = document.getElementById('green-value');
const blueValueSpan = document.getElementById('blue-value');
const alphaValueSpan = document.getElementById('alpha-value');

const hexCodeSpan = document.getElementById('hex-code');
const colorDisplay = document.querySelector('.color-overlay');
const copyButton = document.getElementById('copy-button');
const copyNotification = document.getElementById('copy-notification');

// Función para convertir un componente a hexadecimal (2 dígitos)
function componentToHex(c) {
    const hex = Math.round(c).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
}

// Función para actualizar el color
function updateColor() {
    const r = parseInt(redSlider.value);
    const g = parseInt(greenSlider.value);
    const b = parseInt(blueSlider.value);
    const a = parseFloat(alphaSlider.value);

    // Actualizar los valores mostrados
    redValueSpan.textContent = r;
    greenValueSpan.textContent = g;
    blueValueSpan.textContent = b;
    alphaValueSpan.textContent = a.toFixed(2);

    // Actualizar el color de fondo de los valores según su intensidad
    redValueSpan.style.backgroundColor = `rgba(255, 0, 0, ${r/255})`;
    redValueSpan.style.color = r > 128 ? '#fff' : '#333';
    
    greenValueSpan.style.backgroundColor = `rgba(0, 255, 0, ${g/255})`;
    greenValueSpan.style.color = g > 128 ? '#fff' : '#333';
    
    blueValueSpan.style.backgroundColor = `rgba(0, 0, 255, ${b/255})`;
    blueValueSpan.style.color = b > 128 ? '#fff' : '#333';
    
    alphaValueSpan.style.backgroundColor = `rgba(0, 0, 0, ${a})`;
    alphaValueSpan.style.color = a > 0.5 ? '#fff' : '#333';

    // Calcular y mostrar el código hexadecimal
    const aHex = componentToHex(a * 255);
    const hex = "#" + componentToHex(r) + componentToHex(g) + componentToHex(b) + aHex;
    hexCodeSpan.textContent = hex.toUpperCase();

    // Activa la animación "flash" en el código hexadecimal
    hexCodeSpan.classList.remove('flash');
    void hexCodeSpan.offsetWidth; // Truco para reiniciar la animación
    hexCodeSpan.classList.add('flash');

    // Actualiza el cuadro de color y dispara una animación "pulse"
    colorDisplay.style.backgroundColor = `rgba(${r}, ${g}, ${b}, ${a})`;
    colorDisplay.classList.remove('pulse');
    void colorDisplay.offsetWidth;
    colorDisplay.classList.add('pulse');
    
    // Actualizar el color del texto del botón de copiar según el brillo del color
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    document.documentElement.style.setProperty('--primary-gradient', `linear-gradient(45deg, rgba(${r}, ${g}, ${b}, 0.8), rgba(${r}, ${g}, ${b}, 0.4))`);
}

// Función para establecer un color predefinido
function setPreset(r, g, b, a) {
    redSlider.value = r;
    greenSlider.value = g;
    blueSlider.value = b;
    alphaSlider.value = a;
    updateColor();
}

// Función para copiar el código hexadecimal al portapapeles
function copyHexCode() {
    const hexCode = hexCodeSpan.textContent;
    navigator.clipboard.writeText(hexCode).then(() => {
    // Mostrar notificación
    copyNotification.classList.add('show');
    setTimeout(() => {
        copyNotification.classList.remove('show');
    }, 2000);
    });
}

// Eventos
redSlider.addEventListener('input', updateColor);
greenSlider.addEventListener('input', updateColor);
blueSlider.addEventListener('input', updateColor);
alphaSlider.addEventListener('input', updateColor);
copyButton.addEventListener('click', copyHexCode);

// Inicializar
updateColor();

// Función para generar un color aleatorio
function randomColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    setPreset(r, g, b, 1);
}

// Añadir botón de color aleatorio
const presetContainer = document.querySelector('.preset-container');
const randomButton = document.createElement('button');
randomButton.className = 'preset-button';
randomButton.style.background = 'linear-gradient(45deg, #ff0000, #00ff00, #0000ff)';
randomButton.style.backgroundSize = '300% 300%';
randomButton.style.animation = 'gradientText 5s ease infinite';
randomButton.textContent = 'Aleatorio';
randomButton.addEventListener('click', randomColor);
presetContainer.appendChild(randomButton);