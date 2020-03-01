import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { withTranslation } from "react-i18next";
import { Query, Mutation, withApollo } from "react-apollo";
import { toast } from "react-toastify";
import { GET_PROFILE, LIKE_PROFILE } from "../../queries";
import Spinner from "../common/Spinner";
import KinksSection from "./KinksSection";
import ProfileCard from "./ProfileCard/";
import ProfileInfo from "./ProfileInfo";
import ProfileBio from "./ProfileBio";
import KinksMobile from "./KinksMobile";
import ProfileDetails from "./ProfileDetails";
import PhotoSlider from "./PhotoSlider";
import BlockModal from "../Modals/Block";
import ShareModal from "../Modals/Share";
import Modal from "../common/Modal";
import { flagOptions } from "../../docs/options";
import "./profile.css";
class ProfilePage extends Component {
  state = {
    shareModalVisible: false,
    blockModalVisible: false,
    profile: null,
    matched: false,
    matchDlgVisible: false,
    chatID: null
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (
      this.state.blockModalVisible !== nextState.blockModalVisible ||
      this.state.chatID !== nextState.chatID ||
      this.state.matchDlgVisible !== nextState.matchDlgVisible ||
      this.state.profile !== nextState.profile ||
      this.state.matched !== nextState.matched ||
      this.state.shareModalVisible !== nextState.shareModalVisible ||
      this.props.t !== nextProps.t ||
      this.props.tReady !== nextProps.tReady
    ) {
      return true;
    }
    return false;
  }

  componentDidMount() {
    this.mounted = true;
    window.scrollTo(0, 1);
  }
  componentWillUnmount() {
    this.mounted = false;
  }

