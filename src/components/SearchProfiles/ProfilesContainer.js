import React, { PureComponent } from "react";
import { SEARCH_PROFILES, LIKE_PROFILE } from "../../queries";
import EmptyScreen from "../common/EmptyScreen";
import { Query, Mutation } from "react-apollo";
import ProfilesDiv from "./ProfilesDiv";
import { Waypoint } from "react-waypoint";
import FeaturedDiv from "./FeaturedDiv";
import DirectMsgModal from "../Modals/DirectMsg";
import Modal from "../common/Modal";
import Spinner from "../common/Spinner";
import { toast } from "react-toastify";

const LIMIT = 20;

class ProfilesContainer extends PureComponent {
  state = {
    skip: 0,
    loading: false,
    msgModalVisible: false,
    profile: null,
    matchDlgVisible: false,
    chatID: null
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
    if (this.mounted) {
      if (profile) this.setState({ profile, msgModalVisible });
      else this.setState({ msgModalVisible });
    }
  };

  handleLike = (likeProfile, profile) => {
    this.props.ErrorHandler.setBreadcrumb("Liked:" + likeProfile);

    if (this.mounted) {
      this.setState({ profile }, () => {
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
    console.log(long, lat, distance, ageRange, interestedIn, skip);
    if (this.mounted) {
      this.setState({ loading: true }, () =>
        fetchMore({
          variables: {
            long,
            lat,
            distance,
            ageRange,
            interestedIn,
            skip,
            limit: LIMIT
          },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            console.log(fetchMoreResult, previousResult);
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
    if (this.mounted) {
      this.setState({
        loading: false
      });
    }
  };

  handleEnd = ({ previousPosition, fetchMore }) => {
    if (previousPosition === Waypoint.below) {
      if (this.mounted) {
        this.setState(
          state => ({ skip: this.state.skip + LIMIT }),
          () => this.fetchData(fetchMore)
        );
      }
    }
  };

  render() {
    if (this.props.loading) {
      return <Spinner page="searchProfiles" title={this.props.t("allmems")} />;
    }
    const {
      ErrorHandler,
      t,
      history,
      long,
      lat,
      distance,
      ageRange,
      interestedIn,
      dayjs
    } = this.props;

    const {
      profile,
      msgModalVisible,
      skip,
      matchDlgVisible,
      chatID,
      loading
    } = this.state;
    if (loading) {
      return <Spinner page="searchProfiles" title={t("allmems")} />;
    }

    return (
      <Query
        query={SEARCH_PROFILES}
        variables={{
          long,
          lat,
          distance,
          ageRange,
          interestedIn,
          limit: LIMIT,
          skip
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
                      <FeaturedDiv
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
                      />
                    )}
                    {result.profiles.length !== 0 && (
                      <ProfilesDiv
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
                      />
                    )}

                    <div className="col-md-12">
                      <div className="more-content-btn">
                        <span>{t("nopros")}</span>
                      </div>
                    </div>
                    {profile && msgModalVisible && (
                      <DirectMsgModal
                        profile={profile}
                        close={() => this.setMsgModalVisible(false)}
                        ErrorHandler={ErrorHandler}
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
