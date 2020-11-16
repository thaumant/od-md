import { connectDatabase } from "./index";
import { User } from '../entities/User';
import { DeepPartial } from "typeorm";

const users: DeepPartial<User>[] = [
  { id: "1", name: "Testov Testovic", shortBio: "I was born.", isVerified: false },
  { id: "2", name: "Abe Betov", shortBio: "I also born.", isVerified: false },
  { id: "3", name: "Cesar Julio", shortBio: "I later born.", isVerified: true },
];

const seed = async () => {
  try {
    console.log("[seed] : running...");

    const db = await connectDatabase();
    await db.users.clear();
    await db.users.save(users);

    console.log("[seed] : success");
  } catch {
    throw new Error("failed to seed database");
  }
};

seed();
