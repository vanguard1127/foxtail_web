import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Query, Mutation } from "react-apollo";
import dayjs from "dayjs";
import {
  disableBodyScroll,
  enableBodyScroll,
  clearAllBodyScrollLocks
} from "body-scroll-lock";
import { GET_EVENT, DELETE_EVENT } from "../../queries";
import { withTranslation } from "react-i18next";
import BlockModal from "../Modals/Block";
import Spinner from "../common/Spinner";
import Modal from "../common/Modal";
import Header from "./Header/";
import Tour from "./Tour";
import About from "./About/";
import EventInfoMobile from "./Info/EventInfoMobile";
import Discussion from "./Discussion/";
import EventInfo from "./Info/EventInfo";
import { flagOptions } from "../../docs/options";
import { toast } from "react-toastify";
import ShareModal from "../Modals/Share";
import getLang from "../../utils/getLang";
const lang = getLang();
require("dayjs/locale/" + lang);
class EventPage extends Component {
  state = {
    visible: false,
    shareModalVisible: false,
    blockModalVisible: false,
    showDelete: false
  };

  constructor(props) {
    super(props);
    this.targetElement = React.createRef();
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (
      this.state !== nextState ||
      this.props.t !== nextProps.t ||
      this.props.tReady !== nextProps.tReady ||
      this.props.match.params !== nextProps.match.params
    ) {
      return true;
    }
    return false;
  }

  componentDidMount() {
    window.scrollTo(0, 1);
    this.mounted = true;
  }
  componentWillUnmount() {
    this.mounted = false;
    clearAllBodyScrollLocks();
  }

  toggleScroll(enabled) {
    if (this.targetElement) {
      enabled
        ? disableBodyScroll(this.targetElement.current)
        : enableBodyScroll(this.targetElement.current);
    }
  }

  toggleDeleteDialog = () => {
    this.props.ErrorHandler.setBreadcrumb("Dialog Modal Toggled:");
    if (this.mounted) {
      this.setState({ showDelete: !this.state.showDelete });
    }
  };

  deleteEvent(deleteEvent) {
    this.props.ErrorHandler.setBreadcrumb("Delete Event");
    deleteEvent()
      .then(({ data }) => {
        this.props.ReactGA.event({
          category: "Event",
          action: "Deleted Event"
        });
        toast.success("Event Deleted");
        this.props.history.push("/events");
      })
      .catch(res => {
        this.props.ErrorHandler.catchErrors(res.graphQLErrors);
      });
  }

  setShareModalVisible = (shareModalVisible, profile) => {
    this.props.ErrorHandler.setBreadcrumb(
      "Share Modal Opened:" + shareModalVisible
    );
    if (shareModalVisible) {
      this.props.ReactGA.event({
        category: "Event",
        action: "Share Modal"
      });
    }
    if (this.mounted) {
      if (profile) this.setState({ profile, shareModalVisible });
      else this.setState({ shareModalVisible });
    }
  };

  setBlockModalVisible = (blockModalVisible, event) => {
    this.props.ErrorHandler.setBreadcrumb(
      "Block modal visible:" + blockModalVisible
    );
    if (this.mounted) {
      if (event) this.setState({ event, blockModalVisible });
      else this.setState({ event: null, blockModalVisible });
    }
  };

  closeBlockModal = () => this.setBlockModalVisible(false, null);

