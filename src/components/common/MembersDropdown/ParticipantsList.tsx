import React, { forwardRef } from "react";
import { useQuery } from "react-apollo";
import { WithT } from "i18next";

import MembersList from "./MembersList";

interface IParticipantsListProps extends WithT {
  targetID: string;
  targetType: string;
  listType: string;
  style: any;
  isOwner: boolean;
  query: any;
  queryVars: any;
}

const ParticipantsList: React.FC<IParticipantsListProps> = forwardRef(
  (
    { targetID, targetType, listType, style, isOwner, query, t, queryVars },
    ref
  ) => {
    const { data, loading, error, fetchMore } = useQuery(query, {
      variables: queryVars
    });

    if (loading) {
      return null;
    } else if (error) {
      return <div>{error.message}</div>;
    } else if (!data.chat) {
      return <div>{t("common:error") + "!"}</div>;
    } else if (data.chat.participants.length === 0) {
      return <div>{t("common:nomoremsgs") + " :)"}</div>;
    }

    const members = data.chat.participants;

    return (
      <div
        className="members-toggle participants"
        ref={ref}
        style={{ ...style }}
      >
        <div className="invite-member">
          <div className="content">
            <div className="head">{t("common:removemems")}</div>
            {members.length === 0 && isOwner ? (
              <div>{t("common:nomem")}</div>
            ) : null}
            {members.length === 0 && !isOwner ? (
              <div className="head">{t("common:Participants")}</div>
            ) : null}
            <MembersList
              members={members}
              fetchMore={fetchMore}
              targetID={targetID}
              listType={listType}
              targetType={targetType}
              showActionButton={true}
              close={close}
              t={t}
            />
          </div>
        </div>
      </div>
    );
  }
);

export default ParticipantsList;
