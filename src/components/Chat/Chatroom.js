import React, { Component, Fragment } from "react";
import { Query, Mutation } from "react-apollo";
import {
  GET_MESSAGES,
  SEND_MESSAGE,
  NEW_MESSAGE_SUB,
  NEW_INBOX_SUB,
  REMOVE_SELF
} from "../../queries";
import { Form, Input, Button } from "antd";
import Waypoint from "react-waypoint";
import MessageList from "./MessageList.js";
import Spinner from "../common/Spinner";
import MembersDropdown from "../common/MembersDropdown";

const LIMIT = 6;

class Chatroom extends Component {
  state = {
    loading: false,
    cursor: null,
    hasMoreItems: true
  };

  handleEnd = (previousPosition, currentPosition, fetchMore, cursor) => {
    if (
      this.messagesRef &&
      this.messagesRef.current.scrollTop < 100 &&
      this.state.hasMoreItems &&
      this.state.loading !== true
    ) {
      if (
        (!previousPosition && currentPosition === Waypoint.inside) ||
        previousPosition === Waypoint.above
      ) {
        const { chatID } = this.props;
        this.setState({ loading: true });
        fetchMore({
          variables: {
            chatID,
            limit: LIMIT,
            cursor
          },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            if (!fetchMoreResult) {
              return previousResult;
            }

            if (fetchMoreResult.getMessages.messages < LIMIT) {
              this.setState({ hasMoreItems: false });
            }
            console.log("NEW", ...fetchMoreResult.getMessages.messages);
            console.log("OLD", ...previousResult.getMessages.messages);
            previousResult.getMessages.messages = [
              ...previousResult.getMessages.messages,
              ...fetchMoreResult.getMessages.messages
            ];

            return previousResult;
          }
        });
        this.setState({
          loading: false
        });
      }
    }
  };

  fetchData = async (fetchMore, cursor) => {
    // not beign used
    const { chatID } = this.props;
    this.setState({ loading: true });
    fetchMore({
      variables: {
        chatID,
        limit: LIMIT,
        cursor
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        if (!fetchMoreResult) {
          return previousResult;
        }

        if (fetchMoreResult.getMessages.messages < LIMIT) {
          this.setState({ hasMoreItems: false });
        }

        previousResult.getMessages.messages = [
          ...previousResult.getMessages.messages,
          ...fetchMoreResult.getMessages.messages
        ];

        return previousResult;
      }
    });
    this.setState({
      loading: false
    });
  };
  render() {
    const { style, chatID, title, lastSeen, titleExtra } = this.props;
    const { cursor } = this.state;

    return (
      <div className="chatroom" style={{ position: "relative", ...style }}>
        <div className="chatroom-header">
          <div className="chatroom-headers">
            <h3 className="chatroom-title">
              {title}
              <span className="chatroom-titleExtra">{titleExtra}</span>
            </h3>
            <h4 className="chatroom-date">{lastSeen}</h4>
            <MembersDropdown
              targetID={chatID}
              targetType={"chat"}
              listType={"friends"}
            />
          </div>
          <div className="chatroom-leave">
            <Mutation
              mutation={REMOVE_SELF}
              variables={{
                chatID: chatID
              }}
            >
              {(leaveChat, { data, error, loading }) => {
                console.log("leaving");
                return <h5 onClick={() => leaveChat()}>leave</h5>;
              }}
            </Mutation>
          </div>
        </div>
        <Query
          query={GET_MESSAGES}
          variables={{ chatID, limit: LIMIT, cursor }}
          fetchPolicy="cache-first"
        >
          {({ data, loading, error, subscribeToMore, fetchMore }) => {
            if (loading) {
              return <Spinner message="Loading..." size="large" />;
            }
            if (!data.getMessages) {
              console.log(data);
              return <div>No messages</div>;
            }

            return (
              <Fragment>
                {/*<Affix style={{position: 'absolute', top:'0'}}>{'test'}</Affix>*/}
                <MessageList
                  chatID={chatID}
                  ref={this.MessageList}
                  messages={
                    data && data.getMessages ? data.getMessages.messages : []
                  }
                  subscribe={() =>
                    subscribeToMore({
                      document: NEW_MESSAGE_SUB,
                      variables: {
                        chatID: chatID
                      },
                      updateQuery: (prev, { subscriptionData }) => {
                        const { newMessageSubscribe } = subscriptionData.data;
                        console.log("SUBSCRIBE EXECUTED", subscriptionData);
                        if (!newMessageSubscribe) {
                          return prev;
                        }
                        if (prev.getMessages) {
                          prev.getMessages.messages = [
                            newMessageSubscribe,
                            ...prev.getMessages.messages
                          ];
                        } else {
                          prev.getMessages = {
                            messages: [newMessageSubscribe],
                            __typename: "ChatType"
                          };
                        }
                        console.log(prev.getMessages);

                        return prev;
                      }
                    })
                  }
                  handleEnd={this.handleEnd}
                  fetchMore={fetchMore}
                  limit={LIMIT}
                />
              </Fragment>
            );
          }}
        </Query>

        <InputForm chatID={chatID} />
      </div>
    );
  }
}

class InputFormTemplate extends Component {
  submitMessage(e, sendMessage) {
    e.preventDefault();

    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }

      console.log("Received values of form: ", fieldsValue);

      sendMessage()
        .then(({ data }) => {
          console.log(data, "Was message sent", !!data.sendMessage);
        })
        .catch(res => {
          const errors = res.graphQLErrors.map(error => {
            return error.message;
          });

          //TODO: send errors to analytics from here
          this.setState({ errors });
        });
    });
  }

  render() {
    const { chatID } = this.props;
    const { getFieldDecorator } = this.props.form;
    return (
      <Mutation
        mutation={SEND_MESSAGE}
        variables={{
          chatID,
          text: this.props.form.getFieldValue("text")
        }}
      >
        {(sendMessage, { data, loading, error }) => (
          <Form className="input">
            <Form.Item style={{ marginBottom: "0px", flexGrow: 1 }}>
              {getFieldDecorator("text")(
                <Input type="text" style={{ width: "100%" }} />
              )}
            </Form.Item>
            <Button
              type="submit"
              style={{ marginLeft: "16px" }}
              onClick={e => this.submitMessage(e, sendMessage)}
            >
              Send
            </Button>
          </Form>
        )}
      </Mutation>
    );
  }
}
const InputForm = Form.create()(InputFormTemplate);

export default Chatroom;