  setMatchDlgVisible = (matchDlgVisible, profile, chatID) => {
    this.props.ErrorHandler.setBreadcrumb("Match Dialog Toggled:");
    if (this.mounted) {
      if (profile)
        this.setState({ profile, matchDlgVisible, chatID, matched: true });
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

  setShareModalVisible = (shareModalVisible, profile) => {
    this.props.ErrorHandler.setBreadcrumb(
      "Share Modal Opened:" + shareModalVisible
    );
    if (shareModalVisible) {
      this.props.ReactGA.event({
        category: "Profile",
        action: "Share Modal"
      });
    }
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

  goToMembers = () => {
    this.props.history.push("/members");
  };

  handleLike = (profile, likeProfile) => {
    const { ErrorHandler, t, ReactGA } = this.props;
    ErrorHandler.setBreadcrumb("Like Profile:" + likeProfile);

    likeProfile()
      .then(({ data }) => {
        switch (data.likeProfile) {
          case "like":
            toast.success(t("common:Liked") + " " + profile.profileName + "!", {
              autoClose: 1500,
              hideProgressBar: true
            });
            ReactGA.event({
              category: "Profile",
              action: "Like"
            });
            break;
          case "unlike":
            toast.success(
              t("common:UnLiked") + " " + profile.profileName + "!",
              {
                autoClose: 1500,
                hideProgressBar: true
              }
            );
            ReactGA.event({
              category: "Profile",
              action: "UnLike"
            });
            break;
          default:
            this.setMatchDlgVisible(true, profile, data.likeProfile);
            ReactGA.event({
              category: "Profile",
              action: "Match"
            });
            break;
        }
        //  refetch();
      })
      .catch(res => {
        ErrorHandler.catchErrors(res);
      });
  };

  setMsgSent = () => {
    this.setState({ matched: true });
  };
  render() {
    const { id } = this.props.match.params;
    const {
      blockModalVisible,
      shareModalVisible,
      matchDlgVisible,
      chatID,
      matched
    } = this.state;
    const { t, ErrorHandler, session, ReactGA, tReady, dayjs } = this.props;

    if (!tReady) {
      return <Spinner />;
    }
    ErrorHandler.setBreadcrumb("Open Profile:" + id);

    return (
      <Mutation
        mutation={LIKE_PROFILE}
        variables={{
          toProfileID: id
        }}
      >
        {(likeProfile, { loading }) => {
          return (
            <Query
              query={GET_PROFILE}
              variables={{ id, isMobile: sessionStorage.getItem("isMobile") }}
              returnPartialData={true}
              fetchPolicy="cache-and-network"
            >
              {({ data, loading, error, refetch }) => {
                if (error) {
                  document.title = t(
                    "common:Error Occurred. Please contact support at support@foxtailapp.com"
                  );
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
                  document.title = t("common:Loading") + "...";
                  return <Spinner message={t("common:Loading")} size="large" />;
                } else if (
                  !data ||
                  !data.profile ||
                  data.profile.users.length === 0
                ) {
                  return (
                    <section className="not-found">
                      <div className="container">
                        <div className="col-md-12">
                          <div className="icon">
                            <i className="nico x" />
                          </div>
                          <span className="head">{t("nopro")}</span>
                          <span className="description">{t("notexist")}</span>
                        </div>
                      </div>
                    </section>
                  );
                }
                const profile = data.profile;
                document.title = profile.profileName;

                const {
                  users,
                  publicPhotos,
                  privatePhotos,
                  kinks,
                  about
                } = profile;

                return (
                  <section className="profile">
                    <div className="container">
                      <div className="col-md-12">
                        <div className="row">
                          <div className="col-md-3">
                            <ProfileCard
                              profile={profile}
                              likeProfile={() =>
                                this.handleLike(profile, likeProfile, refetch)
                              }
                              t={t}
                              liked={profile.likedByMe}
                              msgd={profile.msgdByMe || matched}
                              ErrorHandler={ErrorHandler}
                              isSelf={session.currentuser.profileID === id}
                              toast={toast}
                              ReactGA={ReactGA}
                              isBlackMember={
                                this.props.session.currentuser.blackMember
                                  .active
                              }
                              history={this.props.history}
                              likesSent={
                                this.props.session.currentuser.likesSent
                              }
                              msgsSent={this.props.session.currentuser.msgsSent}
                              showShareModal={() =>
                                this.setShareModalVisible(true, profile)
                              }
                              setMsgSent={this.setMsgSent}
                            />
                            <KinksSection
                              kinks={kinks}
                              t={t}
                              ErrorBoundary={ErrorHandler.ErrorBoundary}
                            />
                          </div>
                          <div className="col-md-9">
                            <ProfileInfo
                              profileName={profile.profileName}
                              users={users}
                              online={profile.online && profile.showOnline}
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

                            <KinksMobile
                              kinks={kinks}
                              t={t}
                              ErrorBoundary={ErrorHandler.ErrorBoundary}
                            />
                            {publicPhotos.length > 0 && (
                              <PhotoSlider
                                isPublic={true}
                                photos={publicPhotos}
                                t={t}
                                ErrorHandler={ErrorHandler}
                              />
                            )}
                            {privatePhotos.length > 0 && (
                              <PhotoSlider
                                isPublic={false}
                                photos={privatePhotos}
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
                        goToMain={this.goToMembers}
                        type={flagOptions.Profile}
                        ErrorHandler={ErrorHandler}
                        ReactGA={ReactGA}
                      />
                    )}
                    {profile && shareModalVisible && (
                      <ShareModal
                        userID={session.currentuser.userID}
                        profile={profile}
                        close={() => this.setShareModalVisible(false)}
                        ErrorBoundary={ErrorHandler.ErrorBoundary}
                        t={t}
                      />
                    )}

                    {profile && chatID && matchDlgVisible && (
                      <Modal
                        header={t("common:match")}
                        close={() => this.setMatchDlgVisible(false)}
                        okSpan={
                          <span
                            className="color"
                            onClick={() =>
                              this.props.history.push({
                                pathname: "/inbox",
                                state: { chatID }
                              })
                            }
                          >
                            {t("common:chatnow")}
                          </span>
                        }
                        cancelSpan={
                          <span
                            className="border"
                            onClick={async () => this.setMatchDlgVisible(false)}
                          >
                            {t("common:chatltr")}
                          </span>
                        }
                      >
                        <span
                          className="description"
                          style={{ fontSize: "20px", paddingBottom: "35px" }}
                        >
                          {t("common:youand") +
                            " " +
                            profile.profileName +
                            " " +
                            t("common:likeach")}
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

export default withRouter(withApollo(withTranslation("profile")(ProfilePage)));
