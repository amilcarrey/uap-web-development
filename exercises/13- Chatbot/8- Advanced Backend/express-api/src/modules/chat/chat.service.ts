import fetch from 'node-fetch';
import { TodoRepository } from '../todo/todo.repository';
import { BoardRepository } from '../board/board.repository';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

interface Tool {
    type: 'function';
    function: {
        name: string;
        description: string;
        parameters: {
            type: string;
            properties: Record<string, any>;
            required: string[];
        };
    };
}

// Funciones de validación de parámetros
const validateNumber = (value: any, fieldName: string): { valid: boolean; error?: string } => {
    if (typeof value !== 'number' || !Number.isInteger(value) || value < 0) {
        return { valid: false, error: `${fieldName} debe ser un número entero no negativo` };
    }
    return { valid: true };
};

const validateString = (value: any, fieldName: string, minLength: number = 1, maxLength: number = 1000): { valid: boolean; error?: string } => {
    if (typeof value !== 'string') {
        return { valid: false, error: `${fieldName} debe ser un string` };
    }
    const trimmed = value.trim();
    if (trimmed.length < minLength) {
        return { valid: false, error: `${fieldName} debe tener al menos ${minLength} caracteres` };
    }
    if (trimmed.length > maxLength) {
        return { valid: false, error: `${fieldName} no puede exceder ${maxLength} caracteres` };
    }
    return { valid: true };
};

const validateStringOptional = (value: any, fieldName: string, maxLength: number = 1000): { valid: boolean; error?: string } => {
    if (value === undefined || value === null || value === '') {
        return { valid: true };
    }
    if (typeof value !== 'string') {
        return { valid: false, error: `${fieldName} debe ser un string` };
    }
    if (value.trim().length > maxLength) {
        return { valid: false, error: `${fieldName} no puede exceder ${maxLength} caracteres` };
    }
    return { valid: true };
};

const sanitizeString = (str: string): string => {
    return str
        .trim()
        .slice(0, 1000)
        .replace(/[<>]/g, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=/gi, '');
};

export class ChatService {
    private todoRepository = new TodoRepository();
    private boardRepository = new BoardRepository();
    private openrouterApiKey = process.env.OPENROUTER_API_KEY;
    private openrouterBaseUrl = process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1';

