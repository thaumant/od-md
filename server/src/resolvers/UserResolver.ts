import { Resolver, Query, Arg } from "type-graphql";
import { User } from "../entities/User";
import { Like, Not, FindOperator, getConnection, getRepository } from "typeorm";

const DEFAULT_TAKE = 10;
const DEFAULT_SKIP = 0;

@Resolver()
export class UserResolver {
  @Query(() => [User])
  Users() {
    return User.find();
  }

  @Query(() => [User])
  async UserList(
    @Arg("query", {nullable: true}) query?: string,
    @Arg("isVerified", {nullable: true}) isVerified?: boolean,
    @Arg("limit", {nullable: true, defaultValue: DEFAULT_TAKE}) take?: number, 
    @Arg("offset", {nullable: true, defaultValue: DEFAULT_SKIP}) skip?: number,
  ) {
    const conditions = [];
    const variables = {isVerified, query: "%" + (query || "") + "%"};

    if (isVerified !== undefined) {
      conditions.push("isVerified = :isVerified");
    }
    if (query) {
      conditions.push("(name LIKE :query OR shortBio LIKE :query)");
    }

    return (
      getRepository(User)
        .createQueryBuilder("user")
        .where(conditions.join(" AND "), variables)
        .take(take || DEFAULT_TAKE)
        .skip(skip || DEFAULT_SKIP)
        .getMany()
    );
  }

  @Query(() => User)
  User(@Arg("id") id: string) {
    return User.findOne({where: {id}});
  }
}

