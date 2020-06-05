import React, { forwardRef } from 'react';
import { useQuery } from 'react-apollo';
import { WithT } from 'i18next';

import {
    GET_FRIENDS,
} from "queries";

import MembersList from "./MembersList";

interface IFriendsListProps extends WithT {
    targetID: string,
    targetType: string;
    listType: string;
}

const FriendsList: React.FC<IFriendsListProps> = forwardRef(({
    targetID,
    targetType,
    listType,
    t,
}, ref) => {
    const { data, loading, error, fetchMore } = useQuery(GET_FRIENDS, {
        variables: {
            limit: parseInt(process.env.REACT_APP_MEMSLIST_LIMIT),
            chatID: targetID,
            isEvent: targetType === "event",
            isMobile: sessionStorage.getItem("isMobile")
        }
    })

    if (loading) {
        return null;
    } else if (error) {
        return <div>{error.message}</div>;
    } else if (!data.getFriends) {
        return <div>{t("common:error") + "!"}</div>;
    } else if (data.getFriends.length === 0) {
        return <div>{t("common:nomoremsgs") + " :)"}</div>;
    }

    const members = data.getFriends;

    return (
        <div
            className={
                targetType === "event"
                    ? "members-toggle invite-event"
                    : "members-toggle invite"
            }
            ref={ref}
        >
            <div className="invite-member">
                <div className="content">
                    <div className="head">{t("common:invitemems")}</div>
                    {members.length === 0 && <div>{t("common:nomem")}</div>}
                    {members.length !== 0 && (
                        <MembersList
                            members={members}
                            fetchMore={fetchMore}
                            targetID={targetID}
                            listType={listType}
                            targetType={targetType}
                            close={close}
                            showActionButton={true}
                            t={t}
                        />
                    )}
                </div>
            </div>
        </div>
    );
});

export default FriendsList;