    // Definir las herramientas disponibles
    private tools: Tool[] = [
        {
            type: 'function',
            function: {
                name: 'createTask',
                description: 'Crear una nueva tarea en un tablero con prioridad, categoría y descripción',
                parameters: {
                    type: 'object',
                    properties: {
                        text: {
                            type: 'string',
                            description: 'Texto/título de la tarea (requerido)'
                        },
                        boardId: {
                            type: 'number',
                            description: 'ID del tablero donde crear la tarea (requerido)'
                        },
                        priority: {
                            type: 'string',
                            enum: ['low', 'medium', 'high'],
                            description: 'Nivel de prioridad (opcional, default: medium)'
                        },
                        category: {
                            type: 'string',
                            enum: ['work', 'personal', 'shopping', 'health', 'other'],
                            description: 'Categoría de la tarea (opcional)'
                        },
                        description: {
                            type: 'string',
                            description: 'Descripción detallada (opcional)'
                        },
                        due_date: {
                            type: 'string',
                            description: 'Fecha de vencimiento en formato ISO 8601 (opcional)'
                        }
                    },
                    required: ['text', 'boardId']
                }
            }
        },
        {
            type: 'function',
            function: {
                name: 'updateTask',
                description: 'Actualizar una tarea (texto, prioridad, categoría, estado, etc)',
                parameters: {
                    type: 'object',
                    properties: {
                        todoId: {
                            type: 'number',
                            description: 'ID de la tarea a actualizar (requerido)'
                        },
                        boardId: {
                            type: 'number',
                            description: 'ID del tablero que contiene la tarea (requerido)'
                        },
                        text: {
                            type: 'string',
                            description: 'Nuevo texto/título (opcional)'
                        },
                        priority: {
                            type: 'string',
                            enum: ['low', 'medium', 'high'],
                            description: 'Nueva prioridad (opcional)'
                        },
                        category: {
                            type: 'string',
                            enum: ['work', 'personal', 'shopping', 'health', 'other'],
                            description: 'Nueva categoría (opcional)'
                        },
                        description: {
                            type: 'string',
                            description: 'Nueva descripción (opcional)'
                        },
                        due_date: {
                            type: 'string',
                            description: 'Nueva fecha de vencimiento (opcional)'
                        },
                        completed: {
                            type: 'boolean',
                            description: 'Marcar como completada/incompleta (opcional)'
                        }
                    },
                    required: ['todoId', 'boardId']
                }
            }
        },
        {
            type: 'function',
            function: {
                name: 'toggleTask',
                description: 'Marcar una tarea como completada o incompleta',
                parameters: {
                    type: 'object',
                    properties: {
                        todoId: {
                            type: 'number',
                            description: 'ID de la tarea a marcar (requerido)'
                        },
                        boardId: {
                            type: 'number',
                            description: 'ID del tablero que contiene la tarea (requerido)'
                        }
                    },
                    required: ['todoId', 'boardId']
                }
            }
        },
        {
            type: 'function',
            function: {
                name: 'deleteTask',
                description: 'Eliminar una tarea (soft delete por defecto, hard delete si permanently=true)',
                parameters: {
                    type: 'object',
                    properties: {
                        todoId: {
                            type: 'number',
                            description: 'ID de la tarea a eliminar (requerido)'
                        },
                        boardId: {
                            type: 'number',
                            description: 'ID del tablero que contiene la tarea (requerido)'
                        },
                        permanently: {
                            type: 'boolean',
                            description: 'Si true: eliminar permanentemente; si false: mover a papelera (opcional, default: false)'
                        }
                    },
                    required: ['todoId', 'boardId']
                }
            }
        },
        {
            type: 'function',
            function: {
                name: 'searchTasks',
                description: 'Buscar y filtrar tareas por múltiples criterios',
                parameters: {
                    type: 'object',
                    properties: {
                        boardId: {
                            type: 'number',
                            description: 'ID del tablero (requerido)'
                        },
                        search: {
                            type: 'string',
                            description: 'Texto para buscar en títulos y descripciones (opcional)'
                        },
                        priority: {
                            type: 'string',
                            enum: ['low', 'medium', 'high'],
                            description: 'Filtrar por prioridad (opcional)'
                        },
                        category: {
                            type: 'string',
                            enum: ['work', 'personal', 'shopping', 'health', 'other'],
                            description: 'Filtrar por categoría (opcional)'
                        },
                        completed: {
                            type: 'boolean',
                            description: 'Filtrar por estado: true=completadas, false=pendientes (opcional)'
                        },
                        filter: {
                            type: 'string',
                            enum: ['all', 'completed', 'uncompleted'],
                            description: 'Filtro legado (opcional, default: all)'
                        },
                        sort_by: {
                            type: 'string',
                            enum: ['created_at', 'due_date', 'priority', 'text'],
                            description: 'Ordenar por campo (opcional, default: created_at)'
                        },
                        sort_order: {
                            type: 'string',
                            enum: ['asc', 'desc'],
                            description: 'Orden ascendente o descendente (opcional, default: asc)'
                        }
                    },
                    required: ['boardId']
                }
            }
        },
        {
            type: 'function',
            function: {
                name: 'getTaskStats',
                description: 'Obtener estadísticas detalladas de tareas con agrupación por prioridad y categoría',
                parameters: {
                    type: 'object',
                    properties: {
                        boardId: {
                            type: 'number',
                            description: 'ID del tablero (requerido)'
                        }
                    },
                    required: ['boardId']
                }
            }
        },
        {
            type: 'function',
            function: {
                name: 'clearCompletedTasks',
                description: 'Eliminar todas las tareas completadas en un tablero (soft delete)',
                parameters: {
                    type: 'object',
                    properties: {
                        boardId: {
                            type: 'number',
                            description: 'ID del tablero (requerido)'
                        }
                    },
                    required: ['boardId']
                }
            }
        }
    ];

