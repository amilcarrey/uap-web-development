export interface UserDto {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
}

export interface CreateUserDto {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
}
