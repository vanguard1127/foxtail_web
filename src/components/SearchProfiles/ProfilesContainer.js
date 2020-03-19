import React, { Component } from "react";
import ScrollUpButton from "react-scroll-up-button";
import { SEARCH_PROFILES, LIKE_PROFILE } from "../../queries";
import { Query, Mutation } from "react-apollo";
import MemberProfiles from "./MemberProfiles/";
import { Waypoint } from "react-waypoint";
import FeaturedProfiles from "./FeaturedProfiles/";
import DirectMsgModal from "../Modals/DirectMsg";
import BlockModal from "../Modals/Block";
import Modal from "../common/Modal";
import Spinner from "../common/Spinner";
import DailyLimitModal from "../Modals/DailyLimit";
import { toast } from "react-toastify";
import arraysEqual from "../../utils/arraysEqual";

class ProfilesContainer extends Component {
  state = {
    skip: 0,
    loading: false,
    msgModalVisible: false,
    profile: null,
    matchDlgVisible: false,
    maxLikeDlgVisible: false,
    blockDlgVisible: false,
    chatID: null,
    likedProfiles: [],
    msgdProfiles: [],
    hasMore: true
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (
      this.props.long !== nextProps.long ||
      this.props.lat !== nextProps.lat ||
      this.props.distance !== nextProps.distance ||
      this.props.ageRange !== nextProps.ageRange ||
      this.props.interestedIn !== nextProps.interestedIn ||
      this.props.distanceMetric !== nextProps.distanceMetric ||
      this.props.likesSent !== nextProps.likesSent ||
      this.props.isBlackMember !== nextProps.isBlackMember ||
      this.state.skip !== nextState.skip ||
      this.state.loading !== nextState.loading ||
      this.state.msgModalVisible !== nextState.msgModalVisible ||
      this.state.profile !== nextState.profile ||
      this.state.matchDlgVisible !== nextState.matchDlgVisible ||
      this.state.blockDlgVisible !== nextState.blockDlgVisible ||
      this.state.maxLikeDlgVisible !== nextState.maxLikeDlgVisible ||
      this.state.chatID !== nextState.chatID ||
      this.state.hasMore !== nextState.hasMore ||
      !arraysEqual(this.state.likedProfiles, nextState.likedProfiles) ||
      !arraysEqual(this.state.msgdProfiles, nextState.msgdProfiles) ||
      this.props.t !== nextProps.t
    ) {
      return true;
    }
    return false;
  }

