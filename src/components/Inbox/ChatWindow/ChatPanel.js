import React, { useState, useRef, useEffect } from "react";
import { useMutation } from "@apollo/react-hooks";
import { SEND_MESSAGE, SET_TYPING } from "../../../queries";

var timer;
const ChatPanel = ({ chatID, t, ErrorHandler }) => {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [sendMessage] = useMutation(SEND_MESSAGE);
  const [setTypingMutation] = useMutation(SET_TYPING);
  const refContainer = useRef(null);
  useEffect(() => {
    return () => {
      setTypingMutation({ variables: { chatID, isTyping: false } }).catch(
        res => {
          ErrorHandler.catchErrors(res);
        }
      );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const submitMessage = e => {
    e && e.preventDefault();
    if (!sending) {
      setSending(true);
      ErrorHandler.setBreadcrumb("Send message (chat)");
      setIsTyping(false);
      setTypingMutation({ variables: { chatID, isTyping: false } }).catch(
        res => {
          ErrorHandler.catchErrors(res);
        }
      );
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
        setTypingMutation({ variables: { chatID, isTyping: true } }).catch(
          res => {
            ErrorHandler.catchErrors(res);
          }
        );
        timer = setTimeout(() => {
          setIsTyping(false);
          setTypingMutation({ variables: { chatID, isTyping: false } }).catch(
            res => {
              ErrorHandler.catchErrors(res);
            }
          );
        }, 6000);
      }
    } else {
      clearTimeout(timer);
      timer = setTimeout(() => {
        setIsTyping(false);
        setTypingMutation({ variables: { chatID, isTyping: false } }).catch(
          res => {
            ErrorHandler.catchErrors(res);
          }
        );
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
