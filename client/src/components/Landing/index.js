import React, { Component, Fragment } from 'react';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';

import withSession from '../Session/withSession';
import ErrorMessage from '../Error';

const TWEET_CREATED = gql`
  subscription {
    tweetCreated {
      tweet {
        id
        text
        createdAt
        author {
          id
          username
        }
      }
    }
  }
`;

const CREATE_TWEET = gql`
  mutation($text: String!) {
    createTweet(text: $text) {
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

const DELETE_TWEET = gql`
  mutation($id: String!) {
    deleteTweet(id: $id)
  }
`;

const GET_PAGINATED_TWEETS_WITH_AUTHORS = gql`
  query($cursor: String, $limit: Int!) {
    tweets(cursor: $cursor, limit: $limit)
      @connection(key: "TweetsConnection") {
      list {
        id
        text
        createdAt
        author {
          id
          username
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

const GET_ALL_TWEETS_WITH_AUTHORS = gql`
  query {
    tweets(order: "DESC") @connection(key: "TweetsConnection") {
      list {
        id
        text
        createdAt
        author {
          id
          username
        }
      }
      pageInfo {
        hasNextPage
      }
    }
  }
`;

const Landing = ({ session }) => (
  <Fragment>
    <h2>Feed</h2>
    {session && session.currentAuthor && <TweetCreate />}
    <Tweets currentAuthor={session.currentAuthor} limit={2} />
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
      <Mutation
        mutation={CREATE_TWEET}
        variables={{ text }}
        // update={(cache, { data: { createTweet } }) => {
        //   const data = cache.readQuery({
        //     query: GET_ALL_TWEETS_WITH_AUTHORS,
        //   });

        //   cache.writeQuery({
        //     query: GET_ALL_TWEETS_WITH_AUTHORS,
        //     data: {
        //       ...data,
        //       tweets: {
        //         ...data.tweets,
        //         list: [createTweet, ...data.tweets.list],
        //         pageInfo: data.tweets.pageInfo,
        //       },
        //     },
        //   });
        // }}
      >
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

            {error && <ErrorMessage error={error} />}
          </form>
        )}
      </Mutation>
    );
  }
}

const Tweets = ({ limit, currentAuthor }) => (
  <Query
    query={GET_PAGINATED_TWEETS_WITH_AUTHORS}
    variables={{ limit }}
  >
    {({ data, loading, error, fetchMore, subscribeToMore }) => {
      const { tweets } = data;

      if (loading || !tweets) {
        return <div>Loading ...</div>;
      }

      const { list, pageInfo } = tweets;

      return (
        <Fragment>
          <TweetList
            tweets={list}
            currentAuthor={currentAuthor}
            subscribeToCreatedTweets={() =>
              subscribeToMore({
                document: TWEET_CREATED,
                updateQuery: (
                  previousResult,
                  { subscriptionData },
                ) => {
                  if (!subscriptionData.data) {
                    return previousResult;
                  }

                  const { tweetCreated } = subscriptionData.data;

                  return {
                    ...previousResult,
                    tweets: {
                      ...previousResult.tweets,
                      list: [
                        tweetCreated.tweet,
                        ...previousResult.tweets.list,
                      ],
                    },
                  };
                },
              })
            }
          />

          {pageInfo.hasNextPage && (
            <button
              type="button"
              onClick={() =>
                fetchMore({
                  variables: {
                    cursor: pageInfo.endCursor,
                    limit,
                  },
                  updateQuery: (
                    previousResult,
                    { fetchMoreResult },
                  ) => {
                    if (!fetchMoreResult) {
                      return previousResult;
                    }

                    return {
                      tweets: {
                        ...fetchMoreResult.tweets,
                        list: [
                          ...previousResult.tweets.list,
                          ...fetchMoreResult.tweets.list,
                        ],
                      },
                    };
                  },
                })
              }
            >
              More
            </button>
          )}
        </Fragment>
      );
    }}
  </Query>
);

class TweetList extends Component {
  componentDidMount() {
    this.props.subscribeToCreatedTweets();
  }

  render() {
    const { tweets, currentAuthor } = this.props;

    return (
      <Fragment>
        {tweets.map(tweet => (
          <div key={tweet.id}>
            <h3>{tweet.author.username}</h3>
            <small>{tweet.createdAt}</small>
            <p>{tweet.text}</p>

            {currentAuthor &&
              tweet.author.id === currentAuthor.id && (
                <Mutation
                  mutation={DELETE_TWEET}
                  variables={{ id: tweet.id }}
                  update={cache => {
                    const data = cache.readQuery({
                      query: GET_ALL_TWEETS_WITH_AUTHORS,
                    });

                    cache.writeQuery({
                      query: GET_ALL_TWEETS_WITH_AUTHORS,
                      data: {
                        ...data,
                        tweets: {
                          ...data.tweets,
                          list: data.tweets.list.filter(
                            node => node.id !== tweet.id,
                          ),
                          pageInfo: data.tweets.pageInfo,
                        },
                      },
                    });
                  }}
                >
                  {(deleteTweet, { data, loading, error }) => (
                    <button type="button" onClick={deleteTweet}>
                      Delete
                    </button>
                  )}
                </Mutation>
              )}
          </div>
        ))}
      </Fragment>
    );
  }
}

export default withSession(Landing);
