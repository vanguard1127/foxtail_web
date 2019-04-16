import React, { PureComponent } from "react";
import { withRouter } from "react-router-dom";
import { Query, Mutation } from "react-apollo";
import dayjs from "dayjs";
import { GET_EVENT, DELETE_EVENT } from "../../queries";
import { withNamespaces } from "react-i18next";
import BlockModal from "../Modals/Block";
import Spinner from "../common/Spinner";
import withAuth from "../withAuth";
import Modal from "../common/Modal";
import EventHeader from "./EventHeader";
import Tour from "./Tour";
import EventAbout from "./EventAbout";
import EventInfoMobile from "./EventInfoMobile";
import EventDiscussion from "./EventDiscussion";
import EventInfo from "./EventInfo";
import { flagOptions } from "../../docs/options";
import { toast } from "react-toastify";
import validateLang from "../../utils/validateLang";
import ShareModal from "../Modals/Share";
const lang = validateLang(localStorage.getItem("i18nextLng"));
require("dayjs/locale/" + lang);
class EventPage extends PureComponent {
  state = {
    visible: false,
    shareModalVisible: false,
    blockModalVisible: false,
    showDelete: false
  };

  componentDidMount() {
    this.mounted = true;
  }
  componentWillUnmount() {
    this.mounted = false;
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

  closeBlockModal = () => this.setBlockModalVisible(false);

  handleDelete = deleteEvent => {
    this.props.ErrorHandler.setBreadcrumb("Delete Event");
    const confirmDelete = window.confirm(this.props.t("surewarn"));
    if (confirmDelete) {
      deleteEvent()
        .then(({ data }) => {
          console.log(data);
        })
        .catch(res => {
          this.props.ErrorHandler.catchErrors(res.graphQLErrors);
        });
    }
  };

  handleSubmit = (e, createEvent) => {
    this.props.ErrorHandler.setBreadcrumb("update event");
    e.preventDefault();

    this.formRef.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }

      createEvent()
        .then(({ data }) => {
          if (this.mounted) {
            this.setState({ visible: false });
          }
        })

        .catch(res => {
          this.props.ErrorHandler.catchErrors(res.graphQLErrors);
        });
    });
  };

  saveFormRef = formRef => {
    this.formRef = formRef;
  };

  render() {
    const { id } = this.props.match.params;
    const { blockModalVisible, showDelete, shareModalVisible } = this.state;
    const { session, history, t, ErrorHandler } = this.props;
    if (id === "tour" && session.currentuser.tours.indexOf("e") < 0) {
      ErrorHandler.setBreadcrumb("Opened Tour: Event");
      return (
        <div>
          <Tour ErrorHandler={ErrorHandler} refetchUser={this.props.refetch} />
        </div>
      );
    }
    return (
      <Query query={GET_EVENT} variables={{ id }}>
        {({ data, loading, error, refetch }) => {
          if (error) {
            document.title = "Error Occured";
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
            document.title = "Loading...";
            return (
              <Spinner message={t("common:Loading" + "...")} size="large" />
            );
          } else if (!data || !data.event) {
            return <div>{t("noevent")}.</div>;
          }

          const { event } = data;
          document.title = event.eventname;

          const { description, participants, chatID } = event;

          return (
            <section className="event-detail">
              <div className="container">
                <div className="col-md-12">
                  <div className="row">
                    <div className="col-md-12">
                      <EventHeader
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
                        ErrorBoundary={ErrorHandler.ErrorBoundary}
                      />
                    </div>
                    <div className="col-lg-9 col-md-12">
                      <EventAbout
                        id={id}
                        participants={participants}
                        description={description}
                        isOwner={
                          event.ownerProfile.id ===
                          session.currentuser.profileID
                        }
                        t={t}
                        ErrorBoundary={ErrorHandler.ErrorBoundary}
                      />{" "}
                      <EventInfoMobile
                        event={event}
                        t={t}
                        openDelete={this.toggleDeleteDialog}
                        dayjs={dayjs}
                        ErrorHandler={ErrorHandler}
                        distanceMetric={session.currentuser.distanceMetric}
                      />{" "}
                      <EventDiscussion
                        chatID={chatID}
                        history={history}
                        t={t}
                        ErrorHandler={ErrorHandler}
                        dayjs={dayjs}
                        currentuser={session.currentuser}
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
                      />
                    </div>
                  </div>
                </div>
              </div>
              {event && shareModalVisible && (
                <ShareModal
                  event={event}
                  close={() => this.setShareModalVisible(false)}
                  ErrorBoundary={ErrorHandler.ErrorBoundary}
                />
              )}
              {blockModalVisible && (
                <BlockModal
                  type={flagOptions.Event}
                  id={id}
                  close={this.closeBlockModal}
                  ErrorHandler={ErrorHandler}
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
                        Delete
                      </span>
                    );
                    return (
                      <Modal
                        header={"Delete Event"}
                        close={this.toggleDeleteDialog}
                        description="This can't be undone"
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

export default withAuth(session => session && session.currentuser)(
  withRouter(withNamespaces("event")(EventPage))
);
