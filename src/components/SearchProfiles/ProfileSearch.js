import React, { Component, Fragment } from "react";
import ProfilesDiv from "./ProfilesDiv";
import { SEARCH_PROFILES, LIKE_PROFILE } from "../../queries";
import Waypoint from "react-waypoint";
import Spinner from "../common/Spinner";
import { Query, Mutation, ApolloConsumer } from "react-apollo";
import withLocation from "../withLocation";
import withAuth from "../withAuth";
import { withRouter } from "react-router-dom";
import PhotoModal from "../common/PhotoModal";
import SearchCriteria from "./SearchCriteria";
import FeaturedDiv from "./FeaturedDiv";
import BlockModal from "../common/BlockModal";
import ShareModal from "../common/ShareModal";
import DirectMsgModal from "../common/DirectMsgModal";

const LIMIT = 6;

class ProfileSearch extends Component {
  state = {
    skip: 0,
    loading: false,
    previewVisible: false,
    previewImage: "",
    lat: this.props.location.lat,
    long: this.props.location.long,
    shareModalVisible: false,
    blockModalVisible: false,
    msgModalVisible: false,
    profile: null
  };

  setProfile = profile => {
    this.setState({ profile });
  };

  setMsdModalVisible = (msgModalVisible, profile) => {
    if (profile) this.setState({ profile, msgModalVisible });
    else this.setState({ msgModalVisible });
  };

  setShareModalVisible = (shareModalVisible, profile) => {
    if (profile) this.setState({ profile, shareModalVisible });
    else this.setState({ shareModalVisible });
  };

  setBlockModalVisible = (blockModalVisible, profile) => {
    if (profile) this.setState({ profile, blockModalVisible });
    else this.setState({ blockModalVisible });
  };

  handleLike = likeProfile => {
    console.log("eee");
    likeProfile()
      .then(({ data }) => {
        console.log(data);
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

  setLocation = ({ lat, long }) => {
    this.setState({ long, lat });
  };

  // removeProfile = id => {
  //   this.setState(prevState => ({
  //     searchProfiles: this.props.searchProfiles.profiles.filter(
  //       el => el.id !== id
  //     )
  //   }));
  // };

  render() {
    const { currentuser } = this.props.session;
    const {
      previewVisible,
      previewImage,
      long,
      lat,
      profile,
      blockModalVisible,
      shareModalVisible,
      msgModalVisible
    } = this.state;
    const toProfileID = profile && profile.id;
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
                  <SearchCriteria
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
              <Mutation
                mutation={LIKE_PROFILE}
                variables={{
                  toProfileID
                }}
              >
                {(likeProfile, { loading }) => {
                  return (
                    <div>
                      {/* {searchPanel} */}
                      <FeaturedDiv
                        featuredProfiles={data.searchProfiles.featuredProfiles}
                        setProfile={this.setProfile}
                        showMsgModal={() => this.setMsdModalVisible(true)}
                        showBlockModal={() => this.setBlockModalVisible(true)}
                        showShareModal={() => this.setShareModalVisible(true)}
                        likeProfile={() => this.handleLike(likeProfile)}
                      />
                      <ProfilesDiv
                        profiles={data.searchProfiles.profiles}
                        setProfile={this.setProfile}
                        showMsgModal={() => this.setMsdModalVisible(true)}
                        showBlockModal={() => this.setBlockModalVisible(true)}
                        showShareModal={() => this.setShareModalVisible(true)}
                        likeProfile={() => this.handleLike(likeProfile)}
                      />
                      <Waypoint
                        onEnter={({ previousPosition }) =>
                          this.handleEnd(previousPosition, fetchMore)
                        }
                      />
                    </div>
                  );
                }}
              </Mutation>
            );
          }}
        </Query>
        {profile && (
          <BlockModal
            profile={profile}
            id={profile.id}
            visible={blockModalVisible}
            close={() => this.setBlockModalVisible(false)}
            removeProfile={this.removeProfile}
          />
        )}
        {profile && (
          <ShareModal
            profile={profile}
            visible={shareModalVisible}
            close={() => this.setShareModalVisible(false)}
          />
        )}
        {profile && (
          <DirectMsgModal
            profile={profile}
            visible={msgModalVisible}
            close={() => this.setMsdModalVisible(false)}
          />
        )}
      </Fragment>
    );
  }
}

export default withAuth(session => session && session.currentuser)(
  withRouter(withLocation(ProfileSearch))
);
