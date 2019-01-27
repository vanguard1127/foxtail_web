import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { withNamespaces } from "react-i18next";
import { Query, Mutation } from "react-apollo";
import { GET_PROFILE, LIKE_PROFILE } from "../../queries";
import Spinner from "../common/Spinner";
import withAuth from "../withAuth";
import DesiresSection from "./DesiresSection";
import ProfileCard from "./ProfileCard";
import ProfileInfo from "./ProfileInfo";
import ProfileBio from "./ProfileBio";
import DesiresMobile from "./DesiresMobile";
import ProfileDetails from "./ProfileDetails";
import PhotoSlider from "./PhotoSlider";
import BlockModal from "../Modals/Block";
import ShareModal from "../Modals/Share";
import DirectMsgModal from "../Modals/DirectMsg";

class ProfilePage extends Component {
  state = {
    shareModalVisible: false,
    blockModalVisible: false,
    msgModalVisible: false,
    profile: null
  };

  handleImageClick = event => {
    const { name } = event.target;
    this.setState({ selectedPhoto: parseInt(name, 10) });
  };

  setProfile = profile => {
    this.setState({ profile });
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
        if (data.likeProfile) {
          console.log("Liked");
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
  render() {
    const { id } = this.props.match.params;
    const {
      blockModalVisible,
      shareModalVisible,
      msgModalVisible
    } = this.state;
    const { t, ErrorBoundary } = this.props;
    return (
      <Mutation
        mutation={LIKE_PROFILE}
        variables={{
          toProfileID: id
        }}
      >
        {(likeProfile, { loading }) => {
          return (
            <Query query={GET_PROFILE} variables={{ id }}>
              {({ data, loading, error }) => {
                if (loading) {
                  return (
                    <Spinner
                      message={t("common:Loading") + "..."}
                      size="large"
                    />
                  );
                } else if (!data || !data.profile) {
                  return <div>{t("notexist")}</div>;
                }
                const profile = data.profile;

                const { users, photos, desires, about } = profile;

                const publicPics = photos.filter(
                  photoObject => !photoObject.private && photoObject.url !== ""
                );
                const privatePics = photos
                  .slice(4, 8)
                  .filter(
                    photoObject => photoObject.private && photoObject.url !== ""
                  );
                return (
                  <section className="profile">
                    <div className="container">
                      <div className="col-md-12">
                        <div className="row">
                          <div className="col-md-3">
                            <ErrorBoundary>
                              <ProfileCard
                                profile={profile}
                                setProfile={this.setProfile}
                                showMsgModal={() =>
                                  this.setMsgModalVisible(true)
                                }
                                likeProfile={() => this.handleLike(likeProfile)}
                                t={t}
                              />
                              <DesiresSection desires={desires} t={t} />
                            </ErrorBoundary>
                          </div>
                          <div className="col-md-9">
                            <ErrorBoundary>
                              <ProfileInfo
                                users={users}
                                online={profile.online}
                                t={t}
                              />
                            </ErrorBoundary>
                            <ErrorBoundary>
                              <ProfileDetails
                                users={users}
                                profile={profile}
                                showBlockModal={() =>
                                  this.setBlockModalVisible(true, profile)
                                }
                                showShareModal={() =>
                                  this.setShareModalVisible(true, profile)
                                }
                                t={t}
                              />
                              <ProfileBio about={about} t={t} />
                            </ErrorBoundary>

                            <ErrorBoundary>
                              <DesiresMobile desires={desires} t={t} />
                            </ErrorBoundary>
                            {publicPics.length > 0 && (
                              <ErrorBoundary>
                                <PhotoSlider
                                  isPublic={true}
                                  photos={publicPics}
                                  t={t}
                                />
                              </ErrorBoundary>
                            )}
                            {privatePics.length > 0 && (
                              <ErrorBoundary>
                                <PhotoSlider
                                  isPublic={false}
                                  photos={privatePics}
                                  t={t}
                                />
                              </ErrorBoundary>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    {profile && blockModalVisible && (
                      <BlockModal
                        id={profile.id}
                        profile={profile}
                        close={() => this.setBlockModalVisible(false)}
                        goToMain={() => this.props.history.push("/members")}
                        type={"Profile"}
                        ErrorBoundary={ErrorBoundary}
                      />
                    )}
                    {profile && shareModalVisible && (
                      <ShareModal
                        profile={profile}
                        close={() => this.setShareModalVisible(false)}
                        ErrorBoundary={ErrorBoundary}
                      />
                    )}
                    {profile && msgModalVisible && (
                      <DirectMsgModal
                        profile={profile}
                        close={() => this.setMsgModalVisible(false)}
                        ErrorBoundary={ErrorBoundary}
                      />
                    )}
                  </section>
                );
              }}
            </Query>
          );
        }}
      </Mutation>
    );
  }
}

export default withAuth(session => session && session.currentuser)(
  withRouter(withNamespaces("profile")(ProfilePage))
);
