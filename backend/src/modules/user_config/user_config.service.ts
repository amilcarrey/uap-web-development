import { UserConfigRepository } from "./user_config.repository";
import { UserConfigDto } from "./UserConfigDto";

const userConfigRepository = new UserConfigRepository();

export const getUserConfig = (userId: string) => userConfigRepository.getByUserId(userId);

export const upsertUserConfig = (
  userId: string,
  config: UserConfigDto
) => userConfigRepository.upsert(userId, config);