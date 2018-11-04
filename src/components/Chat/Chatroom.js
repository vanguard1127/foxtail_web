import React, { Component } from "react";
import { Query, Mutation } from "react-apollo";
import { GET_MESSAGES, SEND_MESSAGE, NEW_MESSAGE_SUB } from "../../queries";
import { List, Form, Input, Button } from "antd";

import Message from "./Message.js";

class Chatroom extends Component {
  state = { loading: true };
  componentDidMount() {
    this.scrollToBot();
  }

  componentDidUpdate() {
    this.scrollToBot();
  }

  scrollToBot() {
    //this.messagesEnd.scrollIntoView({ behavior: "smooth" });
    //   if (this.refs.chats) {
    //   ReactDOM.findDOMNode(this.refs.chats).scrollTop = ReactDOM.findDOMNode(
    //     this.refs.chats
    //   ).scrollHeight;
    // }
  }

  render() {
    const { style, chatID } = this.props;
    let unsubscribe = null;
    return (
      <div className="chatroom" style={style}>
        <h3>Foxtail</h3>
        <Query
          query={GET_MESSAGES}
          variables={{ chatID }}
          fetchPolicy="cache-and-network"
        >
          {({ data, loading, error, subscribeToMore }) => {
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
              <List className="chats" ref="chats">
                {console.log("RECIEVE:", data)}
                {data.getMessages.messages.map(message => (
                  <Message key={message.id} message={message} />
                ))}
                <List.Item />
              </List>
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
        fetchPolicy="cache-and-network"
        refetchQueries={() => [
          {
            query: GET_MESSAGES,
            variables: { chatID }
          }
        ]}
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
