import React, { Component } from 'react';
import { SEARCH_PROFILES, LIKE_PROFILE } from '../../queries';
import EmptyScreen from '../common/EmptyScreen';
import { Query, Mutation } from 'react-apollo';
import ProfilesDiv from './ProfilesDiv';
import Waypoint from 'react-waypoint';
import FeaturedDiv from './FeaturedDiv';
import DirectMsgModal from '../Modals/DirectMsg';
import Spinner from '../common/Spinner';

const LIMIT = 20;

class ProfilesContainer extends Component {
  state = {
    skip: 0,
    loading: false,
    lat: this.props.searchCriteria.lat,
    long: this.props.searchCriteria.long,
    distance: this.props.searchCriteria.distance,
    distanceMetric: this.props.searchCriteria.distanceMetric,
    ageRange: this.props.searchCriteria.ageRange,
    interestedIn: this.props.searchCriteria.interestedIn,
    location: this.props.searchCriteria.location,
    msgModalVisible: false,
    profile: null
  };

  setMsgModalVisible = (msgModalVisible, profile) => {
    this.props.ErrorHandler.setBreadcrumb(
      'Message Modal visible:' + msgModalVisible
    );
    if (profile) this.setState({ profile, msgModalVisible });
    else this.setState({ msgModalVisible });
  };

  handleLike = (likeProfile, profile) => {
    this.props.ErrorHandler.setBreadcrumb('Liked:' + likeProfile);
    this.setState({ profile }, () => {
      likeProfile()
        .then(({ data }) => {
          if (data.likeProfile) {
            console.log('liked');
            return;
          }
        })
        .catch(res => {
          this.props.ErrorHandler.catchErrors(res.graphQLErrors);
        });
    });
  };

  fetchData = async fetchMore => {
    this.props.ErrorHandler.setBreadcrumb('Fetch more profiles');
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

  render() {
    const {
      ErrorHandler,
      t,
      history,
      loading,
      searchCriteria: { long, lat, distance, ageRange, interestedIn }
    } = this.props;
    const { profile, msgModalVisible, skip } = this.state;
    if (loading) {
      return <Spinner page="searchProfiles" title={t('allmems')} />;
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
            if (error.message.indexOf('invisible') > -1) {
              return <div>{t('novis')}</div>;
            } else {
              return (
                <ErrorHandler.report
                  error={error}
                  calledName={'searchProfiles'}
                />
              );
            }
          }

          if (loading) {
            return <Spinner page="searchProfiles" title={t('allmems')} />;
          } else if (data === undefined || data.searchProfiles === null) {
            return <EmptyScreen message={t('nomems')} />;
          } else if (
            (data &&
              data.searchProfiles.profiles.length === 0 &&
              data.searchProfiles.featuredProfiles.length === 0) ||
            !data
          ) {
            return <EmptyScreen message={t('nomems')} />;
          }

          const result = data.searchProfiles;
          return (
            <Mutation
              mutation={LIKE_PROFILE}
              variables={{
                toProfileID: profile && profile.id
              }}
            >
              {(likeProfile, { loading }) => {
                return (
                  <div>
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
                      />
                    )}

                    <div className="col-md-12">
                      <div className="more-content-btn">
                        <span>{t('nopros')}</span>
                      </div>
                    </div>
                    {profile && msgModalVisible && (
                      <DirectMsgModal
                        profile={profile}
                        close={() => this.setMsgModalVisible(false)}
                        ErrorBoundary={ErrorHandler.ErrorBoundary}
                      />
                    )}
                  </div>
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