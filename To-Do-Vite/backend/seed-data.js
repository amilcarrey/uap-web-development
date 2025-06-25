const { query, run } = require('./config/db');
const bcrypt = require('bcrypt');

const seedDatabase = async () => {
  try {
    console.log('🌱 Iniciando inserción de datos de prueba...');

    // 1. Crear usuarios de prueba
    const users = [
      { username: 'luca', password: 'admin123', is_admin: 1 },
      { username: 'maria', password: 'password123', is_admin: 0 },
      { username: 'juan', password: 'password123', is_admin: 0 },
      { username: 'ana', password: 'password123', is_admin: 0 }
    ];

    for (const user of users) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      await run(
        'INSERT OR IGNORE INTO users (username, password, is_admin) VALUES (?, ?, ?)',
        [user.username, hashedPassword, user.is_admin]
      );
    }

    // 2. Obtener IDs de usuarios
    const lucaResult = await query('SELECT id FROM users WHERE username = ?', ['luca']);
    const mariaResult = await query('SELECT id FROM users WHERE username = ?', ['maria']);
    const juanResult = await query('SELECT id FROM users WHERE username = ?', ['juan']);
    const anaResult = await query('SELECT id FROM users WHERE username = ?', ['ana']);

    const lucaId = lucaResult.rows[0].id;
    const mariaId = mariaResult.rows[0].id;
    const juanId = juanResult.rows[0].id;
    const anaId = anaResult.rows[0].id;

    // 3. Crear tableros de prueba
    const boards = [
      { name: 'Tareas Personales', category: 'Personal', user_id: lucaId },
      { name: 'Proyectos Universidad', category: 'Universidad', user_id: lucaId },
      { name: 'Compras Casa', category: 'Personal', user_id: mariaId },
      { name: 'Estudios Programación', category: 'Universidad', user_id: juanId }
    ];

    for (const board of boards) {
      await run(
        'INSERT OR IGNORE INTO boards (name, category, user_id) VALUES (?, ?, ?)',
        [board.name, board.category, board.user_id]
      );
    }

    // 4. Obtener IDs de tableros
    const personalBoardResult = await query('SELECT id FROM boards WHERE name = ?', ['Tareas Personales']);
    const uniBoardResult = await query('SELECT id FROM boards WHERE name = ?', ['Proyectos Universidad']);
    const comprasBoardResult = await query('SELECT id FROM boards WHERE name = ?', ['Compras Casa']);
    const estudiosBoardResult = await query('SELECT id FROM boards WHERE name = ?', ['Estudios Programación']);

    const personalBoardId = personalBoardResult.rows[0].id;
    const uniBoardId = uniBoardResult.rows[0].id;
    const comprasBoardId = comprasBoardResult.rows[0].id;
    const estudiosBoardId = estudiosBoardResult.rows[0].id;

    // 5. Compartir tableros
    await run(
      'INSERT OR IGNORE INTO board_users (board_id, user_id, role) VALUES (?, ?, ?)',
      [personalBoardId, mariaId, 'editor']
    );
    await run(
      'INSERT OR IGNORE INTO board_users (board_id, user_id, role) VALUES (?, ?, ?)',
      [uniBoardId, juanId, 'viewer']
    );
    await run(
      'INSERT OR IGNORE INTO board_users (board_id, user_id, role) VALUES (?, ?, ?)',
      [comprasBoardResult.rows[0].id, lucaId, 'editor']
    );

    // 6. Crear tareas de prueba
    const tasks = [
      // Tareas Personales (Luca)
      { board_id: personalBoardId, text: 'Hacer ejercicio', completed: 0 },
      { board_id: personalBoardId, text: 'Comprar víveres', completed: 1 },
      { board_id: personalBoardId, text: 'Llamar al médico', completed: 0 },
      { board_id: personalBoardId, text: 'Pagar facturas', completed: 0 },
      { board_id: personalBoardId, text: 'Limpiar la casa', completed: 1 },

      // Proyectos Universidad (Luca)
      { board_id: uniBoardId, text: 'Terminar proyecto de React', completed: 0 },
      { board_id: uniBoardId, text: 'Estudiar para el examen', completed: 0 },
      { board_id: uniBoardId, text: 'Entregar tarea de backend', completed: 1 },
      { board_id: uniBoardId, text: 'Revisar código del equipo', completed: 0 },
      { board_id: uniBoardId, text: 'Preparar presentación', completed: 0 },

      // Compras Casa (María)
      { board_id: comprasBoardId, text: 'Comprar leche', completed: 0 },
      { board_id: comprasBoardId, text: 'Comprar pan', completed: 1 },
      { board_id: comprasBoardId, text: 'Comprar frutas', completed: 0 },
      { board_id: comprasBoardId, text: 'Comprar detergente', completed: 0 },

      // Estudios Programación (Juan)
      { board_id: estudiosBoardId, text: 'Aprender JavaScript', completed: 1 },
      { board_id: estudiosBoardId, text: 'Practicar React Hooks', completed: 0 },
      { board_id: estudiosBoardId, text: 'Estudiar TypeScript', completed: 0 },
      { board_id: estudiosBoardId, text: 'Hacer proyecto personal', completed: 0 }
    ];

    for (const task of tasks) {
      await run(
        'INSERT OR IGNORE INTO tasks (board_id, text, completed) VALUES (?, ?, ?)',
        [task.board_id, task.text, task.completed]
      );
    }

    // 7. Crear enlaces compartidos de prueba
    const crypto = require('crypto');
    const token1 = crypto.randomBytes(32).toString('hex');
    const token2 = crypto.randomBytes(32).toString('hex');

    await run(
      'INSERT OR IGNORE INTO shared_links (board_id, token, expires_at) VALUES (?, ?, datetime("now", "+30 days"))',
      [personalBoardId, token1]
    );
    await run(
      'INSERT OR IGNORE INTO shared_links (board_id, token, expires_at) VALUES (?, ?, datetime("now", "+7 days"))',
      [uniBoardId, token2]
    );

    console.log('✅ Datos de prueba insertados exitosamente!');
    console.log('\n🔑 Credenciales de prueba:');
    console.log('- Admin: luca / admin123');
    console.log('- Usuario: maria / password123');
    console.log('- Usuario: juan / password123');
    console.log('- Usuario: ana / password123');

  } catch (error) {
    console.error('❌ Error al insertar datos de prueba:', error);
  }
};

// Ejecutar si se llama directamente
if (require.main === module) {
  seedDatabase().then(() => {
    console.log('🎉 Proceso completado!');
    process.exit(0);
  }).catch((error) => {
    console.error('💥 Error:', error);
    process.exit(1);
  });
}

module.exports = { seedDatabase }; 