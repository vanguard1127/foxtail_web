import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { withNamespaces } from "react-i18next";
import { Query, Mutation } from "react-apollo";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import { GET_PROFILE, LIKE_PROFILE } from "../../queries";
import Spinner from "../common/Spinner";
import withAuth from "../HOCs/withAuth";
import DesiresSection from "./DesiresSection";
import ProfileCard from "./ProfileCard/";
import Tour from "./Tour";
import ProfileInfo from "./ProfileInfo";
import ProfileBio from "./ProfileBio";
import DesiresMobile from "./DesiresMobile";
import ProfileDetails from "./ProfileDetails";
import PhotoSlider from "./PhotoSlider";
import BlockModal from "../Modals/Block";
import ShareModal from "../Modals/Share";
import DirectMsgModal from "../Modals/DirectMsg";
import Modal from "../common/Modal";
import { flagOptions } from "../../docs/options";
import validateLang from "../../utils/validateLang";
const lang = validateLang(localStorage.getItem("i18nextLng"));
const locale = lang !== null ? lang : "en";
require("dayjs/locale/" + locale);

class ProfilePage extends Component {
  state = {
    shareModalVisible: false,
    blockModalVisible: false,
    msgModalVisible: false,
    profile: null,
    matchDlgVisible: false,
    chatID: null
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (
      this.state.blockModalVisible !== nextState.blockModalVisible ||
      this.state.chatID !== nextState.chatID ||
      this.state.matchDlgVisible !== nextState.matchDlgVisible ||
      this.state.msgModalVisible !== nextState.msgModalVisible ||
      this.state.profile !== nextState.profile ||
      this.state.shareModalVisible !== nextState.shareModalVisible
    ) {
      return true;
    }
    return false;
  }

  componentDidMount() {
    this.mounted = true;
  }
  componentWillUnmount() {
    this.mounted = false;
  }

  setMatchDlgVisible = (matchDlgVisible, profile, chatID) => {
    this.props.ErrorHandler.setBreadcrumb("Match Dialog Toggled:");
    if (this.mounted) {
      if (profile) this.setState({ profile, matchDlgVisible, chatID });
      else this.setState({ matchDlgVisible });
    }
  };

  handleImageClick = event => {
    this.props.ErrorHandler.setBreadcrumb("Click image in profile");
    const { name } = event.target;
    if (this.mounted) {
      this.setState({ selectedPhoto: parseInt(name, 10) });
    }
  };

  setProfile = profile => {
    if (this.mounted) {
      this.setState({ profile });
    }
  };

  setMsgModalVisible = (msgModalVisible, profile) => {
    this.props.ErrorHandler.setBreadcrumb(
      "Message Modal Opened:" + msgModalVisible
    );
    if (this.mounted) {
      if (profile) {
        this.setState({ profile, msgModalVisible });
      } else {
        this.setState({ msgModalVisible });
      }
    }
  };

  setShareModalVisible = (shareModalVisible, profile) => {
    this.props.ErrorHandler.setBreadcrumb(
      "Share Modal Opened:" + shareModalVisible
    );
    if (this.mounted) {
      if (profile) this.setState({ profile, shareModalVisible });
      else this.setState({ shareModalVisible });
    }
  };

  setBlockModalVisible = (blockModalVisible, profile) => {
    this.props.ErrorHandler.setBreadcrumb(
      "Block Modal Opened:" + blockModalVisible
    );
    if (this.mounted) {
      if (profile) this.setState({ profile, blockModalVisible });
      else this.setState({ blockModalVisible });
    }
  };

