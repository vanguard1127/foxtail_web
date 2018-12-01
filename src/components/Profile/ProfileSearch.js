import React, { Component, Fragment } from "react";
import CardsList from "./CardsList";
import { SEARCH_PROFILES } from "../../queries";
import Waypoint from "react-waypoint";
import Spinner from "../common/Spinner";
import { Query } from "react-apollo";
import withLocation from "../withLocation";
import withAuth from "../withAuth";
import { withRouter } from "react-router-dom";
import PhotoModal from "../common/PhotoModal";

const LIMIT = 6;

class ProfileSearch extends Component {
  state = {
    skip: 0,
    loading: false,
    previewVisible: false,
    previewImage: ""
  };

  fetchData = async fetchMore => {
    this.setState({ loading: true });
    fetchMore({
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

  handleEnd = (previousPosition, fetchMore) => {
    if (previousPosition === Waypoint.below) {
      this.setState(
        state => ({ skip: this.state.skip + LIMIT }),
        () => this.fetchData(fetchMore)
      );
    }
  };

  handleCancel = () => {
    this.setState({ previewVisible: false });
  };

  showImageModal = url => {
    this.setState({
      previewImage: url,
      previewVisible: true
    });
  };

  render() {
    const { long, lat } = this.props.location;
    const { previewVisible, previewImage } = this.state;
    return (
      <Fragment>
        <Query
          query={SEARCH_PROFILES}
          variables={{ long, lat, limit: LIMIT }}
          fetchPolicy="cache-first"
        >
          {({ data, loading, error, fetchMore }) => {
            if (loading) {
              return <Spinner message="Loading Members..." size="large" />;
            } else if (data && data.searchProfiles.length === 0) {
              return <div>No members near you</div>;
            }

            return (
              <div>
                <CardsList
                  searchProfiles={data.searchProfiles}
                  showImageModal={this.showImageModal}
                />
                <Waypoint
                  onEnter={({ previousPosition }) =>
                    this.handleEnd(previousPosition, fetchMore)
                  }
                />
              </div>
            );
          }}
        </Query>{" "}
        <PhotoModal
          previewVisible={previewVisible}
          previewImage={previewImage}
          handleCancel={() => this.handleCancel()}
        />
      </Fragment>
    );
  }
}

export default withAuth(session => session && session.currentuser)(
  withRouter(withLocation(ProfileSearch))
);
