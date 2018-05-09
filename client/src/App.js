import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import './App.css';

const GET_AUTHORS_WITH_TWEETS = gql`
  {
    authors {
      id
      username
      tweets {
        id
        text
      }
    }
  }
`;

const App = () => (
  <Query query={GET_AUTHORS_WITH_TWEETS}>
    {({ data, loading, error }) => {
      const { authors } = data;

      if (loading || !authors) {
        return <div>Loading ...</div>;
      }

      return (
        <div>
          {authors.map(author => (
            <div key={author.id}>
              <h2>{author.username}</h2>
              <div>
                {author.tweets.map(tweet => (
                  <div key={tweet.id}>{tweet.text}</div>
                ))}
              </div>
            </div>
          ))}
        </div>
      );
    }}
  </Query>
);

export default App;
