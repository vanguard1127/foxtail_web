import React, { Component, Fragment } from "react";
import { Mutation, Query } from "react-apollo";
import {
  GET_NEWSEARCH,
  GET_SETTINGS,
  REMOVE_LOCLOCK,
  SEARCH_PROFILES,
  LIKE_PROFILE
} from "../../queries";
import Waypoint from "react-waypoint";
import Dropdown from "../common/Dropdown";
import AddressSearch from "../common/AddressSearch";
import SetLocationModal from "../Modals/SetLocation";
import Spinner from "../common/Spinner";
import EmptyScreen from "../common/EmptyScreen";
import ProfilesContainer from "./ProfilesContainer";
import DirectMsgModal from "../Modals/DirectMsg";
import { withNamespaces } from "react-i18next";
import withLocation from "../withLocation";
import withAuth from "../withAuth";
import { withRouter } from "react-router-dom";
import DistanceSlider from "../common/DistanceSlider";
import AgeRange from "../common/AgeRange";

const CURRENT_LOC_LABEL = "My Location";

const LIMIT = 20;
class SearchCriteria extends Component {
  state = {
    skip: 0,
    loading: false,
    lat: this.props.location.lat,
    long: this.props.location.long,
    locModalVisible: false,
    location: null,
    interestedIn: null,
    distance: null,
    distanceMetric: null,
    ageRange: null,
    msgModalVisible: false,
    profile: null
  };

  setLocModalVisible = visible => {
    this.setState({ locModalVisible: visible });
  };

  setMsgModalVisible = (msgModalVisible, profile) => {
    if (profile) this.setState({ profile, msgModalVisible });
    else this.setState({ msgModalVisible });
  };

