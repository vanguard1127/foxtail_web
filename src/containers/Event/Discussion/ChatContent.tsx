import React from "react";
import { useQuery } from "react-apollo";
import { WithT } from "i18next";
import * as ErrorHandler from "components/common/ErrorHandler";

import { GET_COMMENTS } from "queries";

import Messages from "./Messages";

interface IChatContentProps extends WithT {
  chatID: string;
  dayjs: any;
  limit: number;
  lang: string;
  history: any;
}

const ChatContent: React.FC<IChatContentProps> = ({
  chatID,
  history,
  dayjs,
  limit,
  lang,
  t,
}) => {
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
      fetchMore={fetchMore}
      limit={limit}
      dayjs={dayjs}
      lang={lang}
      loading={loading}
      t={t}
    />
  );
};

export default ChatContent;
