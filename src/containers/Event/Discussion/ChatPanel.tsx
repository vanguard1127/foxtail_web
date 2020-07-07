import React, { useState } from "react";
import { useMutation } from "react-apollo";
import ReactGA from 'react-ga';
import { WithT } from "i18next";

import * as ErrorHandler from "components/common/ErrorHandler";

import { POST_COMMENT } from "queries";

interface IChatPanelProps extends WithT {
  chatID: string;
}

const ChatPanel: React.FC<IChatPanelProps> = ({
  chatID,
  t,
}) => {
  const [text, setText] = useState("");

  const [postComment] = useMutation(POST_COMMENT, {
    variables: {
      chatID,
      text
    }
  });

  const submitMessage = (e) => {
    ErrorHandler.setBreadcrumb("Send comment (event)");
    e.preventDefault();

    postComment()
      .then(() => {
        ReactGA.event({
          category: "Event",
          action: "Post Comment"
        });
        setText("");
      })
      .catch((res) => {
        ErrorHandler.catchErrors(res);
      });
  };

  const setTextString = (e) => {
    setText(e.target.value);
  };

  return (
    <div className="send-message">
      <textarea
        value={text}
        onChange={setTextString}
        placeholder={t("nowyoucan") + "..."}
      />
      <button onClick={submitMessage} disabled={text.trim() === ""}>
        {t("common:postcomm")}
      </button>
    </div>
  );
};

export default ChatPanel;
