import { IsEmail, IsString, MinLength, Matches } from "class-validator";

export class CreateUserRequest {
  @IsEmail({}, { message: "Invalid email address" })
  email!: string;

  @IsString()
  @MinLength(8, { message: "Password must be at least 8 characters" })
  @Matches(/(?=.*[A-Z])/, { message: "Password must contain an uppercase letter" })
  password!: string;
}
