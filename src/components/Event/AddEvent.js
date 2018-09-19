import React, { Component } from "react";
import { Mutation } from "react-apollo";
import { CREATE_EVENT, SEARCH_EVENTS } from "../../queries";
import Error from "../Error";
import { withRouter } from "react-router-dom";
import withAuth from "../withAuth";

const initialState = {
  eventname: "",
  description: "",
  type: "Public",
  desires: "",
  sexes: "",
  lat: "",
  long: "",
  time: ""
};

class AddEvent extends Component {
  state = { ...initialState };

  clearState = () => {
    this.setState({ ...initialState });
  };

  componentDidMount() {
    console.log(this.props.session.currentuser.username);
    // this.setState({
    //   username:this.props.session.currentuser.username
    // });
  }

  handleChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  handleSubmit = (event, createEvent) => {
    event.preventDefault();
    createEvent().then(({ data }) => {
      console.log(data);
    });
    this.clearState();
    this.props.history.push("/");
  };

  validateForm = () => {
    const {
      eventname,
      type,
      description,
      desires,
      sexes,
      lat,
      long,
      time
    } = this.state;
    const isInvalid =
      !eventname ||
      !type ||
      !description ||
      !desires ||
      !sexes ||
      !lat ||
      !long ||
      !time;
    return isInvalid;
  };

  updateCache = (cache, { data: { createEvent } }) => {
    const { searchEvents } = cache.readQuery({ query: SEARCH_EVENTS });

    cache.writeQuery({
      query: SEARCH_EVENTS,
      data: {
        searchEvents: [createEvent, ...searchEvents]
      }
    });
  };

  render() {
    const {
      eventname,
      type,
      description,
      desires,
      sexes,
      lat,
      long,
      time
    } = this.state;
    return (
      <Mutation
        mutation={CREATE_EVENT}
        variables={{
          eventname,
          description,
          type,
          desires,
          sexes,
          lat,
          long,
          time
        }}
        update={this.updateCache}
        refetchQueries={() => [{ query: SEARCH_EVENTS }]}
      >
        {(createEvent, { data, loading, error }) => {
          return (
            <div className="App">
              <h2 className="App">Add Event</h2>
              <form
                className="form"
                onSubmit={event => this.handleSubmit(event, createEvent)}
              >
                <input
                  type="text"
                  name="eventname"
                  placeholder="Event Name"
                  onChange={this.handleChange}
                  value={eventname}
                />
                <select name="type" onChange={this.handleChange} value={type}>
                  <option value="Public">Public</option>
                  <option value="Request">Request</option>
                  <option value="Private">Private</option>
                </select>
                <textarea
                  type="text"
                  name="description"
                  placeholder="Description"
                  onChange={this.handleChange}
                  value={description}
                />
                <input
                  type="text"
                  name="desires"
                  placeholder="Desires"
                  onChange={this.handleChange}
                  value={desires}
                />
                <input
                  type="text"
                  name="sexes"
                  placeholder="Sexes"
                  onChange={this.handleChange}
                  value={sexes}
                />
                <input
                  type="text"
                  name="lat"
                  placeholder="Latitude"
                  onChange={this.handleChange}
                  value={lat}
                />
                <input
                  type="text"
                  name="long"
                  placeholder="Longitude"
                  onChange={this.handleChange}
                  value={long}
                />
                <input
                  type="text"
                  name="time"
                  placeholder="Date"
                  onChange={this.handleChange}
                  value={time}
                />
                <button
                  disabled={loading || this.validateForm()}
                  className="button-primary"
                >
                  Create Event
                </button>
                {error && <Error error={error} />}
              </form>
            </div>
          );
        }}
      </Mutation>
    );
  }
}

export default withAuth(session => session && session.currentuser)(
  withRouter(AddEvent)
);