  handleLike = (likeProfile, profile) => {
    this.setState({ profile }, () => {
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

  //TODO: Refactor to use setValue
  setLocation = async pos => {
    var crd = pos.coords;
    var location = pos.location ? pos.location : CURRENT_LOC_LABEL;

    const { long, lat } = this.state;
    if (long !== crd.longitude && lat !== crd.latitude) {
      this.setState({ long: crd.longitude, lat: crd.latitude, location });
    }
  };

  handleSubmit = newSearch => {
    newSearch()
      .then(({ data }) => {
        console.log("IN", data);
        //TODO: REFRESH LIST HERE
      })
      .catch(res => {
        const errors = res.graphQLErrors.map(error => {
          return error.message;
        });

        //TODO: send errors to analytics from here
        this.setState({ errors });
      });
  };

  handleRemoveLocLock = (e, removeLocation) => {
    e.preventDefault();

    navigator.geolocation.getCurrentPosition(this.setLocation, err => {
      alert(
        this.props.t(
          "Please enable location services to remove your set location."
        )
      );
      return;
    });

    removeLocation()
      .then(async ({ data }) => {
        this.props.form.setFieldsValue({ location: CURRENT_LOC_LABEL });
      })
      .catch(res => {
        const errors = res.graphQLErrors.map(error => {
          return error.message;
        });

        //TODO: send errors to analytics from here
        this.setState({ errors });
      });
  };

  setLocationValues = ({ lat, long, address, newSearch }) => {
    this.setState({ lat, long, location: address });
    if (lat && long) {
      this.handleSubmit(newSearch);
    }
  };

  setValue = ({ name, value, newSearch }) => {
    this.setState({ [name]: value });
    this.handleSubmit(newSearch);
  };

  // updateAttend = cache => {
  //   const { invitedProfiles } = this.state;
  //   const { targetID } = this.props;

  //   const { event } = cache.readQuery({
  //     query: GET_EVENT,
  //     variables: { id: targetID }
  //   });

  //   cache.writeQuery({
  //     query: GET_EVENT,
  //     variables: { id: targetID },
  //     data: {
  //       event: {
  //         ...event,
  //         participants: event.participants.filter(
  //           member => !invitedProfiles.includes(member.id)
  //         )
  //       }
  //     }
  //   });
  // };

  updateList = (cache, data) => {
    console.log("SDSDSDS", data);
    const { long, lat } = this.state;

    const { searchProfiles } = cache.readQuery({
      query: SEARCH_PROFILES,
      variables: { long, lat, limit: LIMIT }
    });
    //client.queryManager.broadcastQueries()
    //
    cache.writeQuery({
      query: SEARCH_PROFILES,
      variables: { long, lat, limit: LIMIT },
      data: {
        searchProfiles: {
          ...searchProfiles,
          profiles: data.data.newSearch.profiles,
          featuredProfiles: data.data.newSearch.featuredProfiles
        }
      }
    });
    this.setState({ skip: LIMIT });
  };

  render() {
    let {
      lat,
      long,
      location,
      interestedIn,
      distance,
      distanceMetric,
      ageRange,
      locModalVisible,
      msgModalVisible,
      profile
    } = this.state;
    const { t, ErrorBoundary } = this.props;
    const lang = localStorage.getItem("i18nextLng");
    return (
      <div>
        <Query query={GET_SETTINGS} fetchPolicy="network-only">
          {({ data, loading, error }) => {
            if (loading) {
              return (
                <section className="meet-filter">
                  <div className="container">
                    <div className="col-md-12">
                      <div className="row">
                        <div className="col-md-6">
                          <div className="item">
                            <AddressSearch
                              style={{ width: 150 }}
                              setLocationValues={null}
                              address={""}
                              type={"(cities)"}
                              placeholder={t("common:setloc") + "..."}
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="item">
                            <Dropdown
                              type={"interestedIn"}
                              onChange={el => null}
                              value={[]}
                              placeholder={t("common:Interested") + ":"}
                              lang={lang}
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <DistanceSlider value={0} setValue={null} t={t} />
                        </div>
                        <div className="col-md-6">
                          <AgeRange value={[18, 80]} setValue={null} t={t} />
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              );
            }
            if (error) {
              return <div>{error.message}</div>;
            }
            if (!data.getSettings) {
              return <div>{t("Error occured. Please contact support!")}</div>;
            }

            distance = distance !== null ? distance : data.getSettings.distance;
            distanceMetric =
              distanceMetric !== null
                ? distanceMetric
                : data.getSettings.distanceMetric;
            ageRange = ageRange !== null ? ageRange : data.getSettings.ageRange;
            location = location !== null ? location : data.getSettings.location;
            interestedIn =
              interestedIn !== null
                ? interestedIn
                : data.getSettings.interestedIn;

            return (
              <Mutation mutation={REMOVE_LOCLOCK}>
                {(removeLocation, { loading }) => {
                  return (
                    <Mutation
                      mutation={GET_NEWSEARCH}
                      variables={{
                        distance,
                        distanceMetric,
                        ageRange,
                        interestedIn,
                        location,
                        lat,
                        long,
                        limit: LIMIT
                      }}
                      update={this.updateList}
                    >
                      {(newSearch, { loading }) => {
                        return (
                          <Fragment>
                            <section className="meet-filter">
                              <div className="container">
                                <div className="col-md-12">
                                  <div className="row">
                                    <div className="col-md-6">
                                      <div className="item">
                                        <AddressSearch
                                          style={{ width: 150 }}
                                          setLocationValues={({
                                            lat,
                                            long,
                                            address
                                          }) =>
                                            this.setLocationValues({
                                              lat,
                                              long,
                                              address,
                                              newSearch
                                            })
                                          }
                                          address={location}
                                          type={"(cities)"}
                                          placeholder={
                                            t("common:setloc") + "..."
                                          }
                                        />
                                      </div>
                                    </div>
                                    <div className="col-md-6">
                                      <div className="item">
                                        <Dropdown
                                          type={"interestedIn"}
                                          onChange={el =>
                                            this.setValue({
                                              name: "interestedIn",
                                              value: el.map(e => e.value),
                                              newSearch
                                            })
                                          }
                                          value={interestedIn}
                                          placeholder={
                                            t("common:Interested") + ":"
                                          }
                                          lang={lang}
                                        />
                                      </div>
                                    </div>
                                    <div className="col-md-6">
                                      <DistanceSlider
                                        value={distance}
                                        setValue={el =>
                                          this.setValue({
                                            name: "distance",
                                            value: el,
                                            newSearch
                                          })
                                        }
                                        t={t}
                                        metric={distanceMetric}
                                      />
                                    </div>
                                    <div className="col-md-6">
                                      <AgeRange
                                        value={ageRange}
                                        setValue={el =>
                                          this.setValue({
                                            name: "ageRange",
                                            value: el,
                                            newSearch
                                          })
                                        }
                                        t={t}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </section>
                            <Query
                              query={SEARCH_PROFILES}
                              variables={{ long, lat, limit: LIMIT }}
                              fetchPolicy="cache-first"
                            >
                              {({
                                data,
                                loading,
                                fetchMore,
                                error,
                                refetch
                              }) => {
                                console.log("CALLED SEARCH", long, lat);
                                if (error) {
                                  if (error.message.indexOf("invisible") > -1) {
                                    return <div>{t("novis")}</div>;
                                  }
                                }
                                if (loading) {
                                  return (
                                    <Spinner
                                      page="searchProfiles"
                                      title={t("allmems")}
                                    />
                                  );
                                } else if (
                                  data === undefined ||
                                  data.searchProfiles === null
                                ) {
                                  return <EmptyScreen message={t("nomems")} />;
                                } else if (
                                  (data &&
                                    data.searchProfiles.profiles.length === 0 &&
                                    data.searchProfiles.featuredProfiles
                                      .length === 0) ||
                                  !data
                                ) {
                                  console.log(data);
                                  return <EmptyScreen message={t("nomems")} />;
                                }

                                return (
                                  <Mutation
                                    mutation={LIKE_PROFILE}
                                    variables={{
                                      toProfileID: profile && profile.id
                                    }}
                                  >
                                    {(likeProfile, { loading }) => {
                                      return (
                                        <ProfilesContainer
                                          profiles={data.searchProfiles}
                                          ErrorBoundary={ErrorBoundary}
                                          t={t}
                                          setMsgModalVisible={
                                            this.setMsgModalVisible
                                          }
                                          setBlockModalVisible={
                                            this.setBlockModalVisible
                                          }
                                          setShareModalVisible={
                                            this.setShareModalVisible
                                          }
                                          handleLike={profile =>
                                            this.handleLike(
                                              likeProfile,
                                              profile
                                            )
                                          }
                                          history={this.props.history}
                                          handleEnd={({ previousPosition }) =>
                                            this.handleEnd({
                                              previousPosition,
                                              fetchMore
                                            })
                                          }
                                        />
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
                                ErrorBoundary={ErrorBoundary}
                              />
                            )}
                          </Fragment>
                        );
                      }}
                    </Mutation>
                  );
                }}
              </Mutation>
            );
          }}
        </Query>
        {locModalVisible && (
          <SetLocationModal
            close={() => this.setLocModalVisible(false)}
            setLocation={this.setLocation}
            isBlackMember={this.props.session.currentuser.blackMember.active}
          />
        )}
      </div>
    );
  }
}

export default withAuth(session => session && session.currentuser)(
  withRouter(withLocation(withNamespaces("searchprofiles")(SearchCriteria)))
);
