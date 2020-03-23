import React, { useState, useRef, useEffect } from "react";
import { useMutation } from "@apollo/react-hooks";
import UploadBox from "../../common/UploadBox";
import axios from "axios";
import { SEND_MESSAGE, SET_TYPING, SIGNS3 } from "../../../queries";
import { toast } from "react-toastify";

var timer;
const ChatPanel = ({ chatID, t, ErrorHandler, toggleOverlay, isEmailOK }) => {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [sendMessage] = useMutation(SEND_MESSAGE);
  const [signS3] = useMutation(SIGNS3);
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

  async function handleUpload(file) {
    const filebody = file.filebody;
    if (filebody === "") {
      return;
    }

    try {
      const { data } = await signS3({
        variables: {
          filetype: filebody.type
        }
      });

      const { signedRequest, key } = data.signS3;
      await uploadToS3(filebody, signedRequest);

      sendMessage({ variables: { text: key, chatID } })
        .then(() => toast.dismiss())
        .catch(res => {
          ErrorHandler.catchErrors(res);
        });
      return key;
    } catch (res) {
      ErrorHandler.catchErrors(res);
      toast.dismiss();
    }
  }

  const uploadToS3 = async (filebody, signedRequest) => {
    try {
      //ORIGINAL
      const options = {
        headers: {
          "Content-Type": filebody.type
        }
      };
      const resp = await axios.put(signedRequest, filebody, options);
      if (resp.status !== 200) {
        toast.error(t("uplerr"));
      }
    } catch (e) {
      console.error(e);
      ErrorHandler.catchErrors(e);
    }
  };

  if (!isEmailOK) {
    return (
      <div className="panel">
        <center>
          {t("Please confirm your email before contacting members. Thanks.")}
        </center>
      </div>
    );
  }

  return (
    <form onSubmit={submitMessage} ref={refContainer}>
      <div className="panel">
        <UploadBox
          uploadOnly
          t={t}
          ErrorHandler={ErrorHandler}
          photos={[]}
          handleUpload={handleUpload}
          toggleCB={toggleOverlay}
          uploadButton={<div className="files" />}
        />
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
