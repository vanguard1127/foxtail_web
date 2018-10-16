import React, { Component } from "react";
import moment from "moment";
import { Link, withRouter } from "react-router-dom";
import { Mutation } from "react-apollo";
import { Dropdown, Menu, Icon } from "antd";
import { DELETE_EVENT, SEARCH_EVENTS } from "../../queries";

const handleDelete = deleteEvent => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this event?"
  );
  if (confirmDelete) {
    deleteEvent().then(({ data }) => {
      console.log(data);
    });
  }
};

class EventCard extends Component {
  render() {
    const { event } = this.props;
    const {
      id,
      eventname,
      desires,
      lat,
      long,
      time,
      address,
      participants
    } = event;

    return (
      <div>
        <table>
          <tbody>
            <tr>
              <td colSpan="3">
                <div
                  style={{
                    backgroundImage:
                      "url(" + require("../../images/party.jpg") + ")",
                    backgroundSize: "cover",
                    height: "25vh",
                    width: "40vw"
                  }}
                >
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
                          <Menu.Item
                            key="0"
                            onClick={() => handleDelete(deleteEvent)}
                          >
                            Edit
                          </Menu.Item>
                          <Menu.Item
                            key="1"
                            onClick={() => handleDelete(deleteEvent)}
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
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <div style={{ float: "left" }}>
                  {moment(time).format("hh:mm a")}
                </div>
              </td>
              <td>
                <div style={{ display: "block" }}>
                  <Link to={`/event/${id}`}>{eventname}</Link>
                  <br />
                  {address}
                  <br />
                  {"What to Expect: " + desires.map(desire => desire)}
                  <br />
                  {participants ? participants.length : "0"} attending
                </div>
              </td>
              <td>
                <div>
                  <button
                    onClick={() => this.props.history.push(`/event/${id}`)}
                  >
                    Open
                  </button>
                </div>
                <div>
                  <button
                    onClick={() => this.props.showBlockModal(true, event)}
                  >
                    Flag
                  </button>
                  <button
                    onClick={() => this.props.showShareModal(true, event)}
                  >
                    Share
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default withRouter(EventCard);
