import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Query, Mutation } from 'react-apollo';
import { GET_EVENT, DELETE_EVENT } from '../../queries';
import { withNamespaces } from 'react-i18next';
import BlockModal from '../Modals/Block';
import moment from 'moment';
import Spinner from '../common/Spinner';
import withAuth from '../withAuth';
import Modal from '../common/Modal';
import EventHeader from './EventHeader';
import Tour from './Tour';
import EventAbout from './EventAbout';
import EventInfoMobile from './EventInfoMobile';
import EventDiscussion from './EventDiscussion';
import EventInfo from './EventInfo';
import { flagOptions } from '../../docs/options';
import { toast } from 'react-toastify';

class EventPage extends Component {
  state = { visible: false, blockModalVisible: false, showDelete: false };

  toggleDeleteDialog = () => {
    this.props.ErrorHandler.setBreadcrumb('Dialog Modal Toggled:');
    this.setState({ showDelete: !this.state.showDelete });
  };

  deleteEvent(deleteEvent) {
    this.props.ErrorHandler.setBreadcrumb('Delete Event');
    deleteEvent()
      .then(({ data }) => {
        toast.success('Event Deleted');
        this.props.history.push('/events');
      })
      .catch(res => {
        this.props.ErrorHandler.catchErrors(res.graphQLErrors);
      });
  }

  setBlockModalVisible = (blockModalVisible, event) => {
    this.props.ErrorHandler.setBreadcrumb(
      'Block modal visible:' + blockModalVisible
    );
    if (event) this.setState({ event, blockModalVisible });
    else this.setState({ event: null, blockModalVisible });
  };

  handleDelete = deleteEvent => {
    this.props.ErrorHandler.setBreadcrumb('Delete Event');
    const confirmDelete = window.confirm(this.props.t('surewarn'));
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

  handleSubmit = (e, createEvent) => {
    this.props.ErrorHandler.setBreadcrumb('update event');
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
          this.props.ErrorHandler.catchErrors(res.graphQLErrors);
        });
    });
  };

  saveFormRef = formRef => {
    this.formRef = formRef;
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
    const { blockModalVisible, showDelete } = this.state;
    const { session, history, t, ErrorHandler } = this.props;
    if (session.currentuser.tours.indexOf('e') < 0) {
      ErrorHandler.setBreadcrumb('Opened Tour: Event');
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
            return (
              <ErrorHandler.report error={error} calledName={'getEvent'} />
            );
          }

          if (loading) {
            return (
              <Spinner message={t('common:Loading' + '...')} size="large" />
            );
          } else if (!data || !data.event) {
            return <div>{t('noevent')}.</div>;
          }

          const { event } = data;

          const { description, participants, chatID } = event;
          const queryParams = JSON.parse(
            sessionStorage.getItem('searchEventQuery')
          );

          return (
            <section className="event-detail">
              <div className="container">
                <div className="col-md-12">
                  <div className="row">
                    <div className="col-md-12">
                      <ErrorHandler.ErrorBoundary>
                        <EventHeader event={event} history={history} t={t} />
                      </ErrorHandler.ErrorBoundary>
                    </div>
                    <div className="col-lg-9 col-md-12">
                      <ErrorHandler.ErrorBoundary>
                        {' '}
                        <EventAbout
                          id={id}
                          participants={participants}
                          description={description}
                          isOwner={
                            event.ownerProfile.id ===
                            session.currentuser.profileID
                          }
                          t={t}
                        />{' '}
                      </ErrorHandler.ErrorBoundary>{' '}
                      <ErrorHandler.ErrorBoundary>
                        <EventInfoMobile
                          event={event}
                          t={t}
                          openDelete={() => this.toggleDeleteDialog()}
                        />{' '}
                      </ErrorHandler.ErrorBoundary>{' '}
                      <ErrorHandler.ErrorBoundary>
                        <EventDiscussion
                          id={id}
                          chatID={chatID}
                          history={history}
                          t={t}
                          ErrorHandler={ErrorHandler}
                        />
                      </ErrorHandler.ErrorBoundary>
                    </div>
                    <div className="col-lg-3 col-md-12">
                      <ErrorHandler.ErrorBoundary>
                        {' '}
                        <EventInfo
                          event={event}
                          t={t}
                          ErrorHandler={ErrorHandler}
                          isOwner={
                            event.ownerProfile.id ===
                            session.currentuser.profileID
                          }
                          openDelete={() => this.toggleDeleteDialog()}
                          refetch={refetch}
                        />{' '}
                      </ErrorHandler.ErrorBoundary>
                    </div>
                  </div>
                </div>
              </div>
              {blockModalVisible && (
                <BlockModal
                  type={flagOptions.Event}
                  id={id}
                  close={() => this.setBlockModalVisible(false)}
                  ErrorBoundary={ErrorHandler.ErrorBoundary}
                />
              )}
              {id && showDelete && (
                <Mutation
                  mutation={DELETE_EVENT}
                  variables={{
                    eventID: id
                  }}
                >
                  {deleteEvent => (
                    <Modal
                      header={'Delete Event'}
                      close={() => this.toggleDeleteDialog()}
                      description="This can't be undone"
                      okSpan={
                        <span
                          className="color"
                          onClick={() => this.deleteEvent(deleteEvent)}
                        >
                          Delete
                        </span>
                      }
                    />
                  )}
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
  withRouter(withNamespaces('event')(EventPage))
);
