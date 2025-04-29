const red = document.getElementById("red");
const green = document.getElementById("green");
const blue = document.getElementById("blue");

const redValue = document.getElementById("redValue")
const greenValue = document.getElementById("greenValue");
const blueValue = document.getElementById("blueValue");

const colorBox = document.getElementById("colorBox");
const hexValue = document.getElementById("hexValue");

function updateColor () {
    const r = parseInt(red.value);
    const g = parseInt(green.value);
    const b = parseInt(blue.value);

    redValue.textContent = r;
    greenValue.textContent = g;
    blueValue.textContent = b;

    const rgb = `rgb(${r}, ${g}, ${b})`;
    colorBox.style.backgroundColor = rgb;

    const hex = "#" + [r, g, b].map(x => x.toString(16).padStart(2, "0")).join("");
    hexValue.textContent = hex



}

red.addEventListener("input", updateColor);
green.addEventListener("input", updateColor);
blue.addEventListener("input", updateColor);

// Inicializar con valores por defecto
updateColor();

