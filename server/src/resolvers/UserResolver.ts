import { Resolver, Query, Arg } from "type-graphql";
import { User } from "../entities/User";

@Resolver()
export class UserResolver {
  @Query(() => [User])
  Users() {
    return User.find();
  }

  @Query(() => [User])
  UsersPage(@Arg("limit") limit: number, @Arg("offset") offset: number) {
    return User.find({take: limit, skip: offset})
  }

  @Query(() => User)
  User(@Arg("id") id: string) {
    return User.findOne({ where: { id } });
  }
}

