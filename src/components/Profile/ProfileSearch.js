import React, { Component } from "react";
import CardsList from "./CardsList";
import { SEARCH_PROFILES } from "../../queries";
import Waypoint from "react-waypoint";
import { graphql } from "react-apollo";
import Spinner from "../common/Spinner";

const LIMIT = 6;

class ProfileSearch extends Component {
  state = {
    skip: 0,
    loading: false
  };

  fetchData = async () => {
    this.setState({ loading: true });
    this.props.data.fetchMore({
      variables: {
        limit: LIMIT,
        skip: this.state.skip
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        if (!fetchMoreResult) {
          return previousResult;
        }
        return {
          searchProfiles: [
            ...previousResult.searchProfiles,
            ...fetchMoreResult.searchProfiles
          ]
        };
      }
    });
    this.setState({
      loading: false
    });
  };

  handleEnd = () => {
    this.setState(
      state => ({ skip: this.state.skip + LIMIT }),
      () => this.fetchData()
    );
  };

  render() {
    if (this.state.loading) {
      return <Spinner message="Loading Members..." size="large" />;
    } else if (this.props.data.searchProfiles === undefined) {
      return <div>No members near you</div>;
    }

    const data = this.props.data.searchProfiles;

    return (
      <div>
        {/* <select>
          <option>Nearby</option>
        </select> */}
        <CardsList searchProfiles={data} />
        <Waypoint onEnter={this.handleEnd} />
      </div>
    );
  }
}
//TODO:FIX SOMETIMES LAT AND LONG NOT SENDINF
let long;
let lat;
if (!navigator.geolocation) {
  alert("Geolocation is not supported by this browser");
}
navigator.geolocation.getCurrentPosition(
  position => {
    long = position.coords.longitude;
    lat = position.coords.latitude;
  },
  err => {
    alert("Unable to fetch location");
  }
);
export default graphql(SEARCH_PROFILES, {
  options(ownProps) {
    return {
      variables: { long, lat, limit: LIMIT }
    };
  }
})(ProfileSearch);
