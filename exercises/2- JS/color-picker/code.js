// Seleccionar los elementos necesarios
const redInput = document.getElementById('red');
const greenInput = document.getElementById('green');
const blueInput = document.getElementById('blue');

const redLabel = document.getElementById('red_label');
const greenLabel = document.getElementById('green_label');
const blueLabel = document.getElementById('blue_label');

const colorBox = document.querySelector('.color-display-box');

// Función para actualizar el valor del label
function updateLabel(input, label) {
    label.textContent = input.value;
}

// Función para actualizar el color del cuadro
function updateColorBox() {
    const valR = redInput.value;
    const valG = greenInput.value;
    const valB = blueInput.value;

    // Cambiar el color de fondo del cuadro
    colorBox.style.backgroundColor = `rgb(${valR}, ${valG}, ${valB})`;

    // Actualizar el texto del color en formato HEX
    const hexColor = rgbToHex(valR, valG, valB);
    document.getElementById('color-display-text').textContent = `HEX: ${hexColor}`;
}

// Función para convertir RGB a HEX
function rgbToHex(r, g, b) {
    return (
        '#' +
        [r, g, b]
            .map((x) => {
                const hex = parseInt(x).toString(16);
                return hex.length === 1 ? '0' + hex : hex;
            })
            .join('')
    );
}

// Escuchar el evento 'input' en cada control deslizante
redInput.addEventListener('input', () => {
    updateLabel(redInput, redLabel);
    updateColorBox();
});
greenInput.addEventListener('input', () => {
    updateLabel(greenInput, greenLabel);
    updateColorBox();
});
blueInput.addEventListener('input', () => {
    updateLabel(blueInput, blueLabel);
    updateColorBox();
});