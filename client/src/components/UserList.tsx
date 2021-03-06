import React, { useState, useEffect, useRef } from 'react';
import { useQuery, gql } from '@apollo/client';
import { User } from '../types';
import { UserCard } from './UserCard';

import './UserList.css';

interface QueryData {
  UserList: User[];
}

interface QueryVars {
  limit: number;
  offset: number;
  isVerified?: boolean;
  query?: string;
}

const PAGE_SIZE = 10;

const INITIAL_VARIABLES = {
  limit: PAGE_SIZE,
  offset: 0,
  query: undefined,
  isVerified: undefined,
};

const GET_USERS = gql`
  query GetUsers($limit: Float!, $offset: Float!, $isVerified: Boolean, $query: String) {
    UserList(limit: $limit, offset: $offset, isVerified: $isVerified, query: $query) {
      id
      name
      shortBio
      isVerified
      photoUrl
    }
  }
`;

export function UserList() {
  const [offset, setOffset] = useState<number>(PAGE_SIZE);
  const [isVerified, setVerified] = useState<boolean | undefined>(undefined);
  const [query, setQuery] = useState<string | undefined>(undefined);
  const bottomRef = useRef<HTMLDivElement>(null);
  const observerRef: React.MutableRefObject<IntersectionObserver | null> = useRef(null);
  const { data, fetchMore, refetch } = useQuery<QueryData, QueryVars>(GET_USERS, {variables: {...INITIAL_VARIABLES, isVerified, query}});
  const users = data?.UserList || [];

  useEffect(() => {
    const bottomElem = bottomRef.current;
    if (bottomElem && !observerRef.current) {
      const observer = new IntersectionObserver(() => {
        setOffset(offset => offset + PAGE_SIZE);
      }, {threshold: 0});
      observer.observe(bottomElem);
      observerRef.current = observer;
      return () => {
        observer.unobserve(bottomElem);
        observerRef.current = null;
      };
    }
  }, []);

  useEffect(() => {
    if (!offset) return;
    fetchMore({variables: {limit: PAGE_SIZE, offset, isVerified, query}});
  }, [offset, isVerified, query]);

  function handleVerifiedSwitch(val: boolean): void {
    const newVerified = isVerified === val ? undefined : val;
    setOffset(0);
    setVerified(newVerified);
    refetch({...INITIAL_VARIABLES, isVerified: newVerified, query});
  }

  function handleQueryChange(val: string) {
    const newQuery = val || undefined;
    setOffset(0);
    setQuery(newQuery);
    refetch({...INITIAL_VARIABLES, isVerified, query: newQuery});
  }

  return (
    <>
      <h1>Users</h1>
      <div className='UserFilters'>
        <input
          type='text'
          className='UserFilters-query'
          placeholder='Search...'
          onChange={event => handleQueryChange(event.target.value)}></input>
        <button
          className={'UserFilters-verified ' + (isVerified === true ? 'active' : '')}
          onClick={() => handleVerifiedSwitch(true)}>verified</button>
        <button
          className={'UserFilters-nonverified ' + (isVerified === false ? 'active' : '')}
          onClick={() => handleVerifiedSwitch(false)}>non-verified</button>
      </div>
      <div className='UserList'>
        {users?.map(user =>(
          <UserCard key={user.id} {...user} />
        ))}
      </div>
      <div className='UserList-bottom' ref={bottomRef} />
    </>
  );
}

