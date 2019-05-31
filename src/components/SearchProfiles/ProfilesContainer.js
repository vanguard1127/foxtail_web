import React, { Component } from "react";
import ScrollUpButton from "react-scroll-up-button";
import { SEARCH_PROFILES, LIKE_PROFILE } from "../../queries";
import { Query, Mutation, withApollo } from "react-apollo";
import MemberProfiles from "./MemberProfiles/";
import { Waypoint } from "react-waypoint";
import FeaturedProfiles from "./FeaturedProfiles/";
import DirectMsgModal from "../Modals/DirectMsg";
import Modal from "../common/Modal";
import Spinner from "../common/Spinner";
import ShareModal from "../Modals/Share";
import { toast } from "react-toastify";
import { SEARCHPROS_LIMIT } from "../../docs/consts";
import deleteFromCache from "../../utils/deleteFromCache";
import arraysEqual from "../../utils/arraysEqual";

class ProfilesContainer extends Component {
  state = {
    skip: 0,
    loading: false,
    msgModalVisible: false,
    profile: null,
    matchDlgVisible: false,
    shareModalVisible: false,
    chatID: null,
    likedProfiles: [],
    msgdProfiles: []
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (
      this.props.long !== nextProps.long ||
      this.props.lat !== nextProps.lat ||
      this.props.distance !== nextProps.distance ||
      this.props.ageRange !== nextProps.ageRange ||
      this.props.interestedIn !== nextProps.interestedIn ||
      this.props.distanceMetric !== nextProps.distanceMetric ||
      this.props.isBlackMember !== nextProps.isBlackMember ||
      this.state.skip !== nextState.skip ||
      this.state.loading !== nextState.loading ||
      this.state.shareModalVisible !== nextState.shareModalVisible ||
      this.state.msgModalVisible !== nextState.msgModalVisible ||
      this.state.profile !== nextState.profile ||
      this.state.matchDlgVisible !== nextState.matchDlgVisible ||
      this.state.chatID !== nextState.chatID ||
      !arraysEqual(this.state.likedProfiles, nextState.likedProfiles) ||
      !arraysEqual(this.state.msgdProfiles, nextState.msgdProfiles)
    ) {
      return true;
    }
    return false;
  }

  componentDidMount() {
    this.mounted = true;
  }
  componentWillUnmount() {
    this.clearSearchResults();
    this.mounted = false;
  }

  clearSearchResults = () => {
    const { cache } = this.props.client;
    deleteFromCache({ cache, entry: "ProfileType" });
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
    if (!this.props.isBlackMember) {
      if (!toast.isActive("directerr")) {
        toast.info(this.props.t("directerr"), {
          position: toast.POSITION.TOP_CENTER,
          toastId: "directerr"
        });
      }
      return;
    }
    if (this.mounted) {
      if (profile) this.setState({ profile, msgModalVisible });
      else this.setState({ msgModalVisible });
    }
  };

  toggleShareModal = () => {
    console.log("DEW");
    this.props.ErrorHandler.setBreadcrumb("Share Modal Toggled:");
    this.setState({ shareModalVisible: !this.state.shareModalVisible });
  };

  handleLike = (likeProfile, profile) => {
    this.props.ErrorHandler.setBreadcrumb("Liked:" + likeProfile);
    let { likedProfiles } = this.state;
    if (likedProfiles.includes(profile.id)) {
      likedProfiles = likedProfiles.filter(
        likeID => likeID.toString() !== profile.id
      );
    } else {
      likedProfiles = [...this.state.likedProfiles, profile.id];
    }

    if (this.mounted) {
      const { ErrorHandler, t } = this.props;
      this.setState({ profile, likedProfiles }, () => {
        likeProfile()
          .then(({ data }) => {
            switch (data.likeProfile) {
              case "like":
                toast.success(
                  t("common:Liked") + " " + profile.profileName + "!"
                );
                break;
              case "unlike":
                toast.success(
                  t("common:UnLiked") + " " + profile.profileName + "!"
                );
                break;
              default:
                this.setMatchDlgVisible(true, profile, data.likeProfile);
                break;
            }
          })
          .catch(res => {
            ErrorHandler.catchErrors(res.graphQLErrors);
          });
      });
    }
  };

