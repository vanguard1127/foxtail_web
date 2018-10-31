import React, { Component } from "react";
import ReactDOM from "react-dom";
import { List, Form, Input, Button } from "antd";

import Message from "./Message.js";

class Chatroom extends Component {
  componentDidMount() {
    if (!this.props.loading) {
      this.scrollToBot();
    }
  }

  componentDidUpdate() {
    if (!this.props.loading) {
      this.scrollToBot();
    }
  }

  scrollToBot() {
    ReactDOM.findDOMNode(this.refs.chats).scrollTop = ReactDOM.findDOMNode(
      this.refs.chats
    ).scrollHeight;
  }

  submitMessage(e) {
    e.preventDefault();

    this.setState(
      {
        chats: this.state.chats.concat([
          {
            username: "Kevin Hsu",
            content: <p>{ReactDOM.findDOMNode(this.refs.msg).value}</p>,
            img: "http://i.imgur.com/Tj5DGiO.jpg"
          }
        ])
      },
      () => {
        ReactDOM.findDOMNode(this.refs.msg).value = "";
      }
    );
  }

  render() {
    const { style, messages, loading } = this.props;
    const screen = !loading ? (
      <List className="chats" ref="chats">
        {messages.map(message => (
          <Message key={message.id} message={message} />
        ))}
      </List>
    ) : (
      <div style={{ height: "100%" }}>Loading</div>
    );
    return (
      <div className="chatroom" style={style}>
        <h3>Foxtail</h3>
        {screen}
        <InputForm />
      </div>
    );
  }
}

class InputFormTemplate extends Component {
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form className="input" onSubmit={e => this.submitMessage(e)}>
        <Form.Item style={{ marginBottom: "0px" }}>
          {getFieldDecorator("text")(<Input type="text" />)}
        </Form.Item>
        <Form.Item style={{ marginBottom: "0px" }}>
          <Button type="submit">Send</Button>
        </Form.Item>
      </Form>
    );
  }
}
const InputForm = Form.create()(InputFormTemplate);

export default Chatroom;
