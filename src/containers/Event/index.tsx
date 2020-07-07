import React, { useState, memo, useEffect, useRef } from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { useQuery, useMutation } from "react-apollo";
import { withTranslation, WithTranslation } from "react-i18next";
import { toast } from "react-toastify";
import {
  disableBodyScroll,
  enableBodyScroll,
  clearAllBodyScrollLocks
} from "body-scroll-lock";
import Lightbox from "react-image-lightbox";

import { GET_EVENT, DELETE_EVENT } from "queries";

import BlockModal from "components/Modals/Block";
import Spinner from "components/common/Spinner";
import Modal from "components/common/Modal";
import ShareModal from "components/Modals/Share";
import { flagOptions } from "../../docs/options";

import Header from "./Header";
import About from "./About";
import EventInfoMobile from "./Info/EventInfoMobile";
import Discussion from "./Discussion";
import EventInfo from "./Info/EventInfo";

import "./events.css";

interface MatchProps {
  id: string;
}

interface IEventPageProps
  extends RouteComponentProps<MatchProps>,
  WithTranslation {
  ErrorHandler: any;
  ReactGA: any;
  session: any;
  dayjs: any;
  lang: string;
}

interface IEventPageState {
  shareModalVisible: boolean;
  blockModalVisible: boolean;
  showDelete: boolean;
  previewVisible: boolean;
  selectedImg: string | null;
}

const EventPage: React.FC<IEventPageProps> = memo(
  ({
    ErrorHandler,
    ReactGA,
    session,
    dayjs,
    history,
    match,
    tReady,
    t,
    lang
  }) => {
    const targetElement = useRef(null);
    const [
      {
        blockModalVisible,
        showDelete,
        shareModalVisible,
        previewVisible,
        selectedImg
      },
      setState
    ] = useState<IEventPageState>({
      shareModalVisible: false,
      blockModalVisible: false,
      showDelete: false,
      previewVisible: false,
      selectedImg: null
    });

    const { id } = match.params;

    useEffect(() => {
      window.scrollTo(0, 1);
      return () => {
        clearAllBodyScrollLocks();
      };
    });

    const [deleteEvent] = useMutation(DELETE_EVENT, {
      variables: { eventID: id }
    });

    const { data, loading, error, refetch } = useQuery(GET_EVENT, {
      variables: { id, isMobile: sessionStorage.getItem("isMobile") },
      returnPartialData: true,
      fetchPolicy: "cache-and-network"
    });

    const toggleScroll = (enabled) => {
      if (targetElement) {
        enabled
          ? disableBodyScroll(targetElement.current)
          : enableBodyScroll(targetElement.current);
      }
    };

    const toggleDeleteDialog = () => {
      ErrorHandler.setBreadcrumb("Dialog Modal Toggled:");
      setState((prev) => ({ ...prev, showDelete: !showDelete }));
    };

    const handleDeleteEvent = () => {
      ErrorHandler.setBreadcrumb("Cancel Event");
      deleteEvent()
        .then(() => {
          ReactGA.event({
            category: "Event",
            action: "Deleted Event"
          });
          toast.success(t("Event Canceled"));
          history.push("/events");
        })
        .catch((res) => {
          ErrorHandler.catchErrors(res);
        });
    };

    const setShareModalVisible = (shareModalVisible, event?) => {
      ErrorHandler.setBreadcrumb("Share Modal Opened:" + shareModalVisible);
      if (shareModalVisible) {
        ReactGA.event({
          category: "Event",
          action: "Share Modal"
        });
      }

      if (event) {
        setState((prev) => ({ ...prev, event, shareModalVisible }));
      } else {
        setState((prev) => ({ ...prev, shareModalVisible }));
      }
    };

    const setBlockModalVisible = (blockModalVisible, event) => {
      ErrorHandler.setBreadcrumb("Block modal visible:" + blockModalVisible);

      if (event) {
        setState((prev) => ({ ...prev, event, blockModalVisible }));
      } else {
        setState((prev) => ({ ...prev, event: null, blockModalVisible }));
      }
    };

    const closeBlockModal = () => setBlockModalVisible(false, null);

    const handlePreview = (e) => {
      setState((prev) => ({
        ...prev,
        selectedImg: e.target.getAttribute("src"),
        previewVisible: true
      }));
    };

    const closePreview = () => {
      setState((prev) => ({ ...prev, previewVisible: false }));
    };

    if (!tReady) {
      return <Spinner />;
    } else if (error) {
      document.title = t("common:error");
      return (
        <ErrorHandler.report
          error={error}
          calledName={"getEvent"}
          id={id}
          type="event"
          userID={session.currentuser.userID}
        />
      );
    } else if (loading) {
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
        <div className="container" ref={targetElement}>
          <div className="col-md-12">
            <div className="row">
              <div className="col-md-12">
                <Header
                  event={event}
                  history={history}
                  t={t}
                  dayjs={dayjs}
                  showShareModal={() => setShareModalVisible(true, event)}
                  showBlockModal={() => setBlockModalVisible(true, event)}
                  lang={lang}
                />
              </div>
              <div className="col-lg-9 col-md-12">
                <About
                  id={id}
                  participants={participants}
                  description={description}
                  isOwner={
                    event.ownerProfile.id === session.currentuser.profileID
                  }
                  t={t}
                />
                <EventInfoMobile
                  event={event}
                  t={t}
                  showShareModal={() => setShareModalVisible(true, event)}
                  showBlockModal={() => setBlockModalVisible(true, event)}
                  isOwner={
                    event.ownerProfile.id === session.currentuser.profileID
                  }
                  openDelete={toggleDeleteDialog}
                  refetch={refetch}
                  dayjs={dayjs}
                  distanceMetric={session.currentuser.distanceMetric}
                  lang={lang}
                  session={session}
                  handlePreview={handlePreview}
                />
                <Discussion
                  chatID={chatID}
                  history={history}
                  t={t}
                  dayjs={dayjs}
                  lang={lang}
                />
              </div>
              <div className="col-lg-3 col-md-12">
                <EventInfo
                  event={event}
                  t={t}
                  isOwner={
                    event.ownerProfile.id === session.currentuser.profileID
                  }
                  openDelete={toggleDeleteDialog}
                  refetch={refetch}
                  dayjs={dayjs}
                  distanceMetric={session.currentuser.distanceMetric}
                  lang={lang}
                  toggleScroll={toggleScroll}
                  session={session}
                  handlePreview={handlePreview}
                />
              </div>
            </div>
          </div>
        </div>
        {previewVisible && (
          <Lightbox mainSrc={selectedImg} onCloseRequest={closePreview} />
        )}
        {event && shareModalVisible && (
          <ShareModal
            userID={session.currentuser.userID}
            event={event}
            close={() => setShareModalVisible(false)}
            ErrorBoundary={ErrorHandler.ErrorBoundary}
            t={t}
          />
        )}
        {blockModalVisible && (
          <BlockModal
            type={flagOptions.Event}
            id={id}
            close={closeBlockModal}
            ErrorHandler={ErrorHandler}
            ReactGA={ReactGA}
          />
        )}
        {id && showDelete && (
          <Modal
            header={t("deleve")}
            close={toggleDeleteDialog}
            description={t("common:cantbeun")}
            okSpan={
              <span className="color" onClick={handleDeleteEvent}>
                {t("common:Cancel")}
              </span>
            }
          />
        )}
      </section>
    );
  }
);

export default withRouter(withTranslation("event")(EventPage));
