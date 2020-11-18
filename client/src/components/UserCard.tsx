import React from 'react';
import { User } from '../types';
import "./UserCard.css";

export function UserCard({id, name, shortBio, photoUrl, isVerified}: User) {
  return (
    <div className="UserCard">
      <div className="UserCard-photo">
        <img src={photoUrl} />
      </div>
      <div className="UserCard-profile">
        <div className="UserCard-name">
          {name}
          {isVerified && <div className="UserCard-verified">verified</div>}
        </div>
        <div className="UserCard-bio">{shortBio}</div>
      </div>
    </div>
  );
}