    async processMessage(userId: string, messages: Message[], boardId?: number, conversationId?: string) {
        try {
            // Validar API key
            // if (!this.openrouterApiKey) {
            //     throw new Error('OpenRouter API key not configured');
            // }

            // Agregar contexto del boardId al sistema
            const systemMessage = boardId 
                ? `Eres un asistente inteligente para gestionar tareas en un tablero Kanban.

EL USUARIO ESTÁ TRABAJANDO EN EL TABLERO ID: ${boardId}

INSTRUCCIONES CRÍTICAS PARA EJECUTAR HERRAMIENTAS:
1. SIEMPRE incluye "boardId": ${boardId} en TODOS los parámetros de las herramientas
2. Para createTask: usa text, boardId: ${boardId}, y opcionalmente priority, category, description, due_date
3. Para updateTask: usa todoId, boardId: ${boardId}, y los campos que deseas actualizar
4. Para deleteTask: usa todoId, boardId: ${boardId}, y opcionalmente permanently=true para eliminar definitivamente
5. Para searchTasks: usa boardId: ${boardId}, y opcionalmente search, priority, category, completed, sort_by, sort_order
6. Para getTaskStats: usa boardId: ${boardId}

INTERPRETACIÓN DE PRIORIDADES:
- "urgente", "importante", "crítico", "asap", "now" → priority: "high"
- "normal", "regular" → priority: "medium"
- "puede esperar", "low priority" → priority: "low"
- Si no se especifica → priority: "medium"

INTERPRETACIÓN DE CATEGORÍAS:
- "trabajo", "laboral", "proyecto", "empresa" → category: "work"
- "personal", "privado", "casa" → category: "personal"
- "compra", "compras", "tienda", "supermercado" → category: "shopping"
- "salud", "médico", "doctor", "ejercicio" → category: "health"
- Cualquier otra cosa → category: "other"
- Si no se especifica → déjalo vacío

MANEJO DE SOFT DELETE:
- Por defecto, deleteTask hace soft delete (mueve a papelera)
- Solo usa permanently=true si el usuario explícitamente pide "eliminar definitivamente" o "borrar permanentemente"

NO preguntes por el boardId. NUNCA dejes vacío el parámetro boardId.
SIEMPRE usa boardId = ${boardId} en todas las operaciones.
Todas las acciones del usuario se refieren a las tareas en el tablero ${boardId}.

Si el usuario pide crear, actualizar, eliminar o buscar tareas, ejecuta la herramienta correspondiente CON boardId: ${boardId}.`
                : `Eres un asistente inteligente para gestionar tareas en un tablero Kanban.
Ayuda al usuario a crear, actualizar, eliminar y buscar tareas.

INTERPRETACIÓN DE PRIORIDADES:
- "urgente", "importante", "crítico" → priority: "high"
- "normal", "regular" → priority: "medium"
- "puede esperar" → priority: "low"
- Si no se especifica → priority: "medium"

INTERPRETACIÓN DE CATEGORÍAS:
- "trabajo", "laboral" → category: "work"
- "personal" → category: "personal"
- "compra", "compras" → category: "shopping"
- "salud", "médico", "ejercicio" → category: "health"
- Otra → category: "other"
- Si no se especifica → déjalo vacío

Cuando el usuario te dé instrucciones, intenta entender el contexto y ejecuta las acciones apropiadas.
IMPORTANTE: Siempre incluye el boardId en los parámetros cuando ejecutes herramientas.`;

            const messagesWithSystem = [
                { role: 'system' as const, content: systemMessage },
                ...messages
            ];

            // Llamar a OpenRouter con tool calling
            const response = await fetch(`${this.openrouterBaseUrl}/chat/completions`, { // 
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.openrouterApiKey}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': process.env.OPENROUTER_REFERRER || 'http://localhost:5173',
                    'X-Title': 'AI Todo Manager'
                },
                body: JSON.stringify({
                    model: process.env.OPENROUTER_MODEL || 'gpt-3.5-turbo',
                    messages: messagesWithSystem,
                    tools: this.tools,
                    tool_choice: 'auto',
                    temperature: 0.7,
                    max_tokens: 1000
                })
            });

            if (!response.ok) {
                const errorData = await response.json() as any;
                throw new Error(`OpenRouter error: ${errorData.error?.message || 'Unknown error'}`);
            }

            const data = await response.json() as any;
            const assistantMessage = data.choices?.[0]?.message;

            if (!assistantMessage) {
                throw new Error('No response from OpenRouter');
            }

