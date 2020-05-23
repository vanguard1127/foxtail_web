import React, { useState, useRef, useEffect } from "react";
import { useMutation } from "@apollo/react-hooks";
import UploadBox from "components/common/UploadBox";
import axios from "axios";
import { SEND_MESSAGE, SET_TYPING, SIGNS3 } from "queries";
import { toast } from "react-toastify";
import { WithT } from "i18next";

import * as ErrorHandler from 'components/common/ErrorHandler';

interface IChatPanel extends WithT {
  chatID: string,
  toggleOverlay: () => void,
  isEmailOK: boolean,
}

const ChatPanel: React.FC<IChatPanel> = ({ chatID, t, toggleOverlay, isEmailOK }) => {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [sendMessage] = useMutation(SEND_MESSAGE);
  const [signS3] = useMutation(SIGNS3);
  const [setTypingMutation] = useMutation(SET_TYPING);
  const refContainer = useRef(null);
  const timeout1 = useRef();
  const timeout2 = useRef();

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
        .then(() => { })
        .catch(res => {
          ErrorHandler.catchErrors(res);
        })
        .finally(() => {
          setSending(false);
        })
      setText("");
    }
  };

  const onEnterPress = e => {
    if (
      e.key === "Enter" &&
      !e.shiftKey &&
      text.trim() &&
      !sending &&
      sessionStorage.getItem("isMobile") === "false"
    ) {
      e.preventDefault();
      submitMessage(e);
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
        clearTimeout(timeout1.current);
        timeout1.current = setTimeout(() => {
          setIsTyping(false);
          setTypingMutation({ variables: { chatID, isTyping: false } }).catch(
            res => {
              ErrorHandler.catchErrors(res);
            }
          );
        }, 5000);
      }
    } else {
      clearTimeout(timeout2.current);
      timeout2.current = setTimeout(() => {
        setIsTyping(false);
        setTypingMutation({ variables: { chatID, isTyping: false } }).catch(
          res => {
            ErrorHandler.catchErrors(res);
          }
        );
      }, 5000);
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
      <div className="panel" style={{ textAlign: 'center' }}>
        {t("Please confirm your email before contacting members. Thanks.")}
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
            rows={1}
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
