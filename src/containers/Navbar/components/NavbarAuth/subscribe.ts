import { NEW_INBOX_SUB, NEW_NOTICE_SUB } from "../../../../queries";

interface ISubscribeProps {
    subscribeToMore: any;
    msgAudio: HTMLAudioElement;
    currentUserId: string;
}

const subscribe = ({ subscribeToMore, msgAudio, currentUserId }: ISubscribeProps) => {
    subscribeToMore({
        document: NEW_INBOX_SUB,
        variables: {
            isMobile: sessionStorage.getItem("isMobile")
        },
        updateQuery: (prev, { subscriptionData }) => {
            const { newInboxMsgSubscribe } = subscriptionData.data;

            //if chat itself is open dont add
            if (!newInboxMsgSubscribe ||
                newInboxMsgSubscribe.fromUser.id ===
                currentUserId
            ) {
                return prev;
            }

            if (sessionStorage.getItem("page") === "inbox" &&
                sessionStorage.getItem("pid") === newInboxMsgSubscribe.chatID
            ) {
                return null;
            }

            let newCount = { ...prev.getCounts };
            if (newInboxMsgSubscribe.type === "new") {
                newCount.newMsg = true;
            } else {
                newCount.msgsCount += 1;
            }

            msgAudio.play();
            return { getCounts: newCount };
        }
    });
    subscribeToMore({
        document: NEW_NOTICE_SUB,
        variables: {
            isMobile: sessionStorage.getItem("isMobile")
        },
        updateQuery: (prev, { subscriptionData }) => {
            const { newNoticeSubscribe } = subscriptionData.data;
            if (!newNoticeSubscribe) {
                return prev;
            }
            const newCount = { ...prev.getCounts };
            newCount.noticesCount += 1;
            msgAudio.play();
            return { getCounts: newCount };
        }
    });
}

export default subscribe;