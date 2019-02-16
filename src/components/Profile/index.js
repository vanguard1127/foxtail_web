import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { withNamespaces } from 'react-i18next';
import { Query, Mutation } from 'react-apollo';
import { GET_PROFILE, LIKE_PROFILE } from '../../queries';
import Spinner from '../common/Spinner';
import withAuth from '../withAuth';
import DesiresSection from './DesiresSection';
import ProfileCard from './ProfileCard';
import Tour from './Tour';
import ProfileInfo from './ProfileInfo';
import ProfileBio from './ProfileBio';
import DesiresMobile from './DesiresMobile';
import ProfileDetails from './ProfileDetails';
import PhotoSlider from './PhotoSlider';
import BlockModal from '../Modals/Block';
import ShareModal from '../Modals/Share';
import DirectMsgModal from '../Modals/DirectMsg';
import { flagOptions } from '../../docs/options';

class ProfilePage extends Component {
  state = {
    shareModalVisible: false,
    blockModalVisible: false,
    msgModalVisible: false,
    profile: null
  };

  handleImageClick = event => {
    this.props.ErrorHandler.setBreadcrumb('Click image in profile');
    const { name } = event.target;
    this.setState({ selectedPhoto: parseInt(name, 10) });
  };

  setProfile = profile => {
    this.setState({ profile });
  };

  setMsgModalVisible = (msgModalVisible, profile) => {
    this.props.ErrorHandler.setBreadcrumb(
      'Message Modal Opened:' + msgModalVisible
    );
    if (profile) this.setState({ profile, msgModalVisible });
    else this.setState({ msgModalVisible });
  };

  setShareModalVisible = (shareModalVisible, profile) => {
    this.props.ErrorHandler.setBreadcrumb(
      'Share Modal Opened:' + shareModalVisible
    );
    if (profile) this.setState({ profile, shareModalVisible });
    else this.setState({ shareModalVisible });
  };

  setBlockModalVisible = (blockModalVisible, profile) => {
    this.props.ErrorHandler.setBreadcrumb(
      'Block Modal Opened:' + blockModalVisible
    );
    if (profile) this.setState({ profile, blockModalVisible });
    else this.setState({ blockModalVisible });
  };

  handleLike = likeProfile => {
    this.props.ErrorHandler.setBreadcrumb('Like Profile:' + likeProfile);
    likeProfile()
      .then(({ data }) => {
        if (data.likeProfile) {
          console.log('Liked');
          return;
        }
      })
      .catch(res => {
        this.props.ErrorHandler.catchErrors(res.graphQLErrors);
      });
  };
  render() {
    const { id } = this.props.match.params;
    const {
      blockModalVisible,
      shareModalVisible,
      msgModalVisible
    } = this.state;
    const { t, ErrorHandler, session } = this.props;
    ErrorHandler.setBreadcrumb('Open Profile:' + id);

    if (session.currentuser.tours.indexOf('p') < 0) {
      ErrorHandler.setBreadcrumb('Opened Tour: Profile');
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
              {({ data, loading, error }) => {
                if (error) {
                  return (
                    <ErrorHandler.report
                      error={error}
                      calledName={'getProfile'}
                    />
                  );
                }
                if (loading) {
                  return (
                    <Spinner
                      message={t('common:Loading') + '...'}
                      size="large"
                    />
                  );
                } else if (!data || !data.profile) {
                  return <div>{t('notexist')}</div>;
                }
                const profile = data.profile;

                const { users, photos, desires, about } = profile;

                const publicPics = photos.filter(
                  photoObject => !photoObject.private && photoObject.url !== ''
                );
                const privatePics = photos
                  .slice(4, 8)
                  .filter(
                    photoObject => photoObject.private && photoObject.url !== ''
                  );
                return (
                  <section className="profile">
                    <div className="container">
                      <div className="col-md-12">
                        <div className="row">
                          <div className="col-md-3">
                            <ErrorHandler.ErrorBoundary>
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
                            </ErrorHandler.ErrorBoundary>
                          </div>
                          <div className="col-md-9">
                            <ErrorHandler.ErrorBoundary>
                              <ProfileInfo
                                users={users}
                                online={profile.online}
                                t={t}
                              />
                            </ErrorHandler.ErrorBoundary>
                            <ErrorHandler.ErrorBoundary>
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
                            </ErrorHandler.ErrorBoundary>

                            <ErrorHandler.ErrorBoundary>
                              <DesiresMobile desires={desires} t={t} />
                            </ErrorHandler.ErrorBoundary>
                            {publicPics.length > 0 && (
                              <ErrorHandler.ErrorBoundary>
                                <PhotoSlider
                                  isPublic={true}
                                  photos={publicPics}
                                  t={t}
                                />
                              </ErrorHandler.ErrorBoundary>
                            )}
                            {privatePics.length > 0 && (
                              <ErrorHandler.ErrorBoundary>
                                <PhotoSlider
                                  isPublic={false}
                                  photos={privatePics}
                                  t={t}
                                />
                              </ErrorHandler.ErrorBoundary>
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
                        goToMain={() => this.props.history.push('/members')}
                        type={flagOptions.Profile}
                        ErrorBoundary={ErrorHandler.ErrorBoundary}
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
                        ErrorBoundary={ErrorHandler.ErrorBoundary}
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
  withRouter(withNamespaces('profile')(ProfilePage))
);
