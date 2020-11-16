import React from 'react';
import { useQuery, gql } from '@apollo/client';
import { User } from '../types';
import { UserCard } from './UserCard';

interface UserData {
  Users: User[];
}

interface UserVars {
  name: string;
}

const GET_USERS = gql`
  query GetUsers {
    Users {
      id
      name
      shortBio
      isVerified
      photoUrl
    }
  }
`;

export function UserList() {
  const { loading, data } = useQuery<UserData, UserVars>(GET_USERS, {});
  return (
    <>
      <h1>Users</h1>
      {loading ? (
        <p>Loading ...</p>
      ) : (
          <div>{data && data.Users.map(user =>(
            <UserCard key={user.id} {...user} />
          ))}</div>
        )}
    </>
  );
}
