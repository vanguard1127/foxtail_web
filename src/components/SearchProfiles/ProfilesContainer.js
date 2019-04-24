import React, { PureComponent } from "react";
import ScrollUpButton from "react-scroll-up-button";
import { SEARCH_PROFILES, LIKE_PROFILE } from "../../queries";
import EmptyScreen from "../common/EmptyScreen";
import { Query, Mutation } from "react-apollo";
import MemberProfiles from "./MemberProfiles/";
import { Waypoint } from "react-waypoint";
import FeaturedProfiles from "./FeaturedProfiles/";
import DirectMsgModal from "../Modals/DirectMsg";
import Modal from "../common/Modal";
import Spinner from "../common/Spinner";
import { toast } from "react-toastify";
import { SEARCHPROS_LIMIT } from "../../docs/consts";

class ProfilesContainer extends PureComponent {
  state = {
    skip: 0,
    loading: false,
    msgModalVisible: false,
    profile: null,
    matchDlgVisible: false,
    chatID: null,
    likedProfiles: [],
    msgdProfiles: []
  };

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

  setMsgModalVisible = (msgModalVisible, profile) => {
    this.props.ErrorHandler.setBreadcrumb(
      "Message Modal visible:" + msgModalVisible
    );
    if (!this.props.isBlackMember) {
      toast("Direct Send is only available to Black Members");
      return;
    }
    if (this.mounted) {
      if (profile) this.setState({ profile, msgModalVisible });
      else this.setState({ msgModalVisible });
    }
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
      this.setState({ profile, likedProfiles }, () => {
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
          })
          .catch(res => {
            this.props.ErrorHandler.catchErrors(res.graphQLErrors);
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
      msgdProfiles
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
              return <div>{t("novis")}</div>;
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
          } else if (data === undefined || data.searchProfiles === null) {
            return <EmptyScreen message={t("nomems")} />;
          } else if (
            (data &&
              data.searchProfiles.profiles.length === 0 &&
              data.searchProfiles.featuredProfiles.length === 0) ||
            !data
          ) {
            return <EmptyScreen message={t("nomems")} />;
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
                          <span>Loading...</span>
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
