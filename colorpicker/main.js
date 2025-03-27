document.querySelectorAll('.color-picker .sliders div input').forEach(range => {
    range.oninput = function() {
        let r = document.querySelectorAll('.color-picker .sliders div input')[0].value;
        let g = document.querySelectorAll('.color-picker .sliders div input')[1].value;
        let b = document.querySelectorAll('.color-picker .sliders div input')[2].value;

        document.querySelector('.color-picker .color-preview').style.background = `rgb(${r}, ${g}, ${b})`;

        document.querySelector('.r-value').innerText = r;
        document.querySelector('.g-value').innerText = g;
        document.querySelector('.b-value').innerText = b;

        // Convertir RGB a HEX y actualizar el texto
        let hexColor = rgbToHex(r, g, b);
        document.querySelector('.hex-value').innerText = hexColor;
    };
});

// Función para convertir RGB a HEX
function rgbToHex(r, g, b) {
    return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1).toUpperCase()}`;
}

// Función para copiar el HEX al portapapeles
document.querySelector('.copy-hex').onclick = function() {
    let hexColor = document.querySelector('.hex-value').innerText;
    navigator.clipboard.writeText(hexColor).then(() => {
        alert(`¡Color ${hexColor} copiado!`);
    });
};

