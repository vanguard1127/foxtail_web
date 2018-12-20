import React, { Component, Fragment } from "react";
import CardsList from "./CardsList";
import { SEARCH_PROFILES } from "../../queries";
import Waypoint from "react-waypoint";
import Spinner from "../common/Spinner";
import { Query, ApolloConsumer } from "react-apollo";
import withLocation from "../withLocation";
import withAuth from "../withAuth";
import { withRouter } from "react-router-dom";
import PhotoModal from "../common/PhotoModal";
import SearchCriteriaPanel from "./SearchCriteriaPanel";

const LIMIT = 6;

class ProfileSearch extends Component {
  state = {
    skip: 0,
    loading: false,
    previewVisible: false,
    previewImage: "",
    lat: this.props.location.lat,
    long: this.props.location.long
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
          searchProfiles: {
            profiles: [
              ...previousResult.searchProfiles.profiles,
              ...fetchMoreResult.searchProfiles.profiles
            ]
          }
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

  setLocation = ({ lat, long }) => {
    this.setState({ long, lat });
  };

  render() {
    const { currentuser } = this.props.session;
    const { previewVisible, previewImage, long, lat } = this.state;

    return (
      <Fragment>
        <Query
          query={SEARCH_PROFILES}
          variables={{ long, lat, limit: LIMIT }}
          fetchPolicy="cache-first"
        >
          {({ data, loading, fetchMore, error }) => {
            const searchPanel = (
              <ApolloConsumer>
                {client => (
                  <SearchCriteriaPanel
                    queryParams={{ long, lat, limit: LIMIT }}
                    client={client}
                    isBlackMember={currentuser.blackMember.active}
                    setQueryLoc={this.setLocation}
                  />
                )}
              </ApolloConsumer>
            );

            if (loading) {
              return <Spinner message="Loading Members..." size="large" />;
            } else if (
              data &&
              data.searchProfiles.profiles.length === 0 &&
              data.searchProfiles.featuredProfiles.length === 0
            ) {
              return <div>{searchPanel} No members near you</div>;
            }
            if (error) {
              if (error.message.indexOf("invisible")) {
                return (
                  <div>
                    You cannot see user profiles while invisible unless you're a
                    Black Member. Please set your profile to visible under
                    settings to see members.
                  </div>
                );
              }
            }

            return (
              <div>
                {searchPanel}
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
