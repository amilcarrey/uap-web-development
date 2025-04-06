    let currentPlayer = 'X';
    let gameState = ['', '', '', '', '', '', '', '', ''];

    const cells = document.querySelectorAll('.cell');
    const resetButton = document.getElementById('reset');

    // Maneja el click en las celdas
    cells.forEach(cell => {
        cell.addEventListener('click', (e) => {
            const cellId = e.target.getAttribute('data-id');

            if (gameState[cellId] === '') {
                gameState[cellId] = currentPlayer;
                e.target.textContent = currentPlayer;
                currentPlayer = currentPlayer === 'X' ? 'O' : 'X';

                // Enviar el estado al servidor
                sendGameState();
            }
        });
    });

    // Función para enviar el estado del juego al servidor
    function sendGameState() {
        const gameStateString = gameState.join('');

        fetch('save_game.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: 'gameState=' + encodeURIComponent(gameStateString)
        })
        .then(response => response.json())
        .then(data => {
            if (data.winner) {
                alert(`${data.winner} ganó!`);
                resetGame();
            } else if (data.draw) {
                alert('Empate!');
                resetGame();
            }
        })
        .catch(error => console.error('Error al guardar:', error));
    }

    // Reiniciar el juego
    resetButton.addEventListener('click', () => {
        resetGame();
        sendGameState();  // Enviar el estado vacío al servidor
    });

    // Reiniciar estado local y actualizar el tablero
    function resetGame() {
        gameState = ['', '', '', '', '', '', '', '', ''];
        cells.forEach(cell => {
            cell.textContent = '';
        });
        currentPlayer = 'X';
    }
