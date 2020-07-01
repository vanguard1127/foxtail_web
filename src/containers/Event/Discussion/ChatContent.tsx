import React, { useRef } from "react";
import { useQuery } from "react-apollo";

import { GET_COMMENTS } from "queries";

import Messages from "./Messages";

interface IChatContentProps {
  chatID: string;
  t: any;
  ErrorHandler: any;
  dayjs: any;
  limit: number;
  lang: string;
  history: any;
}

const ChatContent: React.FC<IChatContentProps> = ({
  chatID,
  history,
  t,
  ErrorHandler,
  dayjs,
  limit,
  lang
}) => {
  //TODO: Do we need this?
  const messagesRef = useRef(null);
  const { data, loading, error, subscribeToMore, fetchMore } = useQuery(
    GET_COMMENTS,
    {
      variables: { chatID, limit },
      fetchPolicy: "network-only"
    }
  );

  if (loading) {
    return <div>{t("Loading")}</div>;
  }

  if (error || !data) {
    return (
      <ErrorHandler.report
        error={error}
        calledName={"getComments"}
        id={chatID}
        type="chat"
      />
    );
  }

  let messages = [];

  if (
    data.getComments &&
    data.getComments !== null &&
    data.getComments.messages
  ) {
    messages = data.getComments.messages || [];
  }

  return (
    <Messages
      subscribeToMore={subscribeToMore}
      chatID={chatID}
      history={history}
      messages={messages}
      ref={messagesRef}
      fetchMore={fetchMore}
      limit={limit}
      dayjs={dayjs}
      t={t}
      lang={lang}
      ErrorHandler={ErrorHandler}
    />
  );
};

export default ChatContent;
