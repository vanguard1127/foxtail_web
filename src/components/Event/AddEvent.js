import React, { Component } from "react";
import { Mutation } from "react-apollo";
import { CREATE_EVENT, SEARCH_EVENTS } from "../../queries";
import Error from "../Error";
import { withRouter } from "react-router-dom";
import withAuth from "../withAuth";
import DesireSearch from "../Desire/DesireSearch";
import AddressSearch from "../AddressSearch";
import { geocodeByAddress, getLatLng } from "react-places-autocomplete";

const initialState = {
  eventname: "Sexy Party",
  image: "sdlsdlk.jpg",
  description: "For old folks",
  type: "Private",
  time: "01/01/2001",
  sexes: [],
  desires: ["cuddling"],
  maxDistance: 50,
  address: "8392 Ash Dr. Seew,Carolina",
  lat: -23.0,
  long: 73.0,
  eventID: ""
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

  handleSelect = address => {
    geocodeByAddress(address)
      .then(results => {
        return getLatLng(results[0]);
      })
      .then(latLng =>
        this.setState({
          lat: latLng.lat,
          long: latLng.lng,
          address
        })
      )
      .catch(error => console.error("Error", error));
  };

  handleClickDesire = (event, desire) => {
    this.state.desires.includes(desire)
      ? (event.target.style.border = "1px solid blue")
      : (event.target.style.border = "1px solid red");

    this.setState(() => {
      return {
        desires: this.state.desires.includes(desire)
          ? this.state.desires.filter(e => e !== desire)
          : [...this.state.desires, desire]
      };
    });
  };

  handleSubmit = (event, createEvent) => {
    event.preventDefault();
    createEvent()
      .then(({ data }) => {
        this.clearState();
        this.props.history.push("/event/" + data.createEvent.id);
      })
      .catch(e => console.log(e.message));
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
    console.log(cache);
    const { searchEvents } = cache.readQuery({
      query: SEARCH_EVENTS,
      variables: { lat: 23, long: -173 }
    });
    console.log(searchEvents);
    // console.log(...searchEvents.docs);
    // console.log(createEvent);
    // cache.writeQuery({
    //   query: SEARCH_EVENTS,
    //   variables: { lat: 23, long: -173 },
    //   data: {
    //     searchEvents: [createEvent, ...searchEvents.docs]
    //   }
    // });
  };
  //TODO: Add loading for address box
  render() {
    const {
      eventname,
      image,
      description,
      type,
      time,
      sexes,
      desires,
      maxDistance,
      address,
      lat,
      long
    } = this.state;
    return (
      <Mutation
        mutation={CREATE_EVENT}
        variables={{
          eventname,
          image,
          description,
          type,
          time,
          sexes,
          desires,
          maxDistance,
          address,
          lat,
          long,
          eventID: null
        }}
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
                <input
                  type="text"
                  name="time"
                  placeholder="Date"
                  onChange={this.handleChange}
                  value={time}
                />
                <AddressSearch
                  onSelect={this.handleSelect}
                  value={address}
                  onChange={address => {
                    this.setState({ address });
                  }}
                />
                <input
                  type="text"
                  name="image"
                  placeholder="Image"
                  onChange={this.handleChange}
                  value={image}
                />
                <textarea
                  type="text"
                  name="description"
                  placeholder="Description"
                  onChange={this.handleChange}
                  value={description}
                />
                <DesireSearch
                  desires={desires}
                  onClick={this.handleClickDesire}
                />
                {/* <input
                  type="text"
                  name="sexes"
                  placeholder="Sexes"
                  onChange={this.handleChange}
                  value={sexes}
                /> */}
                <select name="type" onChange={this.handleChange} value={type}>
                  <option value="Public">Public</option>
                  <option value="Request">Request</option>
                  <option value="Private">Private</option>
                </select>
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
