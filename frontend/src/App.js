import React from 'react';
import logo from './logo.svg';
import './App.css';
import { ApolloProvider } from '@apollo/react-hooks';
import client from './apollo.js';
import PlantFeed from './PlantFeed.js';

function App() {
  return (
    <ApolloProvider client={client}>
      <div className="App">
        <PlantFeed />
      </div>
    </ApolloProvider>
  );
}

export default App;
