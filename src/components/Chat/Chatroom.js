import React, { Component, Fragment } from "react";
import { Query, Mutation } from "react-apollo";
import { GET_MESSAGES, SEND_MESSAGE, NEW_MESSAGE_SUB } from "../../queries";
import { Form, Input, Button, Affix } from "antd";
import Waypoint from "react-waypoint";
import MessageList from "./MessageList.js";
import moment from "moment";

const LIMIT = 6;

class Chatroom extends Component {
  constructor(props) {
    super(props);
    this.messagesRef = React.createRef();
  }
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
        console.log(
          "END CALLED",
          "PREV",
          previousPosition,
          "CURR",
          currentPosition
        );
        this.fetchData(fetchMore, cursor);
      }
    }
  };

  fetchData = async (fetchMore, cursor) => {
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
  };

  render() {
    const { style, chatID, chatTitle } = this.props;
    const { cursor } = this.state;

    let unsubscribe = null;

    return (
      <div className="chatroom" style={style}>
        <h3>{chatTitle}</h3>
        <Query
          query={GET_MESSAGES}
          variables={{ chatID, limit: LIMIT, cursor }}
          fetchPolicy="network-only"
        >
          {({ data, loading, error, subscribeToMore, fetchMore }) => {
            if (loading) {
              return <div style={{ height: "100%" }}>Loading</div>;
            }

            if (error) {
              return <div>Error: {error.message}</div>;
            }

            if (!unsubscribe) {
              unsubscribe = subscribeToMore({
                document: NEW_MESSAGE_SUB,
                variables: { chatID },
                updateQuery: (prev, { subscriptionData }) => {
                  const { newMessageSubscribe } = subscriptionData.data;
                  console.log("SUBSCRIBE EXECUTED");
                  if (!newMessageSubscribe) {
                    return prev;
                  }
                  prev.getMessages.messages = [
                    newMessageSubscribe,
                    ...prev.getMessages.messages
                  ];

                  return prev;
                }
              });
            }

            return (
              <Fragment>
                {/* <Affix>{chatDate}</Affix> */}
                <MessageList
                  messages={data.getMessages.messages}
                  handleEnd={this.handleEnd}
                  fetchMore={fetchMore}
                  messagesRef={this.messagesRef}
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
          console.log(data);
        })
        .catch(e => console.log(e.message));
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
            <Form.Item style={{ marginBottom: "0px" }}>
              {getFieldDecorator("text")(<Input type="text" />)}
            </Form.Item>
            <Button
              type="submit"
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
