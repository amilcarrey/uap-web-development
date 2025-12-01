import { Request, Response } from 'express';
import { TodoService } from './todo.service';
import { MutateTodoDto, TodoQueryParams } from '../../types';

export class TodoController {
    constructor(private todoService: TodoService) {}

    getAllTodos = async (req: Request, res: Response): Promise<void> => {
        try {
            const boardId = parseInt(req.params.boardId);
            if (isNaN(boardId)) {
                res.status(400).json({ error: 'Invalid board ID' });
                return;
            }
            const filter  = req.query.filter as string | undefined; 
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 5;
            const search = req.query.search as string | undefined;
            const todos = await this.todoService.getAllTodos(boardId, { filter, page, limit, search } as TodoQueryParams);
            if (!todos) {
                res.status(404).json({ error: 'No todos found for this board' });
                return;
            }
            res.json(todos);
        } catch (error) {
            console.error('Error fetching todos:', error);
            res.status(500).json({ error: 'Failed to fetch todos' });
        }
    };

    getTodoById = async (req: Request, res: Response): Promise<void> => {
        try {
            const todoId = parseInt(req.params.id);
            const boardId = parseInt(req.params.boardId);
            if (isNaN(todoId) || isNaN(boardId)) {
                res.status(400).json({ error: 'Invalid todo or board ID' });
                return;
            }
            const todo = await this.todoService.getTodoById(boardId, todoId);
            if (!todo) {
                res.status(404).json({ error: 'Todo not found' });
                return;
            }
            res.json(todo);
        } catch (error) {
            console.error('Error fetching todo:', error);
            res.status(500).json({ error: 'Failed to fetch todo' });
        }
    };

    createTodo = async (req: Request, res: Response): Promise<void> => {
        try {
            const boardId = parseInt(req.params.boardId);
            if (isNaN(boardId)) {
                res.status(400).json({ error: 'Invalid board ID' });
                return;
            }
            const todoData: MutateTodoDto = req.body;
            const todo = await this.todoService.createTodo(boardId, todoData);
            res.status(201).json(todo);
        } catch (error) {
            console.error('Error creating todo:', error);
            res.status(500).json({ error: 'Failed to create todo' });
        }
    };

    updateTodo = async (req: Request, res: Response): Promise<void> => {
        try {
            const todoId = parseInt(req.params.id);
            const boardId = parseInt(req.params.boardId);
            if (isNaN(todoId) || isNaN(boardId)) {
                res.status(400).json({ error: 'Invalid todo or board ID' });
                return;
            }
            const todoData: MutateTodoDto = req.body;
            const updatedTodo = await this.todoService.updateTodo(boardId, todoId, todoData);
            if (!updatedTodo) {
                res.status(404).json({ error: 'Todo not found' });
                return;
            }
            res.json(updatedTodo);
        } catch (error) {
            console.error('Error updating todo:', error);
            res.status(500).json({ error: 'Failed to update todo' });
        }
    };

    toggleTodo = async (req: Request, res: Response): Promise<void> => {
        try {
            const todoId = parseInt(req.params.id);
            const boardId = parseInt(req.params.boardId);
            if (isNaN(todoId) || isNaN(boardId)) {
                res.status(400).json({ error: 'Invalid todo or board ID' });
                return;
            }
            const toggledTodo = await this.todoService.toggleTodo(boardId, todoId);
            if (!toggledTodo) {
                res.status(404).json({ error: 'Todo not found' });
                return;
            }
            res.json(toggledTodo);
        } catch (error) {
            console.error('Error toggling todo:', error);
            res.status(500).json({ error: 'Failed to toggle todo' });
        }
    };

    deleteTodo = async (req: Request, res: Response): Promise<void> => {
        try {
            const todoId = parseInt(req.params.id);
            const boardId = parseInt(req.params.boardId);
            if (isNaN(todoId) || isNaN(boardId)) {
                res.status(400).json({ error: 'Invalid todo or board ID' });
                return;
            }
            const deleted = await this.todoService.deleteTodo(boardId, todoId);
            if (!deleted) {
                res.status(404).json({ error: 'Todo not found' });
                return;
            }
            // res.status(204).send();
            res.json({ message: 'Todo deleted successfully' });
        } catch (error) {
            console.error('Error deleting todo:', error);
            res.status(500).json({ error: 'Failed to delete todo' });
        }
    };

    clearCompletedTodos = async (req: Request, res: Response): Promise<void> => {
        try {
             console.log("llamando al service de clearCompleted, boardId:");
            const boardId = parseInt(req.params.boardId);
            if (isNaN(boardId)) {
                res.status(400).json({ error: 'Invalid board ID' });
                return;
            }
           
            const totalDeleted = await this.todoService.clearCompletedTodos(boardId);
            res.json(totalDeleted);
        } catch (error) {
            console.error('Error clearing completed todos:', error);
            res.status(500).json({ error: 'Failed to clear completed todos' });
        }
    }

    async todoExists(req: Request, res: Response, next: Function): Promise<void> {
        try {
            const todoId = parseInt(req.params.id);
            const boardId = parseInt(req.params.boardId);
            if (isNaN(todoId) || isNaN(boardId)) {
                res.status(400).json({ error: 'Invalid todo or board ID' });
                return;
            }
            const exists = await this.todoService.todoExists(boardId, todoId);
            if (!exists) {
                res.status(404).json({ error: 'Todo not found' });
                return;
            }
            next();
        } catch (error) {
            console.error('Error checking todo existence:', error);
            res.status(500).json({ error: 'Failed to check todo existence' });
        }
    }

}