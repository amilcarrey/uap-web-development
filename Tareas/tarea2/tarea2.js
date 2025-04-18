const redSlider = document.getElementById("red");
const greenSlider = document.getElementById("green");
const blueSlider = document.getElementById("blue");

const redValue = document.getElementById("redValue");
const greenValue = document.getElementById("greenValue");
const blueValue = document.getElementById("blueValue");

const colorBox = document.getElementById("colorBox");
const hexValue = document.getElementById("hexValue");

function updateColor() {
    const r = parseInt(redSlider.value);
    const g = parseInt(greenSlider.value);
    const b = parseInt(blueSlider.value);

    redValue.textContent = r;
    greenValue.textContent = g;
    blueValue.textContent = b;

    const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`.toUpperCase();
    hexValue.textContent = hex;
    colorBox.style.backgroundColor = hex;
}

function setPreset(r, g, b) {
    redSlider.value = r;
    greenSlider.value = g;
    blueSlider.value = b;
    updateColor();
}

function resetColor() {
    setPreset(255, 255, 255);
}

redSlider.addEventListener("input", updateColor);
greenSlider.addEventListener("input", updateColor);
blueSlider.addEventListener("input", updateColor);
document.getElementById("reset").addEventListener("click", resetColor);

updateColor();
  