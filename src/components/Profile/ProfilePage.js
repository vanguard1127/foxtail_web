import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Query, Mutation } from "react-apollo";
import { GET_PROFILE, LIKE_PROFILE } from "../../queries";
import Spinner from "../common/Spinner";
import withAuth from "../withAuth";
import { s3url } from "../../docs/data";
import DesiresSection from "./DesiresSection";
import ProfileCard from "./ProfileCard";
import ProfileInfo from "./ProfileInfo";
import ProfileBio from "./ProfileBio";
import DesiresMobile from "./DesiresMobile";
import ProfileDetails from "./ProfileDetails";
import PhotoSlider from "./PhotoSlider";
import BlockModal from "../common/BlockModal";
import ShareModal from "../common/ShareModal";
import DirectMsgModal from "../common/DirectMsgModal";

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
  render() {
    const { id } = this.props.match.params;
    const {
      blockModalVisible,
      shareModalVisible,
      msgModalVisible
    } = this.state;
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
                  return <Spinner message="Loading..." size="large" />;
                } else if (!data || !data.profile) {
                  return (
                    <div>
                      This profile either never existed or it no longer does.
                    </div>
                  );
                }
                const profile = data.profile;

                const { users, photos, desires, about } = profile;

                const publicPics = photos.filter(
                  photoObject => photoObject.url !== ""
                );
                const privatePics = photos.filter(
                  photoObject => photoObject.url === ""
                );
                return (
                  <section className="profile">
                    <div className="container">
                      <div className="col-md-12">
                        <div className="row">
                          <div className="col-md-3">
                            <ProfileCard
                              profile={profile}
                              setProfile={this.setProfile}
                              showMsgModal={() => this.setMsgModalVisible(true)}
                              likeProfile={() => this.handleLike(likeProfile)}
                            />
                            <DesiresSection desires={desires} />
                          </div>
                          <div className="col-md-9">
                            <ProfileInfo
                              users={users}
                              updatedAt={profile.updatedAt}
                            />
                            <ProfileDetails
                              users={users}
                              profile={profile}
                              showBlockModal={() =>
                                this.setBlockModalVisible(true, profile)
                              }
                              showShareModal={() =>
                                this.setShareModalVisible(true, profile)
                              }
                            />
                            <ProfileBio about={about} />
                            <DesiresMobile desires={desires} />
                            <PhotoSlider isPublic={true} photos={publicPics} />
                            <PhotoSlider
                              isPublic={false}
                              photos={privatePics}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
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
                        close={() => this.setMsgModalVisible(false)}
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
  withRouter(ProfilePage)
);
