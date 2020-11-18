import { Resolver, Query, Arg } from "type-graphql";
import { User } from "../entities/User";
import { Like, Not, FindOperator, getConnection, getRepository } from "typeorm";

@Resolver()
export class UserResolver {
  @Query(() => [User])
  Users() {
    return User.find();
  }

  @Query(() => [User])
  async UsersPage(
    @Arg("limit") take: number, 
    @Arg("offset") skip: number,
    @Arg("query", {nullable: true}) query?: string,
    @Arg("isVerified", {nullable: true}) isVerified?: boolean,
  ) {
    let where = [];
    let vars = {isVerified, query: "%" + (query || "") + "%"};

    if (isVerified !== undefined) {
      where.push("isVerified = :isVerified");
    }
    if (query) {
      where.push("(name LIKE :query OR shortBio LIKE :query)");
    }

    return (
      getRepository(User)
        .createQueryBuilder("user")
        .where(where.join(" AND "), vars)
        .take(take)
        .skip(skip)
        .getMany()
    );
  }

  @Query(() => User)
  User(@Arg("id") id: string) {
    return User.findOne({where: {id}});
  }
}