            // Si el LLM quiere ejecutar tools
            if (assistantMessage.tool_calls && assistantMessage.tool_calls.length > 0) {
                console.log(`[CHAT] LLM wants to execute ${assistantMessage.tool_calls.length} tools`);
                const toolResults = [];

                for (const toolCall of assistantMessage.tool_calls) {
                    try {
                        console.log(`[TOOL] Executing tool: ${toolCall.function.name}`);
                        console.log(`[TOOL] Raw arguments: ${toolCall.function.arguments}`);

                        // Parse arguments con validación
                        let parsedArgs;
                        try {
                            parsedArgs = JSON.parse(toolCall.function.arguments);
                        } catch (parseError) {
                            console.error(`[TOOL] Failed to parse arguments: ${parseError}`);
                            toolResults.push({
                                toolCallId: toolCall.id,
                                toolName: toolCall.function.name,
                                result: {
                                    success: false,
                                    error: 'Invalid tool arguments'
                                }
                            });
                            continue;
                        }

                        // IMPORTANTE: Inyectar boardId si no está presente
                        if (boardId && !parsedArgs.boardId) {
                            console.log(`[TOOL] Injecting boardId: ${boardId}`);
                            parsedArgs.boardId = boardId;
                        }

                        console.log(`[TOOL] Parsed arguments:`, parsedArgs);

                        const result = await this.executeTool(
                            userId,
                            toolCall.function.name,
                            parsedArgs
                        );

                        console.log(`[TOOL] Tool result:`, result);

                        toolResults.push({
                            toolCallId: toolCall.id,
                            toolName: toolCall.function.name,
                            result
                        });
                    } catch (toolError) {
                        console.error(`[TOOL] Error executing tool: ${toolError}`);
                        toolResults.push({
                            toolCallId: toolCall.id,
                            toolName: toolCall.function.name,
                            result: {
                                success: false,
                                error: toolError instanceof Error ? toolError.message : 'Unknown error'
                            }
                        });
                    }
                }

                console.log(`[CHAT] Tool results:`, toolResults);

                return {
                    conversationId,
                    message: assistantMessage.content || 'Ejecutando acciones...',
                    toolResults,
                    role: 'assistant'
                };
            }

