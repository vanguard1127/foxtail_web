import React, { useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import { SEND_MESSAGE, SET_TYPING } from "../../../queries";

var timer;
const ChatPanel = ({ chatID, t, ErrorHandler }) => {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [sendMessage] = useMutation(SEND_MESSAGE);
  const [setTyping] = useMutation(SET_TYPING);
  const submitMessage = e => {
    e.preventDefault();
    if (!sending) {
      setSending(true);
      ErrorHandler.setBreadcrumb("Send message (chat)");
      setIsTyping(false);
      setTyping({ variables: { isTyping: false, chatID } });
      sendMessage({ variables: { text, chatID } })
        .then(() => {})
        .catch(res => {
          ErrorHandler.catchErrors(res);
        });
      setText("");
      setSending(false);
    }
  };

  const handleTextChange = e => {
    setText(e.target.value);
    if (!isTyping) {
      if (text !== "") {
        setIsTyping(true);
        setTyping({ variables: { isTyping: true, chatID } });
        timer = setTimeout(() => {
          setIsTyping(false);
          setTyping({ variables: { isTyping: false, chatID } });
        }, 6000);
      }
    } else {
      clearTimeout(timer);
      timer = setTimeout(() => {
        setIsTyping(false);
        setTyping({ variables: { isTyping: false, chatID } });
      }, 6000);
    }
  };

  return (
    <form onSubmit={submitMessage}>
      <div className="panel">
        {/* <div className="files" /> */}
        <div className="textarea">
          <input
            placeholder={t("typemsg") + "..."}
            value={text}
            onChange={handleTextChange}
            aria-label="message search"
          />
        </div>
        <div className="send">
          <button type="submit" disabled={!text.trim() || sending}>
            {t("common:Send")}
          </button>
        </div>
      </div>{" "}
    </form>
  );
};

export default ChatPanel;
