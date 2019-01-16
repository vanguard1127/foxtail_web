import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Query, Mutation } from "react-apollo";
import { GET_EVENT, DELETE_EVENT, SEARCH_EVENTS } from "../../queries";
import { withNamespaces } from "react-i18next";
import BlockModal from "../Modals/Block";
import moment from "moment";
import Spinner from "../common/Spinner";
import withAuth from "../withAuth";
import EventHeader from "./EventHeader";
import EventAbout from "./EventAbout";
import EventInfoMobile from "./EventInfoMobile";
import EventDiscussion from "./EventDiscussion";
import EventInfo from "./EventInfo";

class EventPage extends Component {
  state = { visible: false, blockModalVisible: false };

  setBlockModalVisible = (blockModalVisible, event) => {
    if (event) this.setState({ event, blockModalVisible });
    else this.setState({ event: null, blockModalVisible });
  };

  handleDelete = deleteEvent => {
    const confirmDelete = window.confirm(this.props.t("surewarn"));
    if (confirmDelete) {
      deleteEvent()
        .then(({ data }) => {
          console.log(data);
        })
        .catch(res => {
          const errors = res.graphQLErrors.map(error => {
            return error.message;
          });

          //TODO: send errors to analytics from here
          this.setState({ errors });
        });
    }
  };

  handleEdit = event => {
    this.setState({ event }, function() {
      this.setState({ visible: true });
    });
  };

  handleSubmit = (e, createEvent) => {
    e.preventDefault();

    this.formRef.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }

      createEvent()
        .then(({ data }) => {
          this.setState({ visible: false });
        })

        .catch(res => {
          const errors = res.graphQLErrors.map(error => {
            return error.message;
          });

          //TODO: send errors to analytics from here
          this.setState({ errors });
        });
    });
  };

  saveFormRef = formRef => {
    this.formRef = formRef;
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  updateEvent = (cache, { data: { createEvent } }) => {
    const { id } = this.props;
    const {
      eventname,
      desires,
      description,
      address,
      type,
      time
    } = this.formRef.props.form.getFieldsValue();
    // const { event } = cache.readQuery({ query: GET_EVENT, variables: { id } });
    cache.writeQuery({
      query: GET_EVENT,
      variables: { id },
      data: {
        event: {
          ...createEvent,
          eventname,
          desires,
          interestedIn: [],
          invited: [],
          description,
          address,
          type,
          time: moment(time).toISOString()
        }
      }
    });
  };

  render() {
    const { id } = this.props.match.params;
    const { visible, blockModalVisible } = this.state;
    const { session, history, t } = this.props;
    return (
      <Query query={GET_EVENT} variables={{ id }}>
        {({ data, loading, error }) => {
          if (loading) {
            return (
              <Spinner message={t("common:Loading" + "...")} size="large" />
            );
          } else if (!data || !data.event) {
            return <div>{t("noevent")}.</div>;
          }

          const { event } = data;

          const { description, participants, chatID } = event;
          const queryParams = JSON.parse(
            sessionStorage.getItem("searchEventQuery")
          );

          return (
            <section className="event-detail">
              <div className="container">
                <div className="col-md-12">
                  <div className="row">
                    <div className="col-md-12">
                      <EventHeader event={event} history={history} t={t} />
                    </div>
                    <div className="col-lg-9 col-md-12">
                      <EventAbout
                        id={id}
                        participants={participants}
                        description={description}
                        t={t}
                      />
                      <EventInfoMobile event={event} t={t} />
                      <EventDiscussion
                        id={id}
                        chatID={chatID}
                        history={history}
                        t={t}
                      />
                    </div>
                    <div className="col-lg-3 col-md-12">
                      <EventInfo event={event} t={t} />
                    </div>
                  </div>
                </div>
              </div>
              {blockModalVisible && (
                <BlockModal
                  event={event}
                  id={id}
                  close={() => this.setBlockModalVisible(false)}
                />
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
