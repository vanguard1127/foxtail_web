import React, { Component, Fragment } from "react";
import ProfilesDiv from "./ProfilesDiv";
import Waypoint from "react-waypoint";
import { withNamespaces } from "react-i18next";
import { SEARCH_PROFILES, LIKE_PROFILE } from "../../queries";
import EmptyScreen from "../common/EmptyScreen";
import { Query, Mutation, withApollo } from "react-apollo";
import withLocation from "../withLocation";
import withAuth from "../withAuth";
import { withRouter } from "react-router-dom";
import SearchCriteria from "./SearchCriteria";
import ProfilesContainer from "./ProfilesContainer";
import DirectMsgModal from "../Modals/DirectMsg";
import Spinner from "../common/Spinner";

const LIMIT = 20;

class ProfileSearch extends Component {
  state = {
    skip: 0,
    loading: false,
    previewVisible: false,
    previewImage: "",
    lat: this.props.location.lat,
    long: this.props.location.long,
    msgModalVisible: false,
    profile: null
  };

  setMsgModalVisible = (msgModalVisible, profile) => {
    if (profile) this.setState({ profile, msgModalVisible });
    else this.setState({ msgModalVisible });
  };

  handleLike = (likeProfile, profile) => {
    this.setState({ profile }, () => {
      likeProfile()
        .then(({ data }) => {
          if (data.likeProfile) {
            console.log("liked");
            return;
          }
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
            ...previousResult.searchProfiles,
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

  handleEnd = ({ previousPosition, fetchMore }) => {
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

  setLocation = async ({ lat, long }) => {
    await this.setState({ long, lat });
  };

  // removeProfile = id => {
  //   this.setState(prevState => ({
  //     searchProfiles: this.props.searchProfiles.profiles.filter(
  //       el => el.id !== id
  //     )
  //   }));
  // };

  render() {
    const { t, ErrorBoundary } = this.props;
    const { long, lat, profile, msgModalVisible } = this.state;

    return (
      <Fragment>
        <ErrorBoundary>
          <SearchCriteria t={t} ErrorBoundary={ErrorBoundary} />
        </ErrorBoundary>
      </Fragment>
    );
  }
}

export default withApollo(
  withAuth(session => session && session.currentuser)(
    withRouter(withLocation(withNamespaces("searchprofiles")(ProfileSearch)))
  )
);