  fetchData = async fetchMore => {
    this.props.ErrorHandler.setBreadcrumb("Fetch more profiles");
    const { long, lat, distance, ageRange, interestedIn } = this.props;
    const { skip } = this.state;
    if (this.mounted) {
      this.setState({ loading: true }, () =>
        fetchMore({
          variables: {
            long,
            lat,
            distance,
            ageRange,
            interestedIn,
            skip: skip,
            limit: SEARCHPROS_LIMIT
          },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            this.setState({
              loading: false
            });

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
        })
      );
    }
  };

  handleEnd = ({ previousPosition, fetchMore }) => {
    if (previousPosition === Waypoint.below) {
      if (this.mounted) {
        this.setState(
          state => ({ skip: this.state.skip + SEARCHPROS_LIMIT }),
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
      distanceMetric
    } = this.props;

    const {
      profile,
      msgModalVisible,
      matchDlgVisible,
      chatID,
      loading,
      likedProfiles,
      msgdProfiles,
      shareModalVisible
    } = this.state;
    if (this.props.loading && loading) {
      return <Spinner page="searchProfiles" title={this.props.t("allmems")} />;
    }
    sessionStorage.setItem(
      "searchProsQuery",
      JSON.stringify({
        long,
        lat,
        distance,
        ageRange,
        interestedIn,
        limit: SEARCHPROS_LIMIT,
        skip: 0
      })
    );
    return (
      <Query
        query={SEARCH_PROFILES}
        variables={{
          long,
          lat,
          distance,
          ageRange,
          interestedIn,
          limit: SEARCHPROS_LIMIT,
          skip: 0
        }}
        fetchPolicy="cache-first"
      >
        {({ data, loading, fetchMore, error }) => {
          if (error) {
            if (error.message.indexOf("invisible") > -1) {
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
            } else {
              return (
                <ErrorHandler.report
                  error={error}
                  calledName={"searchProfiles"}
                />
              );
            }
          }

          if (loading) {
            return <Spinner page="searchProfiles" title={t("allmems")} />;
          } else if (
            data === undefined ||
            data.searchProfiles === null ||
            (data &&
              data.searchProfiles.profiles.length === 0 &&
              data.searchProfiles.featuredProfiles.length === 0) ||
            !data
          ) {
            return (
              <section className="not-found">
                <div className="container">
                  <div className="col-md-12">
                    <div className="icon">
                      <i className="nico magnifier" />
                    </div>
                    <span className="head">{t("nomems")}</span>
                    <span className="description">{t("nomemsdes")}</span>
                    <span className="description">- and -</span>
                    <span
                      className="greenButton"
                      style={{
                        width: "200px",
                        margin: "auto",
                        display: "table"
                      }}
                      onClick={() => this.toggleShareModal()}
                    >
                      Invite Your Friends
                    </span>
                  </div>
                </div>
                {shareModalVisible && (
                  <ShareModal
                    visible={shareModalVisible}
                    close={this.toggleShareModal}
                    ErrorBoundary={ErrorHandler.ErrorBoundary}
                  />
                )}
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
                          this.handleLike(likeProfile, profile)
                        }
                        history={history}
                        t={t}
                        dayjs={dayjs}
                        likedProfiles={likedProfiles}
                        msgdProfiles={msgdProfiles}
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
                      />
                    )}

                    <ScrollUpButton />
                    <div className="col-md-12">
                      <div className="more-content-btn">
                        {this.state.loading ? (
                          <span>{t("common:Loading")}</span>
                        ) : (
                          <span>{t("nopros")}</span>
                        )}
                      </div>
                    </div>
                    {profile && msgModalVisible && (
                      <DirectMsgModal
                        profile={profile}
                        close={() => this.setMsgModalVisible(false)}
                        ErrorHandler={ErrorHandler}
                        setMsgd={this.setMessaged}
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
                            onClick={async () =>
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

export default withApollo(ProfilesContainer);
