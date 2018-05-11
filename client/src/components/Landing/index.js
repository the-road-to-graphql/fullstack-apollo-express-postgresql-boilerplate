import React, { Component, Fragment } from 'react';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';

import withSession from '../Session/withSession';

const CREATE_TWEET = gql`
  mutation($text: String!) {
    createTweet(text: $text) {
      id
      authorId
      author {
        id
        username
      }
      text
    }
  }
`;

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

const Landing = ({ session }) => (
  <Fragment>
    {session && session.currentAuthor && <TweetCreate />}
    <Tweets />
  </Fragment>
);

class TweetCreate extends Component {
  onSubmit = (event, createTweet) => {
    createTweet();

    event.preventDefault();
  };

  render() {
    return (
      <Mutation mutation={CREATE_TWEET} variables={{ text: 'foo' }}>
        {(createTweet, { data, loading, error }) => (
          <form onSubmit={event => this.onSubmit(event, createTweet)}>
            <input type="text" />
            <button type="submit">Send</button>
          </form>
        )}
      </Mutation>
    );
  }
}

const Tweets = () => (
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

export default withSession(Landing);
