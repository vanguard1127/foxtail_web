import React, { Component } from "react";
import { Query, Mutation } from "react-apollo";
import { OPEN_CHAT, SEND_MESSAGE } from "../../queries";
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
    // if (this.refs.chats) {
    //   ReactDOM.findDOMNode(this.refs.chats).scrollTop = ReactDOM.findDOMNode(
    //     this.refs.chats
    //   ).scrollHeight;
    // }
  }

  render() {
    const { style, chatID } = this.props;
    return (
      <div className="chatroom" style={style}>
        <h3>Foxtail</h3>
        <Query
          query={OPEN_CHAT}
          variables={{ chatID }}
          fetchPolicy="cache-and-network"
        >
          {({ data, loading, error, fetchMore }) => {
            if (loading) {
              return <div style={{ height: "100%" }}>Loading</div>;
            }

            if (error) {
              return <div>Error: {error.message}</div>;
            }

            return (
              <List className="chats" ref="chats">
                {data.openChat.messages.map(message => (
                  <Message key={message.id} message={message} />
                ))}
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
            query: OPEN_CHAT,
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
