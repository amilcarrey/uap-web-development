export interface CreateTaskDto {
  content: string;
  boardId: number;
  completed?: boolean;
}

export interface TaskResponseDto {
  id: number;
  content: string;
  completed: boolean;
  boardId: number;
}
