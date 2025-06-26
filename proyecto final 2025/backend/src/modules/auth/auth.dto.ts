/*
  DTOs (Data Transfer Objects) para la autenticación
   de usuarios
   archivo usado para definir los tipos de datos
   que la api espera recibir
*/

export interface CreateUserRequest {
  email: string;
  password: string;
}