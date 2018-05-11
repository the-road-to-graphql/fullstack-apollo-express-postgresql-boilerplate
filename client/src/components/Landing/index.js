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

const GET_TWEETS_WITH_AUTHORS = gql`
  {
    tweets {
      id
      text
      createdAt
      author {
        id
        username
      }
    }
  }
`;

const Landing = ({ session }) => (
  <Fragment>
    <h2>Feed</h2>
    {session && session.currentAuthor && <TweetCreate />}
    <Tweets />
  </Fragment>
);

class TweetCreate extends Component {
  state = {
    text: '',
  };

  onChange = event => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  onSubmit = (event, createTweet) => {
    createTweet();

    event.preventDefault();
  };

  render() {
    const { text } = this.state;

    return (
      <Mutation mutation={CREATE_TWEET} variables={{ text }}>
        {(createTweet, { data, loading, error }) => (
          <form onSubmit={event => this.onSubmit(event, createTweet)}>
            <textarea
              name="text"
              value={text}
              onChange={this.onChange}
              type="text"
              placeholder="Your tweet ..."
            />
            <button type="submit">Send</button>
          </form>
        )}
      </Mutation>
    );
  }
}

const Tweets = () => (
  <Query query={GET_TWEETS_WITH_AUTHORS}>
    {({ data, loading, error }) => {
      const { tweets } = data;

      if (loading || !tweets) {
        return <div>Loading ...</div>;
      }

      return (
        <div>
          {tweets.map(tweet => (
            <div key={tweet.id}>
              <h3>{tweet.author.username}</h3>
              <small>{tweet.createdAt}</small>
              <p>{tweet.text}</p>
            </div>
          ))}
        </div>
      );
    }}
  </Query>
);

export default withSession(Landing);
