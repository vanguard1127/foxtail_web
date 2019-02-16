import React, { Component } from 'react';
import { withNamespaces } from 'react-i18next';
import { BLOCK_PROFILE, FLAG_ITEM } from '../../../queries';
import { Mutation } from 'react-apollo';
import { toast } from 'react-toastify';
import { flagOptions } from '../../../docs/options';

class BlockModal extends Component {
  state = { other: false, reason: '', type: this.props.type };

  handleChange = e => {
    if (e.target.value === 'other') {
      this.setState({ other: true, reason: '' });
    } else {
      this.setState({ reason: e.target.value, other: false });
    }
  };

  handleTextChange = event => {
    this.setState({ reason: event.target.value });
  };

  handleSubmit = (blockProfile, flagItem) => {
    flagItem()
      .then(({ data }) => {
        this.props.close();
      })
      .then(() => {
        if (this.state.type === flagOptions.Profile) {
          blockProfile().then(({ data }) => {
            if (data.blockProfile) {
              toast.success('Selected profile has been reported. Thanks.');
              this.props.goToMain();
            }
          });
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

  menu = () => {
    const { t, ErrorBoundary } = this.props;
    if (this.state.type === flagOptions.Profile) {
      return (
        <select
          defaultValue=""
          style={{ display: 'flex', flex: '1', margin: '10px' }}
          onChange={this.handleChange}
        >
          <option value="">{t('reason')}:</option>
          <option value="nopro">{t('nopro')}</option>
          <option value="stolenPic">{t('stolepic')}</option>
          <option value="money">{t('money')}</option>
          <option value="nudity">{t('Nudity')}</option>
          <option value="rude">{t('Rude')}</option>
          <option value="Spam">{t('Spam')}</option>
          <option value="racist">{t('Racist')}</option>
          <option value="other">{t('Other')}</option>
        </select>
      );
    }
    if (this.state.type === flagOptions.Chat) {
      return (
        <select
          defaultValue=""
          style={{ display: 'flex', flex: '1', margin: '10px' }}
          onChange={this.handleChange}
        >
          <option value="">{t('reason')}:</option>
          <option value="nopro">{t('nopro')}</option>
        </select>
      );
    } else {
      return (
        <select
          defaultValue=""
          style={{ display: 'flex', flex: '1', margin: '10px' }}
          onChange={this.handleChange}
        >
          <option value="">{t('reason')}:</option>
          <option value="illegalEvent">{t('illevent')}</option>
          <option value="racist">{t('Racist')}</option>
          <option value="Spam">{t('Spam')}</option>
          <option value="Phishing">{t('Phishing')}</option>
        </select>
      );
    }
  };
  render() {
    const { profile, close, id, t, ErrorBoundary } = this.props;

    const { other, reason, type } = this.state;
    const blockMenu = this.menu();
    let title;
    if (type === flagOptions.Profile) {
      title =
        t('repblock') +
        ' ' +
        profile.users.map((user, index) => {
          if (index === 0) return user.username;
          else return +' & ' + user.username;
        });
    }
    if (type === flagOptions.Chat) {
      title = 'Report Group';
    } else {
      title = t('repblock');
    }
    return (
      <section className="popup-content show">
        <div className="container">
          <div className="col-md-12">
            <div className="row">
              <div className="offset-md-3 col-md-6">
                <div className="modal-popup photo-verification">
                  <ErrorBoundary>
                    <div className="m-head">
                      <span className="heading">{title}</span>
                      <span className="close" onClick={close} />
                    </div>
                    <div className="m-body">
                      {blockMenu}
                      <div
                        style={{
                          display: other ? 'block' : 'none'
                        }}
                      >
                        <input
                          placeholder={t('otherreason')}
                          onChange={this.handleTextChange}
                          value={reason}
                        />
                      </div>
                      <Mutation
                        mutation={FLAG_ITEM}
                        variables={{
                          type,
                          reason,
                          targetID: id
                        }}
                      >
                        {flagItem => {
                          return (
                            <Mutation
                              mutation={BLOCK_PROFILE}
                              variables={{
                                blockedProfileID: id
                              }}
                            >
                              {(blockProfile, { loading }) => {
                                if (loading) {
                                  //TODO: Make nice popup saving
                                  return <div>{t('Saving')}...</div>;
                                }
                                return (
                                  <button
                                    onClick={() =>
                                      this.handleSubmit(blockProfile, flagItem)
                                    }
                                    disabled={reason === '' || loading}
                                  >
                                    {t('repblock')}
                                  </button>
                                );
                              }}
                            </Mutation>
                          );
                        }}
                      </Mutation>
                    </div>
                  </ErrorBoundary>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default withNamespaces('modals')(BlockModal);
