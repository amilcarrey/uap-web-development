const sliderR = document.getElementById('sliderR');
const valueR = document.getElementById('valueR');

const sliderG = document.getElementById('sliderG');
const valueG = document.getElementById('valueG');

const sliderB = document.getElementById('sliderB');
const valueB = document.getElementById('valueB');

const button = document.getElementById('Cambiame');
const colorCodeElement = document.getElementById('colorCode');

function updateRed(value) {
    valueR.textContent = value;
    updateColor(); 
}

function updateGreen(value) {
    valueG.textContent = value;
    updateColor(); 
}

function updateBlue(value) {
    valueB.textContent = value;
    updateColor(); 
}

function updateColor() {
    const r = sliderR.value;
    const g = sliderG.value;
    const b = sliderB.value;

    button.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;

    const hexColor = rgbToHex(r, g, b);
    colorCodeElement.textContent = hexColor;
}

function rgbToHex(r, g, b) {
    const toHex = (x) => {
        const hex = x.toString(16);  
        return hex.length === 1 ? '0' + hex : hex;  
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`; 
}

updateColor();

function reset() {
    sliderR.value = 128;
    sliderG.value = 128;
    sliderB.value = 128;
    valueR.textContent = 128;
    valueG.textContent = 128;
    valueB.textContent = 128;
    updateColor(); 
}

function setColor(r, g, b) {
    sliderR.value = r;
    sliderG.value = g;
    sliderB.value = b;
    valueR.textContent = r;
    valueG.textContent = g;
    valueB.textContent = b;
    updateColor(); 
}
