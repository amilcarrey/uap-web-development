export interface CreateBoardDto {
  name: string;
  ownerId: number;
}

export interface BoardResponseDto {
  id: number;
  name: string;
  active: boolean;
  ownerId: number;
}
