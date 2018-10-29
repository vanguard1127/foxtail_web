import React, { Component } from "react";
import CardsList from "./CardsList";
import { SEARCH_PROFILES } from "../../queries";
import Waypoint from "react-waypoint";
import { graphql } from "react-apollo";

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
      return <div>loading</div>;
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

export default graphql(SEARCH_PROFILES, {
  options(ownProps) {
    return {
      variables: { long: 170.0, lat: -23.0, limit: LIMIT }
    };
  }
})(ProfileSearch);
