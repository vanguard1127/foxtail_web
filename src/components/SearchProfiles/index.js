import React, { Component, Fragment } from "react";
import ProfilesDiv from "./ProfilesDiv";
import Waypoint from "react-waypoint";
import { SEARCH_PROFILES, LIKE_PROFILE } from "../../queries";
import Spinner from "../common/Spinner";
import { Query, Mutation, withApollo } from "react-apollo";
import withLocation from "../withLocation";
import withAuth from "../withAuth";
import { withRouter } from "react-router-dom";
import SearchCriteria from "./SearchCriteria";
import FeaturedDiv from "./FeaturedDiv";
import BlockModal from "../common/BlockModal";
import DirectMsgModal from "../Modals/DirectMsg";

const LIMIT = 20;

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

  setMsgModalVisible = (msgModalVisible, profile) => {
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
    const { client } = this.props;
    const { currentuser } = this.props.session;
    const {
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
          {({ data, loading, fetchMore, error, refetch }) => {
            const searchPanel = (
              <SearchCriteria
                queryParams={{ long, lat, limit: LIMIT }}
                client={client}
                isBlackMember={currentuser.blackMember.active}
                setQueryLoc={this.setLocation}
                refetch={refetch}
              />
            );
            if (loading) {
              return (
                <div>
                  {searchPanel}{" "}
                  <Spinner message="Loading Members..." size="large" />
                </div>
              );
            } else if (
              (data &&
                data.searchProfiles.profiles.length === 0 &&
                data.searchProfiles.featuredProfiles.length === 0) ||
              !data
            ) {
              return <div>{searchPanel} No members near you</div>;
            }
            if (error) {
              if (error.message.indexOf("invisible") > -1) {
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
                      {searchPanel}
                      {data.searchProfiles.featuredProfiles.length !== 0 && (
                        <FeaturedDiv
                          featuredProfiles={
                            data.searchProfiles.featuredProfiles
                          }
                          showMsgModal={profile =>
                            this.setMsgModalVisible(true, profile)
                          }
                          showBlockModal={profile =>
                            this.setBlockModalVisible(true, profile)
                          }
                          showShareModal={profile =>
                            this.setShareModalVisible(true, profile)
                          }
                          likeProfile={profile =>
                            this.handleLike(likeProfile, profile)
                          }
                          history={this.props.history}
                        />
                      )}
                      {data.searchProfiles.profiles.length !== 0 && (
                        <ProfilesDiv
                          profiles={data.searchProfiles.profiles}
                          showMsgModal={profile =>
                            this.setMsgModalVisible(true, profile)
                          }
                          showBlockModal={profile =>
                            this.setBlockModalVisible(true, profile)
                          }
                          showShareModal={profile =>
                            this.setShareModalVisible(true, profile)
                          }
                          likeProfile={profile =>
                            this.handleLike(likeProfile, profile)
                          }
                          history={this.props.history}
                          handleEnd={({ previousPosition }) =>
                            this.handleEnd({
                              previousPosition,
                              fetchMore
                            })
                          }
                        />
                      )}

                      <div className="col-md-12">
                        <div className="more-content-btn">
                          <a href="#">No More Profiles</a>
                        </div>
                      </div>
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
        {profile && msgModalVisible && (
          <DirectMsgModal
            profile={profile}
            close={() => this.setMsgModalVisible(false)}
          />
        )}
      </Fragment>
    );
  }
}

export default withApollo(
  withAuth(session => session && session.currentuser)(
    withRouter(withLocation(ProfileSearch))
  )
);
