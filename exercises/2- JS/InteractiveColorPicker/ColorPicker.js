
const redSlider = document.getElementById("redSlider");
const greenSlider = document.getElementById("greenSlider");
const blueSlider = document.getElementById("blueSlider");
const screen = document.getElementById("Screen");
const hexDisplay = document.getElementById("hexValue");
const redValue = document.getElementById("R-value");
const greenValue = document.getElementById("G-value");
const blueValue = document.getElementById("B-value");
const resetButton = document.getElementById("resetButton");


function updateColor() {
    // Obtener los valores actuales de los sliders
    const r = redSlider.value;
    const g = greenSlider.value;
    const b = blueSlider.value;


    redValue.textContent = r;
    greenValue.textContent = g;
    blueValue.textContent = b;

    
    const color = `rgb(${r}, ${g}, ${b})`;//"rgb(255, 0, 0)"
    screen.style.backgroundColor = color;
    
    //ASEGURAMOS QUE AUNQUE SEA TENGA 2 DIGITOS, SIEMPRE SE MUESTRE EN HEXADECIMAL
    const hexColor = `#${parseInt(r).toString(16).padStart(2, '0')}${parseInt(g).toString(16).padStart(2, '0')}${parseInt(b).toString(16).padStart(2, '0')}`;
    hexDisplay.textContent = hexColor.toUpperCase();
}
function resetSliders() {
    redSlider.value = 0;
    greenSlider.value = 0;
    blueSlider.value = 0;
    updateColor();  
}


redSlider.addEventListener("input", updateColor);
greenSlider.addEventListener("input", updateColor);
blueSlider.addEventListener("input", updateColor);
resetButton.addEventListener("click", resetSliders);

// Llamar a la función una vez al cargar la página
updateColor();