            // Respuesta normal sin tools
            return {
                conversationId,
                message: assistantMessage.content || 'Sin respuesta',
                role: 'assistant'
            };

        } catch (error) {
            console.error('Error processing message:', error);
            throw error;
        }
    }

    async executeTool(userId: string, toolName: string, params: any) {
        switch (toolName) {
            case 'createTask':
                return await this.createTask(params);
            case 'updateTask':
                return await this.updateTask(params);
            case 'toggleTask':
                return await this.toggleTask(params);
            case 'deleteTask':
                return await this.deleteTask(params);
            case 'searchTasks':
                return await this.searchTasks(params);
            case 'getTaskStats':
                return await this.getTaskStats(params);
            case 'clearCompletedTasks':
                return await this.clearCompletedTasks(params);
            default:
                throw new Error(`Unknown tool: ${toolName}`);
        }
    }

    private async createTask(params: any) {
        try {
            const { text, boardId, priority = 'medium', category, description, due_date } = params;

            // Validar parámetros requeridos
            if (text === undefined || text === null || boardId === undefined || boardId === null) {
                return {
                    success: false,
                    error: 'text y boardId son requeridos'
                };
            }

            // Validar tipos y contenido
            const textValidation = validateString(text, 'text', 1, 500);
            if (!textValidation.valid) {
                return { success: false, error: textValidation.error };
            }

            const boardIdValidation = validateNumber(boardId, 'boardId');
            if (!boardIdValidation.valid) {
                return { success: false, error: boardIdValidation.error };
            }

            // Validar prioridad
            const validPriorities = ['low', 'medium', 'high'];
            if (priority && !validPriorities.includes(priority)) {
                return { success: false, error: `priority debe ser uno de: ${validPriorities.join(', ')}` };
            }

            // Validar categoría
            const validCategories = ['work', 'personal', 'shopping', 'health', 'other'];
            if (category && !validCategories.includes(category)) {
                return { success: false, error: `category debe ser uno de: ${validCategories.join(', ')}` };
            }

            // Validar descripción si está presente
            const descriptionValidation = validateStringOptional(description, 'description', 1000);
            if (!descriptionValidation.valid) {
                return { success: false, error: descriptionValidation.error };
            }

            // Sanitizar inputs
            const sanitizedText = sanitizeString(text);
            const sanitizedDescription = description ? sanitizeString(description) : undefined;

            const todo = await this.todoRepository.createTodo(boardId, {
                text: sanitizedText,
                priority,
                category,
                description: sanitizedDescription,
                due_date
            });

            const categoryLabel = category ? ` [${category}]` : '';
            const priorityEmoji = priority === 'high' ? '🔴' : priority === 'medium' ? '🟡' : '🟢';

            return {
                success: true,
                task: todo,
                message: `✅ Tarea creada: "${sanitizedText}" ${priorityEmoji} (Prioridad: ${priority}${categoryLabel})`
            };
        } catch (error) {
            console.error('Error creating task:', error);
            return {
                success: false,
                error: 'Error al crear la tarea',
                details: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }

    private async updateTask(params: any) {
        try {
            const { todoId, boardId, text, priority, category, description, due_date, completed } = params;

            // Validar parámetros requeridos
            if (todoId === undefined || todoId === null || boardId === undefined || boardId === null) {
                return {
                    success: false,
                    error: 'todoId y boardId son requeridos'
                };
            }

            // Validar tipos
            const todoIdValidation = validateNumber(todoId, 'todoId');
            if (!todoIdValidation.valid) {
                return { success: false, error: todoIdValidation.error };
            }

            const boardIdValidation = validateNumber(boardId, 'boardId');
            if (!boardIdValidation.valid) {
                return { success: false, error: boardIdValidation.error };
            }

            const existingTodo = await this.todoRepository.getTodoById(boardId, todoId);
            
            if (!existingTodo) {
                return {
                    success: false,
                    error: 'Tarea no encontrada'
                };
            }

            // Validar text si está presente
            if (text !== undefined) {
                const textValidation = validateString(text, 'text', 1, 500);
                if (!textValidation.valid) {
                    return { success: false, error: textValidation.error };
                }
            }

            // Validar prioridad si está presente
            const validPriorities = ['low', 'medium', 'high'];
            if (priority && !validPriorities.includes(priority)) {
                return { success: false, error: `priority debe ser uno de: ${validPriorities.join(', ')}` };
            }

            // Validar categoría si está presente
            const validCategories = ['work', 'personal', 'shopping', 'health', 'other'];
            if (category && !validCategories.includes(category)) {
                return { success: false, error: `category debe ser uno de: ${validCategories.join(', ')}` };
            }

            // Validar descripción si está presente
            const descriptionValidation = validateStringOptional(description, 'description', 1000);
            if (!descriptionValidation.valid) {
                return { success: false, error: descriptionValidation.error };
            }

            // Preparar datos de actualización
            const updateData: any = {};
            if (text !== undefined) updateData.text = sanitizeString(text);
            if (description !== undefined) updateData.description = description ? sanitizeString(description) : undefined;
            if (priority !== undefined) updateData.priority = priority;
            if (category !== undefined) updateData.category = category;
            if (due_date !== undefined) updateData.due_date = due_date;
            if (completed !== undefined) updateData.completed = completed;

            const updated = await this.todoRepository.updateTodo(boardId, todoId, updateData);

            return {
                success: true,
                task: updated,
                message: `✏️ Tarea actualizada: "${updated?.text}"`
            };
        } catch (error) {
            console.error('Error updating task:', error);
            return {
                success: false,
                error: 'Error al actualizar la tarea',
                details: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }

    private async toggleTask(params: any) {
        try {
            const { todoId, boardId } = params;

            // Validar parámetros requeridos
            if (todoId === undefined || todoId === null || boardId === undefined || boardId === null) {
                return {
                    success: false,
                    error: 'todoId y boardId son requeridos'
                };
            }

            // Validar tipos
            const todoIdValidation = validateNumber(todoId, 'todoId');
            if (!todoIdValidation.valid) {
                return { success: false, error: todoIdValidation.error };
            }

            const boardIdValidation = validateNumber(boardId, 'boardId');
            if (!boardIdValidation.valid) {
                return { success: false, error: boardIdValidation.error };
            }

            const existingTodo = await this.todoRepository.getTodoById(boardId, todoId);
            
            if (!existingTodo) {
                return {
                    success: false,
                    error: 'Tarea no encontrada'
                };
            }

            const updated = await this.todoRepository.toggleTodo(boardId, todoId);

            const status = updated?.completed ? '✅ Completada' : '⏳ Pendiente';

            return {
                success: true,
                task: updated,
                message: `${status}: "${updated?.text}"`
            };
        } catch (error) {
            console.error('Error toggling task:', error);
            return {
                success: false,
                error: 'Error al marcar la tarea',
                details: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }

    private async deleteTask(params: any) {
        try {
            const { todoId, boardId, permanently = false } = params;

            // Validar parámetros requeridos
            if (todoId === undefined || todoId === null || boardId === undefined || boardId === null) {
                return {
                    success: false,
                    error: 'todoId y boardId son requeridos'
                };
            }

            // Validar tipos
            const todoIdValidation = validateNumber(todoId, 'todoId');
            if (!todoIdValidation.valid) {
                return { success: false, error: todoIdValidation.error };
            }

            const boardIdValidation = validateNumber(boardId, 'boardId');
            if (!boardIdValidation.valid) {
                return { success: false, error: boardIdValidation.error };
            }

            const existingTodo = await this.todoRepository.getTodoById(boardId, todoId);
            
            if (!existingTodo) {
                return {
                    success: false,
                    error: 'Tarea no encontrada'
                };
            }

            if (permanently) {
                // Hard delete: permanently remove
                await this.todoRepository.hardDeleteTodo(boardId, todoId);
                return {
                    success: true,
                    message: `🗑️ Tarea eliminada permanentemente: "${existingTodo.text}"`,
                    deletedTask: { id: existingTodo.id, text: existingTodo.text }
                };
            } else {
                // Soft delete: move to trash
                await this.todoRepository.softDeleteTodo(boardId, todoId);
                return {
                    success: true,
                    message: `🗑️ Tarea movida a papelera: "${existingTodo.text}" (puedes restaurarla después)`,
                    deletedTask: { id: existingTodo.id, text: existingTodo.text }
                };
            }
        } catch (error) {
            console.error('Error deleting task:', error);
            return {
                success: false,
                error: 'Error al eliminar la tarea',
                details: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }

    private async searchTasks(params: any) {
        try {
            const { 
                boardId, 
                search, 
                filter = 'all',
                priority,
                category,
                completed,
                sort_by = 'created_at',
                sort_order = 'asc'
            } = params;

            // Validar parámetros requeridos
            if (boardId === undefined || boardId === null) {
                return {
                    success: false,
                    error: 'boardId es requerido'
                };
            }

            // Validar boardId
            const boardIdValidation = validateNumber(boardId, 'boardId');
            if (!boardIdValidation.valid) {
                return { success: false, error: boardIdValidation.error };
            }

            // Validar search si está presente
            const searchValidation = validateStringOptional(search, 'search', 200);
            if (!searchValidation.valid) {
                return { success: false, error: searchValidation.error };
            }

            // Validar filter
            const validFilters = ['all', 'completed', 'uncompleted'];
            if (typeof filter === 'string' && !validFilters.includes(filter)) {
                return { success: false, error: `filter debe ser uno de: ${validFilters.join(', ')}` };
            }

            // Validar priority si está presente
            const validPriorities = ['low', 'medium', 'high'];
            if (priority && !validPriorities.includes(priority)) {
                return { success: false, error: `priority debe ser uno de: ${validPriorities.join(', ')}` };
            }

            // Validar category si está presente
            const validCategories = ['work', 'personal', 'shopping', 'health', 'other'];
            if (category && !validCategories.includes(category)) {
                return { success: false, error: `category debe ser uno de: ${validCategories.join(', ')}` };
            }

            // Sanitizar search
            const sanitizedSearch = search ? sanitizeString(search) : '';

            // Determine completed filter from parameters
            let completedFilter: boolean | undefined = undefined;
            if (completed !== undefined) {
                completedFilter = completed;
            } else if (filter === 'completed') {
                completedFilter = true;
            } else if (filter === 'uncompleted') {
                completedFilter = false;
            }

            const result = await this.todoRepository.getAllTodos(boardId, {
                search: sanitizedSearch,
                priority,
                category,
                completed: completedFilter,
                sort_by,
                sort_order,
                page: 1,
                limit: 50
            });

            // Format results for chat display
            let message = '';
            if (result.todos.length === 0) {
                message = '📋 No se encontraron tareas';
            } else {
                message = `📋 Encontradas ${result.total} tarea(s):\n\n`;
                result.todos.forEach((task, index) => {
                    const status = task.completed ? '✅' : '⏳';
                    const priorityEmoji = task.priority === 'high' ? '🔴' : task.priority === 'medium' ? '🟡' : '🟢';
                    const categoryBadge = task.category ? ` [${task.category}]` : '';
                    const dueDateStr = task.due_date ? ` | Vence: ${new Date(task.due_date).toLocaleDateString('es-ES')}` : '';
                    
                    message += `${index + 1}. ${status} ${priorityEmoji} **${task.text}**${categoryBadge}${dueDateStr}\n`;
                    
                    if (task.description) {
                        message += `   └─ ${task.description}\n`;
                    }
                });
            }

            return {
                success: true,
                tasks: result.todos,
                count: result.total,
                message
            };
        } catch (error) {
            console.error('Error searching tasks:', error);
            return {
                success: false,
                error: 'Error al buscar tareas',
                details: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }

    private async getTaskStats(params: any) {
        try {
            const { boardId } = params;

            // Validar parámetros requeridos
            if (boardId === undefined || boardId === null) {
                return {
                    success: false,
                    error: 'boardId es requerido'
                };
            }

            // Validar boardId
            const boardIdValidation = validateNumber(boardId, 'boardId');
            if (!boardIdValidation.valid) {
                return { success: false, error: boardIdValidation.error };
            }

            const stats = await this.todoRepository.getTaskStats(boardId);
            const { summary, byPriority, byCategory } = stats;

            // Format statistics for chat display
            let message = `📊 **Estadísticas del Tablero:**\n\n`;
            
            message += `📈 **Resumen General:**\n`;
            message += `  • Total: ${summary.totalTasks} tareas\n`;
            message += `  • ✅ Completadas: ${summary.completedTasks}\n`;
            message += `  • ⏳ Pendientes: ${summary.pendingTasks}\n`;
            message += `  • 📊 Tasa de completitud: ${summary.completionRate}%\n`;
            
            if (summary.overdueTasks > 0) {
                message += `  • ⚠️ Vencidas: ${summary.overdueTasks}\n`;
            }

            message += `\n🔴 **Por Prioridad:**\n`;
            message += `  • 🔴 Alta: ${byPriority.high.completed}/${byPriority.high.total} completadas\n`;
            message += `  • 🟡 Media: ${byPriority.medium.completed}/${byPriority.medium.total} completadas\n`;
            message += `  • 🟢 Baja: ${byPriority.low.completed}/${byPriority.low.total} completadas\n`;

            message += `\n🏷️ **Por Categoría:**\n`;
            const categories = Object.entries(byCategory)
                .filter(([_, data]: [string, any]) => data.total > 0)
                .forEach(([cat, data]: [string, any]) => {
                    const catLabel = cat === 'sin_categoría' ? 'Sin categoría' : cat;
                    message += `  • ${catLabel}: ${data.completed}/${data.total} completadas\n`;
                });

            if (Object.values(byCategory).every((cat: any) => cat.total === 0)) {
                message += `  • (Sin tareas categorizadas)\n`;
            }

            return {
                success: true,
                stats,
                message
            };
        } catch (error) {
            console.error('Error getting stats:', error);
            return {
                success: false,
                error: 'Error al calcular estadísticas',
                details: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }

    private async clearCompletedTasks(params: any) {
        try {
            const { boardId } = params;

            // Validar parámetros requeridos
            if (boardId === undefined || boardId === null) {
                return {
                    success: false,
                    error: 'boardId es requerido'
                };
            }

            // Validar boardId
            const boardIdValidation = validateNumber(boardId, 'boardId');
            if (!boardIdValidation.valid) {
                return { success: false, error: boardIdValidation.error };
            }

            const count = await this.todoRepository.clearCompletedTodos(boardId);

            return {
                success: true,
                deletedCount: count,
                message: `🧹 Se eliminaron ${count} tareas completadas`
            };
        } catch (error) {
            console.error('Error clearing completed tasks:', error);
            return {
                success: false,
                error: 'Error al limpiar tareas completadas',
                details: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }
}