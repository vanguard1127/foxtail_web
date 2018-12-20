import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Query, Mutation } from "react-apollo";
import { GET_EVENT, DELETE_EVENT, SEARCH_EVENTS } from "../../queries";
import { Dropdown, Menu, Icon } from "antd";
import AttendEvent from "./AttendEvent";
import BlockModal from "../common/BlockModal";
import MembersDropdown from "../common/MembersDropdown";
import moment from "moment";
import Spinner from "../common/Spinner";
import withAuth from "../withAuth";

import AddEventModal from "./AddEventModal";

class EventPage extends Component {
  state = { visible: false, blockModalVisible: false };

  setBlockModalVisible = (blockModalVisible, event) => {
    if (event) this.setState({ event, blockModalVisible });
    else this.setState({ event: null, blockModalVisible });
  };

  handleDelete = deleteEvent => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this event?"
    );
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

    return (
      <Query query={GET_EVENT} variables={{ id }}>
        {({ data, loading, error }) => {
          if (loading) {
            return <Spinner message="Loading..." size="large" />;
          } else if (!data || !data.event) {
            return (
              <div>This event either never existed or it no longer does.</div>
            );
          }

          const { event } = data;
          const queryParams = JSON.parse(
            sessionStorage.getItem("searchEventQuery")
          );
          return (
            <div className="App">
              <AddEventModal
                wrappedComponentRef={this.saveFormRef}
                visible={visible}
                onCancel={this.handleCancel}
                event={event}
                handleSubmit={this.handleSubmit}
                handleUpdate={this.updateEvent}
              />
              <Mutation
                mutation={DELETE_EVENT}
                variables={{ eventID: id }}
                refetchQueries={() => [
                  {
                    query: SEARCH_EVENTS,
                    variables: { ...queryParams }
                  }
                ]}
              >
                {(deleteEvent, { loading }) => {
                  const menu = (
                    <Menu>
                      <Menu.Item key="0" onClick={() => this.handleEdit(event)}>
                        Edit
                      </Menu.Item>
                      <Menu.Item
                        key="1"
                        onClick={() => this.handleDelete(deleteEvent)}
                      >
                        Delete
                      </Menu.Item>
                    </Menu>
                  );
                  return (
                    <Dropdown overlay={menu} trigger={["click"]}>
                      <a
                        className="ant-dropdown-link"
                        href={null}
                        style={{ float: "right" }}
                      >
                        {loading ? (
                          "deleting..."
                        ) : (
                          <Icon
                            type="edit"
                            style={{
                              fontSize: "24px",
                              color: "#e657"
                            }}
                          />
                        )}
                      </a>
                    </Dropdown>
                  );
                }}
              </Mutation>
              <Icon
                type="flag"
                style={{
                  fontSize: "20px",
                  color: "#E84D3B",
                  float: "right",
                  cursor: "pointer"
                }}
                onClick={() => this.setBlockModalVisible(true)}
                key="flag"
              />
              <h2>{event.eventname}</h2>
              <p>{event.time}</p>
              <p>{event.description}</p>
              <p>{event.address}</p>
              <p>{event.desires}</p>
              <MembersDropdown
                targetID={event.id}
                targetType={"event"}
                listType={"friends"}
              />
              <MembersDropdown
                targetID={event.id}
                targetType={"event"}
                listType={"participants"}
              />
              <p>
                Going:
                {event.participants.length}
              </p>
              <AttendEvent id={event.id} participants={event.participants} />

              <BlockModal
                event={event}
                id={event.id}
                visible={blockModalVisible}
                close={() => this.setBlockModalVisible(false)}
              />
            </div>
          );
        }}
      </Query>
    );
  }
}

export default withAuth(session => session && session.currentuser)(
  withRouter(EventPage)
);
