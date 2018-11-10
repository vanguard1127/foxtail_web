import React, { Component } from "react";
import { Query, Mutation } from "react-apollo";
import { GET_MESSAGES, SEND_MESSAGE, NEW_MESSAGE_SUB } from "../../queries";
import { Form, Input, Button } from "antd";
import Waypoint from "react-waypoint";
import MessageList from "./MessageList.js";

const LIMIT = 15;

class Chatroom extends Component {
  state = { loading: true, cursor: null };

  handleEnd = (previousPosition, fetchMore, cursor) => {
    if (previousPosition === Waypoint.above) {
      this.setState(state => ({ cursor }), () => this.fetchData(fetchMore));
    }
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
          fetchPolicy="cache-first"
        >
          {({ data, loading, error, subscribeToMore, fetchMore }) => {
            if (loading) {
              return <div style={{ height: "100%" }}>Loading</div>;
            }

            if (error) {
              return <div>Error: {error.message}</div>;
            }
            //TODO: add new message to list of current emssgaes
            if (!unsubscribe) {
              unsubscribe = subscribeToMore({
                document: NEW_MESSAGE_SUB,
                variables: { chatID },
                updateQuery: (prev, { subscriptionData }) => {
                  const { newMessageSubscribe } = subscriptionData.data;

                  if (!newMessageSubscribe) {
                    return prev;
                  }
                  prev.getMessages.messages = [
                    ...prev.getMessages.messages,
                    newMessageSubscribe
                  ];

                  return prev;
                }
              });
            }

            return (
              <MessageList
                data={data}
                handleEnd={this.handleEnd}
                fetchMore={fetchMore}
              />
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
