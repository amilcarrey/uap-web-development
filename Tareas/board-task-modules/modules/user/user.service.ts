import { UserRepository } from "./user.repository";
import { CreateUserDto, UserDto } from "./user.dto";

export class UserService {
  private repo = new UserRepository();

  async getUserByUsername(username: string): Promise<UserDto | null> {
    const user = await this.repo.findByUsername(username);
    if (!user) return null;
    return {
      id: user.id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName
    };
  }

  async createUser(dto: CreateUserDto): Promise<UserDto> {
    const user = await this.repo.create(dto);
    return {
      id: user.id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName
    };
  }
}
