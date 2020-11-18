import React, { useState, useEffect, useRef } from 'react';
import { useQuery, gql } from '@apollo/client';
import { User } from '../types';
import { UserCard } from './UserCard';

import "./UserList.css";

interface QueryData {
  UsersPage: User[];
}

interface QueryVars {
  limit: number;
  offset: number;
}

const PAGE_SIZE = 10;

const GET_USERS = gql`
  query GetUsers($limit: Float!, $offset: Float!) {
    UsersPage(limit: $limit, offset: $offset) {
      id
      name
      shortBio
      isVerified
      photoUrl
    }
  }
`;

export function UserList() {
  const bottomRef = useRef<HTMLDivElement>(null);
  const observerRef: React.MutableRefObject<IntersectionObserver | null> = useRef(null);
  const [limit, setLimit] = useState(PAGE_SIZE);
  const { data, fetchMore } = useQuery<QueryData, QueryVars>(GET_USERS, {variables: {limit: PAGE_SIZE, offset: 0}});
  const users = data?.UsersPage || [];

  useEffect(() => {
    const bottom = bottomRef.current;
    if (bottom && !observerRef.current) {
      const observer = new IntersectionObserver(() => {
        setLimit(limit => limit + PAGE_SIZE)
      }, {threshold: 0});
      observer.observe(bottom);
      observerRef.current = observer;
      return () => {
        observer.unobserve(bottom);
        observerRef.current = null;
      };
    }
  }, []);

  useEffect(() => {
    if (limit === PAGE_SIZE) return;
    fetchMore({variables: {limit: PAGE_SIZE, offset: limit - PAGE_SIZE}});
  }, [limit])

  return (
    <>
      <h1>Users</h1>
      <div className="UserList">{users?.map(user =>(
        <UserCard key={user.id} {...user} />
      ))}</div>
      <div className="UserList-bottom" ref={bottomRef} />
    </>
  );
}

