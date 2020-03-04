import React, { useState, useRef } from "react";
import { useMutation } from "@apollo/react-hooks";
import axios from "axios";
import { SEND_MESSAGE } from "../../../queries";

var timer;
const ChatPanel = ({ chatID, t, ErrorHandler }) => {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [sendMessage] = useMutation(SEND_MESSAGE);
  const refContainer = useRef(null);
  const notifyTyping = isTyping => {
    //TODO: fix this
    // const token = localStorage.getItem("token");
    // axios.post(process.env.REACT_APP_HTTPS_URL + "/notify", {
    //   token,
    //   isTyping,
    //   chatID
    // });
  };
  const submitMessage = e => {
    e && e.preventDefault();
    if (!sending) {
      setSending(true);
      ErrorHandler.setBreadcrumb("Send message (chat)");
      setIsTyping(false);
      notifyTyping(false);
      sendMessage({ variables: { text, chatID } })
        .then(() => {})
        .catch(res => {
          ErrorHandler.catchErrors(res);
        });
      setText("");
      setSending(false);
    }
  };

  const onEnterPress = e => {
    if (e.key === "Enter" && !e.shiftKey && text.trim() && !sending) {
      e.preventDefault();
      submitMessage();
    }
  };

  const handleTextChange = e => {
    setText(e.target.value);
    if (!isTyping) {
      if (text !== "") {
        setIsTyping(true);
        notifyTyping(true);
        timer = setTimeout(() => {
          setIsTyping(false);
          notifyTyping(false);
        }, 6000);
      }
    } else {
      clearTimeout(timer);
      timer = setTimeout(() => {
        setIsTyping(false);
        notifyTyping(false);
      }, 6000);
    }
  };

  return (
    <form onSubmit={submitMessage} ref={refContainer}>
      <div className="panel">
        {/* <div className="files" /> */}
        <div className="textarea">
          <textarea
            placeholder={t("typemsg") + "..."}
            value={text}
            onChange={handleTextChange}
            aria-label="message search"
            onKeyDown={onEnterPress}
            rows="1"
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
