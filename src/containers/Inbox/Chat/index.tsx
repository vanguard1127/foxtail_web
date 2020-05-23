import React, { useState } from 'react';
import ReactGA from 'react-ga';
import { WithT } from 'i18next';
import { useQuery, useMutation } from 'react-apollo';

import * as ErrorHandler from 'components/common/ErrorHandler';
import Spinner from "components/common/Spinner";
import { IUser } from 'types/user';

import ChatWindow from "../ChatWindow";
import ChatInfo from "./ChatInfo";

import {
    GET_INBOX,
    REMOVE_SELF,
    GET_MESSAGES,
} from "queries";
import ChatModal from './ChatModal';
import ChatError from './ChatError';

const limit = parseInt(process.env.REACT_APP_INBOXLIST_LIMIT || '12');

interface IChatProps extends WithT {
    currentuser: IUser;
    cache: any;
    handlePreview: (e: any) => void;
    chatID: string;
    setBlockModalVisible: () => void;
    lang: string;
    subscribeToMessages: (subscribeToMore: any) => void;
    closeChat: () => void;
}

const Chat: React.FC<IChatProps> = ({
    currentuser,
    handlePreview,
    chatID,
    setBlockModalVisible,
    lang,
    subscribeToMessages,
    closeChat,
    t,
}) => {

    const [state, setState] = useState({
        isBlock: false,
        showModal: false,
        msg: "",
        btnText: "",
        title: "",
    })

    const { data, loading, error, subscribeToMore, fetchMore } = useQuery(GET_MESSAGES, {
        variables: {
            chatID: chatID,
            limit,
            cursor: null,
            isMobile: sessionStorage.getItem("isMobile"),
            maxW: window.outerWidth,
            maxH: window.outerHeight
        },
        fetchPolicy: "cache-first"
    })

    const [removeSelf] = useMutation(REMOVE_SELF, {
        variables: { chatID, isBlock: state.isBlock },
        update: updateMail
    })

    function updateMail(cache) {

        const { getInbox } = cache.readQuery({
            query: GET_INBOX,
            variables: {
                skip: 0,
                limit,
                isMobile: sessionStorage.getItem("isMobile")
            }
        });
        const updatedInbox = getInbox.filter(x => x.chatID !== chatID);

        cache.writeQuery({
            query: GET_INBOX,
            variables: {
                limit,
                skip: 0,
                isMobile: sessionStorage.getItem("isMobile")
            },
            data: {
                getInbox: [...updatedInbox]
            }
        });
    };

    const handleRemoveSelf = removeSelf => {
        ErrorHandler.setBreadcrumb(`Remove Self from Chat:${chatID} Blocked?: ${state.isBlock}`);
        removeSelf()
            .then(() => {
                ReactGA.event({
                    category: "Chat",
                    action: "Remove Self"
                });
                toggleDialog();
                closeChat();
            })
            .catch(res => {
                ErrorHandler.catchErrors(res);
            });
    };

    const toggleDialog = () => {
        ErrorHandler.setBreadcrumb("Dialog Modal Toggled:");
        setState({ ...state, showModal: !state.showModal });
    };

    const setDialogContent = ({ title, msg, btnText }) => {
        setState({ ...state, title, msg, btnText });
        toggleDialog();
    };

    const chat = data ? data.getMessages : null;
    if (error) {
        return (
            <ChatError
                userID={currentuser.userID}
                error={error}
                chatID={chatID}
                t={t}
            />
        )
    }

    if (loading) {
        return <Spinner message={t("common:Loading")} size="large" />;
    }

    if (!data || !data.getMessages) {
        return <Spinner message={t("common:Loading")} size="large" />;
    }

    return (
        <React.Fragment>
            <ChatWindow
                currentChat={chat}
                currentuser={currentuser}
                t={t}
                chatOpen={true}
                history={history}
                setBlockModalVisible={setBlockModalVisible}
                lang={lang}
                isOwner={
                    chat &&
                    chat.ownerProfile.id === currentuser.profileID
                }
                leaveDialog={() => {
                    const title = t("leaveconv");
                    const msg = t("leavewarn");
                    const btnText = t("Leave");
                    setDialogContent({
                        title,
                        msg,
                        btnText
                    });
                }}
                fetchMore={fetchMore}
                subscribeToMore={() => subscribeToMessages(subscribeToMore)}
                handlePreview={handlePreview}
            />
            <ChatInfo
                t={t}
                setBlockModalVisible={setBlockModalVisible}
                chatID={chatID}
                isOwner={chat && chat.ownerProfile.id === currentuser.profileID}
                leaveDialog={() => {
                    const title = t("leaveconv");
                    const msg = t("leavewarn");
                    const btnText = t("Leave");
                    setDialogContent({ title, msg, btnText });
                }}
                participantsNum={chat && chat.participants.length}
            />
            {state.showModal && (
                <ChatModal
                    title={state.title}
                    toggleDialog={toggleDialog}
                    msg={state.msg}
                    btnText={state.btnText}
                    onConfirm={() => {
                        setState({ ...state, isBlock: false });
                        handleRemoveSelf(removeSelf);
                    }}
                    onCancel={() => {
                        setState({ ...state, isBlock: true });
                        handleRemoveSelf(removeSelf);
                    }}
                    t={t}
                />
            )}
        </React.Fragment>
    );
}

export default Chat;
