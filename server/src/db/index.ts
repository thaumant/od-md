import { createConnection, Repository } from "typeorm";
import { User } from "../entities/User";

export const connectDatabase = async (): Promise<{users: Repository<User>}> => {
  const connection = await createConnection();

  return {
    users: connection.getRepository(User),
  };
};
