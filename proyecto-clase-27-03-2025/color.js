// Seleccionar elementos
const viewColor = document.querySelector(".view-color");
const sliders = document.querySelectorAll(".btn-range");
const hexDisplay = document.querySelector(".hex");
const resetBtn = document.querySelector(".reset");
const presetButtons = document.querySelectorAll(".btn-preset");

// Función para actualizar el color según los sliders
function updateColor() {
    const r = sliders[0].value;
    const g = sliders[1].value;
    const b = sliders[2].value;
    
    const rgbColor = `rgb(${r}, ${g}, ${b})`;
    viewColor.style.backgroundColor = rgbColor;
    hexDisplay.textContent = `HEX: ${rgbToHex(r, g, b)}`;
}

// Función para convertir RGB a HEX
function rgbToHex(r, g, b) {
    return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1).toUpperCase()}`;
}

// Asignar valores iniciales a los sliders
sliders.forEach((slider, index) => {
    slider.min = 0;
    slider.max = 255;
    slider.value = 0;
    slider.addEventListener("input", updateColor);
});

// Botón de reset
resetBtn.addEventListener("click", () => {
    sliders.forEach(slider => slider.value = 0);
    updateColor();
});

// Botones de colores predefinidos
presetButtons.forEach(button => {
    button.addEventListener("click", () => {
        const color = button.textContent.toLowerCase(); // Obtener color del texto del botón
        viewColor.style.backgroundColor = color;
        
        // Obtener valores RGB del color predefinido
        const tempDiv = document.createElement("div");
        tempDiv.style.color = color;
        document.body.appendChild(tempDiv);
        const computedColor = window.getComputedStyle(tempDiv).color;
        document.body.removeChild(tempDiv);
        
        const rgbValues = computedColor.match(/\d+/g); // Extraer valores RGB
        hexDisplay.textContent = `HEX: ${rgbToHex(...rgbValues)}`;
        
        // Actualizar sliders según el color predefinido
        sliders[0].value = rgbValues[0];
        sliders[1].value = rgbValues[1];
        sliders[2].value = rgbValues[2];
    });
});

// Inicializar color
updateColor();
