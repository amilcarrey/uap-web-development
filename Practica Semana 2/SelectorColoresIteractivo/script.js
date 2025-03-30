//Obtener los elementos del DOM (label, input)
const redSlider = document.getElementById('redSlider')
const greenSlider = document.getElementById('greenSlider')
const blueSlider = document.getElementById('blueSlider')

const redValue = document.getElementById('redValue') /*Obtiene los spam */
const greenValue = document.getElementById('greenValue')
const blueValue = document.getElementById('blueValue')

const colorDisplay = document.getElementById('colorDisplay') /*Ventana en donde se muestran los colores */
const hexValue = document.getElementById('hexValue') /*Donde se muestra el valor del color */

//FUNCION PAEA ACTUALIZAR EL COLOR
function updateColor(){
    //Obtener los valores RGB
    const red = redSlider.value;
    const green = greenSlider.value;
    const blue = blueSlider.value;

    //Crear el color RGB
    const rgbColor = `rgb(${red}, ${green}, ${blue})`;
    colorDisplay.style.backgroundColor = rgbColor; /*Modifica el color del contenedor*/

    //Convertir a HEX
    const hexColor = rgbToHex(parseInt(red), parseInt(green), parseInt(blue));
    hexValue.textContent = hexColor; //Modifica el texto que se muestra indicando el color

    //Quitar cualquier color que tenga el display por defecto
    document.querySelector('.preset-color').forEach(a => {
        a.classList.remove('selected');
    });
}

//Funcion para convertir RGB a HEX
function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
}

// Función para convertir HEX a RGB
function hexToRgb(hex) {
    // Eliminar el # si está presente
    hex = hex.replace('#', '');
    
    // Convertir a valores r, g, b
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    return { r, g, b };
}

// Escuchar cambios en los sliders
redSlider.addEventListener('input', updateColor);
greenSlider.addEventListener('input', updateColor);
blueSlider.addEventListener('input', updateColor);

//Inicializar
updateColor();
