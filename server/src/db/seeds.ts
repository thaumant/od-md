import faker from "faker"
import { connectDatabase } from "./index";
import { User } from '../entities/User';
import { DeepPartial } from "typeorm";

const USERS_COUNT = 1000;
const BATCH_SIZE = 100;

const users: DeepPartial<User>[] = [];

let nextId: number = 0;
for (let i = 0; i < USERS_COUNT; i++) {
  users.push({
    id: nextId.toString(),
    name: faker.name.findName(),
    shortBio: faker.lorem.paragraph(),
    isVerified: faker.random.boolean(),
    photoUrl: `https://avatars.dicebear.com/api/human/${nextId}.svg`,
  });
  nextId++;
}

const seed = async () => {
  console.log("[seed] : running...");

  const db = await connectDatabase();
  await db.users.clear();

  // Can't insert all users at once: too many SQL parameters.
  for (let offset = 0; offset < users.length; offset += BATCH_SIZE) {
    const batch = users.slice(offset, offset + BATCH_SIZE);
    await db.users.save(batch);
  }

  console.log("[seed] : success");
};

seed().catch(err => {
  console.error(err.stack);
  console.error("[seed] : fail")
});
