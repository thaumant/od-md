import React from 'react';
import logo from './logo.svg';
import './App.css';
import { UserList } from './components/UserList';

import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://localhost:4000',
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          UsersPage: {
            keyArgs: ["isVerified", "query"],
            merge(existing = [], incoming) {
              return [...existing, ...incoming];
            }
          }
        }
      }
    }
  })
});

function App() {
  return (
    <ApolloProvider client={client}>
      <div className="App">
        <img className="App-logo" src={logo} />
        <UserList />
      </div>
    </ApolloProvider>
  );
}

export default App;