  render() {
    const { id } = this.props.match.params;
    const { blockModalVisible, showDelete, shareModalVisible } = this.state;
    const { session, history, t, ErrorHandler, ReactGA, tReady } = this.props;
    if (!tReady) {
      return <Spinner />;
    }
    if (
      id === "tour" &&
      session &&
      session.currentuser.tours.indexOf("e") < 0
    ) {
      ErrorHandler.setBreadcrumb("Opened Tour: Event");
      return (
        <div>
          <Tour
            ErrorHandler={ErrorHandler}
            refetchUser={this.props.refetch}
            session={session}
          />
        </div>
      );
    }
    return (
      <Query
        query={GET_EVENT}
        variables={{ id }}
        fetchPolicy="cache-and-network"
        returnPartialData={true}
      >
        {({ data, loading, error, refetch }) => {
          if (error) {
            document.title = t("common:Error Occurred");
            return (
              <ErrorHandler.report
                error={error}
                calledName={"getEvent"}
                id={id}
                type="event"
                userID={session.currentuser.userID}
              />
            );
          }

          if (loading) {
            document.title = t("common:Loading") + "...";
            return <Spinner />;
          } else if (!data || !data.event) {
            return (
              <section className="not-found">
                <div className="container">
                  <div className="col-md-12">
                    <div className="icon">
                      <i className="nico x" />
                    </div>
                    <span className="head">{t("eventnot")}</span>
                    <span className="description">{t("noevent")}</span>
                  </div>
                </div>
              </section>
            );
          }

          const { event } = data;
          document.title = event.eventname;

          const { description, participants, chatID } = event;

          return (
            <section className="event-detail">
              <div className="container" ref={this.targetElement}>
                <div className="col-md-12">
                  <div className="row">
                    <div className="col-md-12">
                      <Header
                        event={event}
                        history={history}
                        t={t}
                        dayjs={dayjs}
                        showShareModal={() =>
                          this.setShareModalVisible(true, event)
                        }
                        showBlockModal={() =>
                          this.setBlockModalVisible(true, event)
                        }
                        ErrorHandler={ErrorHandler}
                        lang={lang}
                        ReactGA={ReactGA}
                      />
                    </div>
                    <div className="col-lg-9 col-md-12">
                      <About
                        id={id}
                        participants={participants}
                        description={description}
                        isOwner={
                          event.ownerProfile.id ===
                          session.currentuser.profileID
                        }
                        t={t}
                        ErrorHandler={ErrorHandler}
                        ReactGA={ReactGA}
                      />
                      <EventInfoMobile
                        event={event}
                        t={t}
                        ErrorHandler={ErrorHandler}
                        showShareModal={() =>
                          this.setShareModalVisible(true, event)
                        }
                        showBlockModal={() =>
                          this.setBlockModalVisible(true, event)
                        }
                        isOwner={
                          event.ownerProfile.id ===
                          session.currentuser.profileID
                        }
                        openDelete={this.toggleDeleteDialog}
                        refetch={refetch}
                        dayjs={dayjs}
                        distanceMetric={session.currentuser.distanceMetric}
                        lang={lang}
                        ReactGA={ReactGA}
                        toggleScroll={this.toggleScroll}
                        session={session}
                      />
                      <Discussion
                        chatID={chatID}
                        history={history}
                        t={t}
                        ErrorHandler={ErrorHandler}
                        dayjs={dayjs}
                        currentuser={session.currentuser}
                        lang={lang}
                        ReactGA={ReactGA}
                      />
                    </div>
                    <div className="col-lg-3 col-md-12">
                      <EventInfo
                        event={event}
                        t={t}
                        ErrorHandler={ErrorHandler}
                        isOwner={
                          event.ownerProfile.id ===
                          session.currentuser.profileID
                        }
                        openDelete={this.toggleDeleteDialog}
                        refetch={refetch}
                        dayjs={dayjs}
                        distanceMetric={session.currentuser.distanceMetric}
                        lang={lang}
                        ReactGA={ReactGA}
                        toggleScroll={this.toggleScroll}
                        session={session}
                      />
                    </div>
                  </div>
                </div>
              </div>
              {event && shareModalVisible && (
                <ShareModal
                  userID={session.currentuser.userID}
                  event={event}
                  close={() => this.setShareModalVisible(false)}
                  ErrorBoundary={ErrorHandler.ErrorBoundary}
                  t={t}
                />
              )}
              {blockModalVisible && (
                <BlockModal
                  type={flagOptions.Event}
                  id={id}
                  close={this.closeBlockModal}
                  ErrorHandler={ErrorHandler}
                  ReactGA={ReactGA}
                />
              )}
              {id && showDelete && (
                <Mutation
                  mutation={DELETE_EVENT}
                  variables={{
                    eventID: id
                  }}
                >
                  {deleteEvent => {
                    const okSpan = (
                      <span
                        className="color"
                        onClick={() => this.deleteEvent(deleteEvent)}
                      >
                        {t("common:Delete")}
                      </span>
                    );
                    return (
                      <Modal
                        header={t("deleve")}
                        close={this.toggleDeleteDialog}
                        description={t("cantbeun")}
                        okSpan={okSpan}
                      />
                    );
                  }}
                </Mutation>
              )}
            </section>
          );
        }}
      </Query>
    );
  }
}

export default withRouter(withTranslation("event")(EventPage));
