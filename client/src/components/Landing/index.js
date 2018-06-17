import React, { Component, Fragment } from 'react';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';

import withSession from '../Session/withSession';
import ErrorMessage from '../Error';

const MESSAGE_CREATED = gql`
  subscription {
    messageCreated {
      message {
        id
        text
        createdAt
        user {
          id
          username
        }
      }
    }
  }
`;

const CREATE_MESSAGE = gql`
  mutation($text: String!) {
    createMessage(text: $text) {
      id
      text
      createdAt
      user {
        id
        username
      }
    }
  }
`;

const DELETE_MESSAGE = gql`
  mutation($id: String!) {
    deleteMessage(id: $id)
  }
`;

const GET_PAGINATED_MESSAGES_WITH_USERS = gql`
  query($cursor: String, $limit: Int!) {
    messages(cursor: $cursor, limit: $limit)
      @connection(key: "MessagesConnection") {
      list {
        id
        text
        createdAt
        user {
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

const GET_ALL_MESSAGES_WITH_USERS = gql`
  query {
    messages(order: "DESC") @connection(key: "MessagesConnection") {
      list {
        id
        text
        createdAt
        user {
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
    {session && session.currentUser && <MessageCreate />}
    <Messages currentUser={session.currentUser} limit={2} />
  </Fragment>
);

class MessageCreate extends Component {
  state = {
    text: '',
  };

  onChange = event => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  onSubmit = async (event, createMessage) => {
    event.preventDefault();

    try {
      await createMessage();
      this.setState({ text: '' });
    } catch (error) {}
  };

  render() {
    const { text } = this.state;

    return (
      <Mutation
        mutation={CREATE_MESSAGE}
        variables={{ text }}
        // update={(cache, { data: { createMessage } }) => {
        //   const data = cache.readQuery({
        //     query: GET_ALL_MESSAGES_WITH_USERS,
        //   });

        //   cache.writeQuery({
        //     query: GET_ALL_MESSAGES_WITH_USERS,
        //     data: {
        //       ...data,
        //       messages: {
        //         ...data.messages,
        //         list: [createMessage, ...data.messages.list],
        //         pageInfo: data.messages.pageInfo,
        //       },
        //     },
        //   });
        // }}
      >
        {(createMessage, { data, loading, error }) => (
          <form
            onSubmit={event => this.onSubmit(event, createMessage)}
          >
            <textarea
              name="text"
              value={text}
              onChange={this.onChange}
              type="text"
              placeholder="Your message ..."
            />
            <button type="submit">Send</button>

            {error && <ErrorMessage error={error} />}
          </form>
        )}
      </Mutation>
    );
  }
}

const Messages = ({ limit, currentUser }) => (
  <Query
    query={GET_PAGINATED_MESSAGES_WITH_USERS}
    variables={{ limit }}
  >
    {({ data, loading, error, fetchMore, subscribeToMore }) => {
      const { messages } = data;

      if (loading || !messages) {
        return <div>Loading ...</div>;
      }

      const { list, pageInfo } = messages;

      return (
        <Fragment>
          <MessageList
            messages={list}
            currentUser={currentUser}
            subscribeToMore={subscribeToMore}
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
                      messages: {
                        ...fetchMoreResult.messages,
                        list: [
                          ...previousResult.messages.list,
                          ...fetchMoreResult.messages.list,
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

class MessageList extends Component {
  componentDidMount() {
    this.props.subscribeToMore({
      document: MESSAGE_CREATED,
      updateQuery: (previousResult, { subscriptionData }) => {
        if (!subscriptionData.data) {
          return previousResult;
        }

        const { messageCreated } = subscriptionData.data;

        return {
          ...previousResult,
          messages: {
            ...previousResult.messages,
            list: [
              messageCreated.message,
              ...previousResult.messages.list,
            ],
          },
        };
      },
    });
  }

  render() {
    const { messages, currentUser } = this.props;

    return (
      <Fragment>
        {messages.map(message => (
          <div key={message.id}>
            <h3>{message.user.username}</h3>
            <small>{message.createdAt}</small>
            <p>{message.text}</p>

            {currentUser &&
              message.user.id === currentUser.id && (
                <Mutation
                  mutation={DELETE_MESSAGE}
                  variables={{ id: message.id }}
                  update={cache => {
                    const data = cache.readQuery({
                      query: GET_ALL_MESSAGES_WITH_USERS,
                    });

                    cache.writeQuery({
                      query: GET_ALL_MESSAGES_WITH_USERS,
                      data: {
                        ...data,
                        messages: {
                          ...data.messages,
                          list: data.messages.list.filter(
                            node => node.id !== message.id,
                          ),
                          pageInfo: data.messages.pageInfo,
                        },
                      },
                    });
                  }}
                >
                  {(deleteMessage, { data, loading, error }) => (
                    <button type="button" onClick={deleteMessage}>
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