  handleLike = (profile, likeProfile, refetch) => {
    this.props.ErrorHandler.setBreadcrumb("Like Profile:" + likeProfile);

    likeProfile()
      .then(({ data }) => {
        switch (data.likeProfile) {
          case "like":
            toast.success("Liked " + profile.profileName + "!");
            break;
          case "unlike":
            toast.success("UnLiked " + profile.profileName + "!");
            break;
          default:
            this.setMatchDlgVisible(true, profile, data.likeProfile);
            break;
        }
        refetch();
      })
      .catch(res => {
        this.props.ErrorHandler.catchErrors(res.graphQLErrors);
      });
  };
  setMessaged = (profileID, refetch) => {
    this.props.ErrorHandler.setBreadcrumb("Messaged:" + profileID);
    if (this.mounted) {
      this.setState({ msgModalVisible: false });
      refetch();
    }
  };
  render() {
    const { id } = this.props.match.params;
    const {
      blockModalVisible,
      shareModalVisible,
      msgModalVisible,
      matchDlgVisible,
      chatID
    } = this.state;
    const { t, ErrorHandler, session } = this.props;
    ErrorHandler.setBreadcrumb("Open Profile:" + id);

    if (id === "tour" && session.currentuser.tours.indexOf("p") < 0) {
      ErrorHandler.setBreadcrumb("Opened Tour: Profile");
      return (
        <div>
          <Tour ErrorHandler={ErrorHandler} refetchUser={this.props.refetch} />
        </div>
      );
    }
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
              {({ data, loading, error, refetch }) => {
                if (error) {
                  document.title = "Error Occurred";
                  return (
                    <ErrorHandler.report
                      error={error}
                      calledName={"getProfile"}
                      userID={session.currentuser.userID}
                      targetID={id}
                      type="profile"
                    />
                  );
                }
                if (loading) {
                  document.title = "Loading...";
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
                document.title = profile.profileName;

                const { users, photos, desires, about } = profile;

                const publicPics = photos.filter(
                  photoObject => !photoObject.private && photoObject.url !== ""
                );
                const privatePics = photos
                  .slice(7, 14)
                  .filter(
                    photoObject => photoObject.private && photoObject.url !== ""
                  );

                return (
                  <section className="profile">
                    <div className="container">
                      <div className="col-md-12">
                        <div className="row">
                          <div className="col-md-3">
                            <ProfileCard
                              profile={profile}
                              showMsgModal={() =>
                                this.setMsgModalVisible(true, profile)
                              }
                              likeProfile={() =>
                                this.handleLike(profile, likeProfile, refetch)
                              }
                              t={t}
                              liked={profile.likedByMe}
                              msgd={profile.msgdByMe}
                              ErrorBoundary={ErrorHandler.ErrorBoundary}
                            />
                            <DesiresSection
                              desires={desires}
                              t={t}
                              ErrorBoundary={ErrorHandler.ErrorBoundary}
                            />
                          </div>
                          <div className="col-md-9">
                            <ProfileInfo
                              users={users}
                              online={profile.online}
                              t={t}
                              dayjs={dayjs}
                              ErrorBoundary={ErrorHandler.ErrorBoundary}
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
                              t={t}
                              ErrorBoundary={ErrorHandler.ErrorBoundary}
                              distanceMetric={
                                session.currentuser.distanceMetric
                              }
                            />
                            <ProfileBio
                              about={about}
                              t={t}
                              ErrorBoundary={ErrorHandler.ErrorBoundary}
                            />

                            <DesiresMobile
                              desires={desires}
                              t={t}
                              ErrorBoundary={ErrorHandler.ErrorBoundary}
                            />
                            {publicPics.length > 0 && (
                              <PhotoSlider
                                isPublic={true}
                                photos={publicPics}
                                t={t}
                                ErrorHandler={ErrorHandler}
                              />
                            )}
                            {privatePics.length > 0 && (
                              <PhotoSlider
                                isPublic={false}
                                photos={privatePics}
                                t={t}
                                ErrorHandler={ErrorHandler}
                              />
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
                        type={flagOptions.Profile}
                        ErrorHandler={ErrorHandler}
                      />
                    )}
                    {profile && shareModalVisible && (
                      <ShareModal
                        profile={profile}
                        close={() => this.setShareModalVisible(false)}
                        ErrorBoundary={ErrorHandler.ErrorBoundary}
                      />
                    )}
                    {profile && msgModalVisible && (
                      <DirectMsgModal
                        profile={profile}
                        close={() => this.setMsgModalVisible(false)}
                        ErrorHandler={ErrorHandler}
                        setMsgd={pid => this.setMessaged(pid, refetch)}
                      />
                    )}
                    {profile && chatID && matchDlgVisible && (
                      <Modal
                        header={"It's a Match!"}
                        close={() => this.setMatchDlgVisible(false)}
                        okSpan={
                          <span
                            className="color"
                            onClick={async () =>
                              this.props.history.push("/inbox/" + chatID)
                            }
                          >
                            Chat Now
                          </span>
                        }
                        cancelSpan={
                          <span
                            className="border"
                            onClick={async () => this.setMatchDlgVisible(false)}
                          >
                            Chat Later
                          </span>
                        }
                      >
                        <span
                          className="description"
                          style={{ fontSize: "20px", paddingBottom: "35px" }}
                        >
                          {"You and " +
                            profile.profileName +
                            " like each other!"}
                        </span>
                      </Modal>
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
