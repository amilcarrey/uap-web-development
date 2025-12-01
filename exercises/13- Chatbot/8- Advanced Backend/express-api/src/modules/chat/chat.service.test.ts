import { ChatService } from './chat.service';

/**
 * Test script para verificar que todas las 5 tools funcionan correctamente
 * 
 * Ejecución: npx ts-node src/modules/chat/chat.service.test.ts
 */

async function runTests() {
    const chatService = new ChatService();
    const userId = 'test-user-' + Date.now();
    const boardId = 1; // Asegúrate de que este tablero existe

    console.log('\n===== INICIANDO PRUEBAS DE TOOLS =====\n');

    // Test 1: createTask
    console.log('1️⃣ Probando createTask...');
    try {
        const createResult = await chatService.executeTool(userId, 'createTask', {
            text: 'Tarea de prueba creada ' + Date.now(),
            boardId
        });
        console.log('✅ createTask exitoso:', createResult);
        if (!createResult.success || !createResult.task) {
            throw new Error('createTask no retornó un task válido');
        }
        var taskId = createResult.task.id;
        console.log(`   Task ID creado: ${taskId}\n`);
    } catch (error) {
        console.error('❌ Error en createTask:', error);
        return;
    }

    // Test 2: updateTask
    console.log('2️⃣ Probando updateTask...');
    try {
        const updateResult = await chatService.executeTool(userId, 'updateTask', {
            todoId: taskId,
            boardId,
            text: 'Tarea actualizada ' + Date.now()
        });
        console.log('✅ updateTask exitoso:', updateResult);
        if (!updateResult.success || !updateResult.task) {
            throw new Error('updateTask no retornó un task válido');
        }
        console.log(`   Task actualizada\n`);
    } catch (error) {
        console.error('❌ Error en updateTask:', error);
        return;
    }

    // Test 3: searchTasks
    console.log('3️⃣ Probando searchTasks...');
    try {
        const searchResult = await chatService.executeTool(userId, 'searchTasks', {
            boardId,
            search: 'Tarea actualizada',
            filter: 'all'
        });
        console.log('✅ searchTasks exitoso:', searchResult);
        if (!searchResult.success || !Array.isArray(searchResult.tasks)) {
            throw new Error('searchTasks no retornó un array de tasks');
        }
        console.log(`   Encontradas ${searchResult.count} tarea(s)\n`);
    } catch (error) {
        console.error('❌ Error en searchTasks:', error);
        return;
    }

    // Test 4: getTaskStats
    console.log('4️⃣ Probando getTaskStats...');
    try {
        const statsResult = await chatService.executeTool(userId, 'getTaskStats', {
            boardId
        });
        console.log('✅ getTaskStats exitoso:', statsResult);
        if (!statsResult.success || !statsResult.stats) {
            throw new Error('getTaskStats no retornó estadísticas válidas');
        }
        console.log(`   Stats:`, statsResult.stats, '\n');
    } catch (error) {
        console.error('❌ Error en getTaskStats:', error);
        return;
    }

    // Test 5: deleteTask
    console.log('5️⃣ Probando deleteTask...');
    try {
        const deleteResult = await chatService.executeTool(userId, 'deleteTask', {
            todoId: taskId,
            boardId
        });
        console.log('✅ deleteTask exitoso:', deleteResult);
        if (!deleteResult.success) {
            throw new Error('deleteTask falló');
        }
        console.log(`   Task eliminada\n`);
    } catch (error) {
        console.error('❌ Error en deleteTask:', error);
        return;
    }

    console.log('===== TODAS LAS PRUEBAS COMPLETADAS EXITOSAMENTE =====\n');
}

// Ejecutar tests
runTests().catch(console.error);
