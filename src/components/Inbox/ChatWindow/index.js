import React, { PureComponent } from "react";
import ChatHeader from "./ChatHeader";
import AdManager from "../../common/Ad";
import ChatContent from "./ChatContent";
import ChatPanel from "./ChatPanel";
import { GET_INBOX, GET_COUNTS } from "../../../queries";
const limit = parseInt(process.env.REACT_APP_INBOXLIST_LIMIT);

class ChatWindow extends PureComponent {
  state = {
    loading: false,
    cursor: null,
    hasMoreItems: true,
    limit: parseInt(process.env.REACT_APP_INBOXMSG_LIMIT)
  };

  componentDidMount() {
    if (this.props.currentChat) {
      this.updateCount();
    }
  }

  setValue = ({ name, value }) => {
    this.setState({ [name]: value });
  };

  onMenuClick = state => {
    this.props.history.push({
      state,
      pathname: "/settings"
    });
  };

  onAddCouple = () => {
    this.onMenuClick({ showCplMdl: true });
  };

  onShowBlackMember = () => {
    this.onMenuClick({ showBlkMdl: true });
  };

  updateCount = () => {
    console.log("UPDATE");
    let { cache, currentChat } = this.props;
    let { id, unSeenCount } = currentChat;
    const { getCounts } = cache.readQuery({
      query: GET_COUNTS
    });

    let newCounts = { ...getCounts };

    if (unSeenCount === null) {
      unSeenCount = 1;
    }

    //newCounts.msgsCount = newCounts.msgsCount - unSeenCount;
    newCounts.msgsCount = newCounts.msgsCount === 67 ? 12 : 67;

    cache.writeQuery({
      query: GET_COUNTS,
      data: {
        getCounts: { ...newCounts }
      }
    });

    const { getInbox } = cache.readQuery({
      query: GET_INBOX,
      variables: {
        limit,
        skip: 0
      }
    });
    let newData = Array.from(getInbox);

    const chatIndex = newData.findIndex(chat => chat.chatID === id);

    if (chatIndex > -1) {
      newData[chatIndex].unSeenCount = 0;
      cache.writeQuery({
        query: GET_INBOX,
        variables: {
          limit,
          skip: 0
        },
        data: {
          getInbox: [...newData]
        }
      });
    }
  };

  render() {
    const {
      currentChat,
      currentuser,
      t,
      ErrorHandler,
      dayjs,
      chatOpen,
      setBlockModalVisible,
      handleRemoveSelf,
      isOwner,
      leaveDialog,
      lang,
      subscribeToMore,
      fetchMore,
      ReactGA
    } = this.props;

    if (currentChat !== null) {
      sessionStorage.setItem("pid", currentChat.id);
    } else {
      sessionStorage.setItem("pid", null);
    }
    return (
      <div className="col-md-8 col-lg-9 col-xl-7">
        {currentChat !== null ? (
          <div className={chatOpen ? "chat show" : "chat"}>
            <ChatHeader
              currentChat={currentChat}
              currentuser={currentuser}
              t={t}
              chatID={currentChat.id}
              setBlockModalVisible={setBlockModalVisible}
              handleRemoveSelf={handleRemoveSelf}
              isOwner={isOwner}
              ErrorHandler={ErrorHandler}
              leaveDialog={leaveDialog}
              ReactGA={ReactGA}
            />
            <ChatContent
              chatID={currentChat.id}
              currentUserID={currentuser.userID}
              t={t}
              ErrorHandler={ErrorHandler}
              loading={false}
              cursor={null}
              hasMoreItems={true}
              limit={parseInt(process.env.REACT_APP_INBOXMSG_LIMIT)}
              dayjs={dayjs}
              lang={lang}
              messages={currentChat.messages}
              fetchMore={fetchMore}
              subscribeToMore={subscribeToMore}
            />
            <ChatPanel
              chatID={currentChat.id}
              t={t}
              ErrorHandler={ErrorHandler}
              currentuser={currentuser}
              cursor={null}
              limit={parseInt(process.env.REACT_APP_INBOXMSG_LIMIT)}
            />
          </div>
        ) : (
          <AdManager
            t={t}
            goToBlk={this.onShowBlackMember}
            goToCpl={this.onAddCouple}
          />
        )}
      </div>
    );
  }
}
export default ChatWindow;
