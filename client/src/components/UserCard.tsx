import React from 'react';
import { User } from '../types';
import "./UserCard.css";

export function UserCard({id, name, shortBio, photoUrl}: User) {
  return (
    <div className="UserCard">
      <div className="UserCard-avatar">
        <img src={photoUrl} />
      </div>
      <div className="UserCard-text">
        <div className="UserCard-name">{name}</div>
        <div className="UserCard-bio">{shortBio}</div>
      </div>
    </div>
  );
}
