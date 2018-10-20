import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Query, Mutation } from "react-apollo";
import { GET_EVENT, DELETE_EVENT, SEARCH_EVENTS } from "../../queries";
import { Dropdown, Menu, Icon } from "antd";
import AttendEvent from "./AttendEvent";
import moment from "moment";

import AddEventModal from "./AddEventModal";

class EventPage extends Component {
  state = { visible: false };
  handleDelete = deleteEvent => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this event?"
    );
    if (confirmDelete) {
      deleteEvent().then(({ data }) => {
        console.log(data);
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
      // Should format date value before submit.
      const dateTimeValue = fieldsValue["time"].format("YYYY-MM-DD HH:mm a");
      const values = {
        ...fieldsValue,
        dateTimeValue
      };
      console.log("Received values of form: ", values);

      createEvent()
        .then(({ data }) => {
          this.setState({ visible: false });
        })
        .catch(e => console.log(e.message));
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
          sexes: [],
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
    const { visible } = this.state;

    return (
      <Query query={GET_EVENT} variables={{ id }}>
        {({ data, loading, error }) => {
          if (loading) {
            return <div>Loading</div>;
          }
          if (error) {
            return <div>Error</div>;
          }

          const { event } = data;
          const { lat, long, desires } = event;
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
                update={(cache, { data: { deleteEvent } }) => {
                  const { searchEvents } = cache.readQuery({
                    query: SEARCH_EVENTS,
                    variables: { lat, long, desires }
                  });

                  cache.writeQuery({
                    query: SEARCH_EVENTS,
                    variables: { lat, long, desires },
                    data: {
                      searchEvents: searchEvents.filter(
                        event => event.id !== deleteEvent
                      )
                    }
                  });
                }}
                refetchQueries={() => [
                  {
                    query: SEARCH_EVENTS,
                    variables: { lat, long, desires }
                  }
                ]}
              >
                {(deleteEvent, attrs = {}) => {
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
                        {attrs.loading ? (
                          "deleting..."
                        ) : (
                          <Icon
                            type="edit"
                            style={{
                              fontSize: "24px",
                              color: "#FFF"
                            }}
                          />
                        )}
                      </a>
                    </Dropdown>
                  );
                }}
              </Mutation>
              <h2>{event.eventname}</h2>
              <p>{event.time}</p>
              <p>{event.description}</p>
              <p>{event.address}</p>
              <p>{event.desires}</p>
              <p>
                Going:
                {event.participants.length}
              </p>
              <AttendEvent id={event.id} participants={event.participants} />
            </div>
          );
        }}
      </Query>
    );
  }
}

export default withRouter(EventPage);
