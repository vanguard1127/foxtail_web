import React, { Component, Fragment } from "react";
import ProfilesDiv from "./ProfilesDiv";
import Waypoint from "react-waypoint";
import { withNamespaces } from "react-i18next";
import { SEARCH_PROFILES, LIKE_PROFILE } from "../../queries";
import { ProfileLoader } from "../common/Skeletons";
import { Query, Mutation, withApollo } from "react-apollo";
import withLocation from "../withLocation";
import withAuth from "../withAuth";
import { withRouter } from "react-router-dom";
import SearchCriteria from "./SearchCriteria";
import FeaturedDiv from "./FeaturedDiv";
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
    msgModalVisible: false,
    profile: null
  };

  setMsgModalVisible = (msgModalVisible, profile) => {
    if (profile) this.setState({ profile, msgModalVisible });
    else this.setState({ msgModalVisible });
  };

  handleLike = likeProfile => {
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
    const { client, t } = this.props;
    const { currentuser } = this.props.session;
    const { long, lat, profile, msgModalVisible } = this.state;
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
                t={t}
              />
            );
            if (loading) {
              return (
                <div>
                  {searchPanel}{" "}
                  <section className="members">
                    <div className="container">
                      <div className="col-md-12">
                        <div className="row">
                          <div className="col-md-12">
                            <span className="head">{t("allmems")}</span>
                          </div>
                          <div className="col-md-6 col-lg-4">
                            <div className={"card-item "}>
                              <ProfileLoader />
                            </div>
                          </div>{" "}
                          <div className="col-md-6 col-lg-4">
                            <div className={"card-item "}>
                              <ProfileLoader />
                            </div>
                          </div>{" "}
                          <div className="col-md-6 col-lg-4">
                            <div className={"card-item "}>
                              <ProfileLoader />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
              );
            } else if (
              (data &&
                data.searchProfiles.profiles.length === 0 &&
                data.searchProfiles.featuredProfiles.length === 0) ||
              !data
            ) {
              return (
                <div>
                  {searchPanel} {t("nomems")}
                </div>
              );
            }
            if (error) {
              if (error.message.indexOf("invisible") > -1) {
                return <div>{t("novis")}</div>;
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
                          t={t}
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
                          t={t}
                        />
                      )}

                      <div className="col-md-12">
                        <div className="more-content-btn">
                          <span>{t("nopros")}</span>
                        </div>
                      </div>
                    </div>
                  );
                }}
              </Mutation>
            );
          }}
        </Query>
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
    withRouter(withLocation(withNamespaces("searchprofiles")(ProfileSearch)))
  )
);
