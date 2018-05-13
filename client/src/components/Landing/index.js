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
  query($offset: Int!, $limit: Int!) {
    tweets(order: "DESC", offset: $offset, limit: $limit) {
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
    <Tweets limit={2} />
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

  onSubmit = async (event, createTweet) => {
    event.preventDefault();

    try {
      await createTweet();
      this.setState({ text: '' });
    } catch (error) {}
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

const Tweets = ({ limit }) => (
  <Query
    query={GET_TWEETS_WITH_AUTHORS}
    variables={{ offset: 0, limit }}
  >
    {({ data, loading, error, fetchMore }) => {
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

          <button
            type="button"
            onClick={() =>
              fetchMore({
                variables: { offset: tweets.length, limit },
                updateQuery: (
                  previousResult,
                  { fetchMoreResult },
                ) => {
                  if (!fetchMoreResult) {
                    return previousResult;
                  }

                  return {
                    ...previousResult,
                    tweets: [
                      ...previousResult.tweets,
                      ...fetchMoreResult.tweets,
                    ],
                  };
                },
              })
            }
          >
            More
          </button>
        </div>
      );
    }}
  </Query>
);

export default withSession(Landing);