  componentDidMount() {
    this.mounted = true;
    this.isWaiting = false;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  setMaxLikeDlgVisible = () => {
    this.props.ErrorHandler.setBreadcrumb("Max Like Dialog Toggled:");

    if (this.mounted) {
      this.setState({ maxLikeDlgVisible: !this.state.maxLikeDlgVisible });
    }
  };

  toggleBlockModalVisible = (profile = null) => {
    this.props.ErrorHandler.setBreadcrumb("Block Dialog Toggled:");
    if (this.mounted) {
      this.setState({ profile, blockDlgVisible: !this.state.blockDlgVisible });
    }
  };

  setMatchDlgVisible = (matchDlgVisible, profile, chatID) => {
    this.props.ErrorHandler.setBreadcrumb("Match Dialog Toggled:");

    if (this.mounted) {
      if (profile)
        this.setState({
          profile,
          matchDlgVisible,
          chatID,
          likedProfiles: [...this.state.likedProfiles, profile.id]
        });
      else this.setState({ matchDlgVisible });
    }
  };

  setMsgModalVisible = (msgModalVisible, profile) => {
    this.props.ErrorHandler.setBreadcrumb(
      "Message Modal visible:" + msgModalVisible
    );

    if (this.props.msgsSent > 4 && msgModalVisible) {
      if (!toast.isActive("maxmsgs")) {
        toast.info(
          this.props.t(
            "common:Daily Direct Message Limit Reached. *Only 5 allowed daily."
          ),
          {
            position: toast.POSITION.TOP_CENTER,
            toastId: "maxmsgs"
          }
        );
      }
      return;
    }

    if (!this.props.isBlackMember) {
      if (!toast.isActive("directerr")) {
        toast.info(
          <div
            onClick={() =>
              this.props.history.push({
                state: { showBlkMdl: true },
                pathname: "/settings"
              })
            }
          >
            {this.props.t("common:directerr")}
          </div>,
          {
            position: toast.POSITION.TOP_CENTER,
            toastId: "directerr"
          }
        );
      }
      return;
    }
    if (this.mounted) {
      if (profile) this.setState({ profile, msgModalVisible });
      else this.setState({ msgModalVisible });
    }
  };

  handleLike = (likeProfile, profile, featured) => {
    if (this.isWaiting) {
      return;
    }
    this.isWaiting = true;
    const { ErrorHandler, t, ReactGA, likesSent } = this.props;
    ErrorHandler.setBreadcrumb("Liked:" + likeProfile);

    if (likesSent > 24) {
      this.setMaxLikeDlgVisible();
      return;
    }
    let { likedProfiles } = this.state;
    if (likedProfiles.includes(profile.id)) {
      likedProfiles = likedProfiles.filter(
        likeID => likeID.toString() !== profile.id
      );
    } else {
      likedProfiles = [...this.state.likedProfiles, profile.id];
    }

    if (featured) {
      this.featuredSelected = true;
    } else {
      this.featuredSelected = false;
    }

    if (this.mounted) {
      this.setState({ profile, likedProfiles }, () => {
        likeProfile()
          .then(({ data }) => {
            switch (data.likeProfile) {
              case "like":
                ReactGA.event({
                  category: "Search Profiles",
                  action: "Liked"
                });
                toast.success(
                  t("common:Liked") + " " + profile.profileName + "!",
                  {
                    autoClose: 1500,
                    hideProgressBar: true
                  }
                );
                break;
              case "unlike":
                ReactGA.event({
                  category: "Search Profiles",
                  action: "UnLiked"
                });
                toast.success(
                  t("common:UnLiked") + " " + profile.profileName + "!",
                  {
                    autoClose: 1500,
                    hideProgressBar: true
                  }
                );
                break;
              default:
                ReactGA.event({
                  category: "Search Profiles",
                  action: "Matched"
                });
                this.setMatchDlgVisible(true, profile, data.likeProfile);
                break;
            }
            this.isWaiting = false;
          })
          .catch(res => {
            ErrorHandler.catchErrors(res);
          });
      });
    }
  };

  fetchData = async fetchMore => {
    this.props.ErrorHandler.setBreadcrumb("Fetch more profiles");
    const { long, lat, distance, ageRange, interestedIn } = this.props;
    const { skip, hasMore } = this.state;

    if (this.mounted && hasMore) {
      this.setState({ loading: true }, () =>
        fetchMore({
          variables: {
            long,
            lat,
            distance,
            ageRange,
            interestedIn,
            skip: skip,
            limit: parseInt(process.env.REACT_APP_SEARCHPROS_LIMIT)
          },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            this.setState({
              loading: false
            });

            if (
              !fetchMoreResult ||
              fetchMoreResult.searchProfiles.profiles.length === 0
            ) {
              this.setState({
                hasMore: false
              });
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
        })
      );
    }
  };

  handleEnd = ({ previousPosition, fetchMore }) => {
    if (previousPosition === Waypoint.below) {
      if (this.mounted) {
        this.setState(
          state => ({
            skip:
              this.state.skip + parseInt(process.env.REACT_APP_SEARCHPROS_LIMIT)
          }),
          () => this.fetchData(fetchMore)
        );
      }
    }
  };

  setMessaged = profileID => {
    this.props.ErrorHandler.setBreadcrumb("Messaged:" + profileID);
    if (this.mounted) {
      this.setState({
        msgdProfiles: [...this.state.msgdProfiles, profileID],
        msgModalVisible: false
      });
    }
  };

  render() {
    const {
      ErrorHandler,
      t,
      history,
      long,
      lat,
      distance,
      ageRange,
      interestedIn,
      dayjs,
      distanceMetric,
      toggleShareModal,
      ReactGA
    } = this.props;

    const {
      profile,
      msgModalVisible,
      matchDlgVisible,
      chatID,
      loading,
      likedProfiles,
      msgdProfiles,
      maxLikeDlgVisible,
      blockDlgVisible
    } = this.state;
    if (this.props.loading && loading) {
      return <Spinner page="searchProfiles" title={this.props.t("allmems")} />;
    }
    const searchParams = {
      long,
      lat,
      distance,
      ageRange,
      interestedIn,
      limit: parseInt(process.env.REACT_APP_SEARCHPROS_LIMIT),
      skip: 0,
      isMobile: sessionStorage.getItem("isMobile")
    };
    return (
      <Query
        query={SEARCH_PROFILES}
        variables={searchParams}
        fetchPolicy="cache-first"
      >
        {({ data, loading, fetchMore, error, refetch }) => {
          if (loading) {
            document.title = t("common:Loading") + "...";
            return <Spinner page="searchProfiles" title={t("allmems")} />;
          }

          document.title = t("common:Search Profiles");

          if (error) {
            return (
              <ErrorHandler.report
                error={error}
                calledName={"searchProfiles"}
              />
            );
          }

          if (
            data === undefined ||
            data.searchProfiles === null ||
            (data &&
              data.searchProfiles.profiles.length === 0 &&
              data.searchProfiles.featuredProfiles.length === 0) ||
            !data
          ) {
            if (data.searchProfiles.message === "invisible") {
              return (
                <section className="not-found">
                  <div className="container">
                    <div className="col-md-12">
                      <div className="icon">
                        <i className="nico blackmember" />
                      </div>
                      <span className="head">{t("cantsee")}</span>
                      <span className="description">{t("cantseeinstr")}</span>
                    </div>
                  </div>
                </section>
              );
            }
            return (
              <section className="not-found">
                <div className="container">
                  <div className="col-md-12">
                    <div className="icon">
                      <i className="nico magnifier" />
                    </div>
                    <span className="head">{t("nomems")}</span>
                    <span className="description">{t("nomemsdes")}</span>
                    <span className="description">- {t("and")} -</span>
                    <span
                      className="greenButton"
                      style={{
                        width: "200px",
                        margin: "auto",
                        display: "table"
                      }}
                      onClick={toggleShareModal}
                    >
                      {t("Invite Your Friends")}
                    </span>
                  </div>
                </div>
              </section>
            );
          }

          const result = data.searchProfiles;

          return (
            <Mutation
              mutation={LIKE_PROFILE}
              variables={{
                toProfileID: profile && profile.id
              }}
            >
              {likeProfile => {
                return (
                  <>
                    {result.featuredProfiles.length !== 0 && (
                      <FeaturedProfiles
                        featuredProfiles={result.featuredProfiles}
                        showMsgModal={profile =>
                          this.setMsgModalVisible(true, profile)
                        }
                        likeProfile={profile =>
                          this.handleLike(likeProfile, profile, true)
                        }
                        history={history}
                        t={t}
                        dayjs={dayjs}
                        likedProfiles={likedProfiles}
                        msgdProfiles={msgdProfiles}
                        distanceMetric={distanceMetric}
                        toggleBlockModalVisible={profile =>
                          this.toggleBlockModalVisible(profile)
                        }
                      />
                    )}
                    {result.profiles.length !== 0 && (
                      <MemberProfiles
                        profiles={result.profiles}
                        showMsgModal={profile =>
                          this.setMsgModalVisible(true, profile)
                        }
                        likeProfile={profile =>
                          this.handleLike(likeProfile, profile)
                        }
                        history={history}
                        handleEnd={({ previousPosition }) =>
                          this.handleEnd({
                            previousPosition,
                            fetchMore
                          })
                        }
                        t={t}
                        dayjs={dayjs}
                        distanceMetric={distanceMetric}
                        likedProfiles={likedProfiles}
                        msgdProfiles={msgdProfiles}
                        toggleBlockModalVisible={profile =>
                          this.toggleBlockModalVisible(profile)
                        }
                      />
                    )}

                    <div className="container mobile-margin-clr">
                      <ScrollUpButton />
                      <div className="col-md-12" style={{ flex: 1 }}>
                        <div className="more-content-btn">
                          {this.state.loading ? (
                            <span>{t("common:Loading")}</span>
                          ) : (
                            <span>{t("nopros")}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    {profile && msgModalVisible && (
                      <DirectMsgModal
                        profile={profile}
                        close={() => this.setMsgModalVisible(false)}
                        ErrorHandler={ErrorHandler}
                        setMsgd={this.setMessaged}
                        ReactGA={ReactGA}
                      />
                    )}
                    {profile && blockDlgVisible && (
                      <BlockModal
                        id={profile.id}
                        profile={profile}
                        close={this.toggleBlockModalVisible}
                        ErrorHandler={ErrorHandler}
                        ReactGA={ReactGA}
                        isRemove={true}
                        searchParams={searchParams}
                      />
                    )}
                    {profile && chatID && matchDlgVisible && (
                      <Modal
                        header={t("common:match")}
                        close={() => this.setMatchDlgVisible(false, profile)}
                        okSpan={
                          <span
                            className="color"
                            onClick={async () =>
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
                            onClick={() =>
                              this.setMatchDlgVisible(false, profile)
                            }
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
                    {maxLikeDlgVisible && (
                      <DailyLimitModal
                        close={this.setMaxLikeDlgVisible}
                        t={t}
                        history={this.props.history}
                      />
                    )}
                  </>
                );
              }}
            </Mutation>
          );
        }}
      </Query>
    );
  }
}

export default ProfilesContainer;
