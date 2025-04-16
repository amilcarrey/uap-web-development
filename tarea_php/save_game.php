<?php
if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['gameState'])) {
    // Recibir el estado del juego
    $gameState = $_POST['gameState'];

    // Verificar ganador
    $winner = checkWinner($gameState);

    if ($winner) {
        echo json_encode(['winner' => $winner]);
        exit();
    }

    // Verificar empate
    if (strpos($gameState, '') === false) {
        echo json_encode(['draw' => true]);
        exit();
    }

    echo json_encode(['winner' => null]); // Si no hay ganador ni empate
}

function checkWinner($board) {
    // Comprobar combinaciones ganadoras
    $winningPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // filas
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // columnas
        [0, 4, 8], [2, 4, 6]              // diagonales
    ];

    foreach ($winningPatterns as $pattern) {
        list($a, $b, $c) = $pattern;
        if ($board[$a] && $board[$a] === $board[$b] && $board[$a] === $board[$c]) {
            return $board[$a]; // 'X' o 'O' ganador
        }
    }
    return null;
}
?>
