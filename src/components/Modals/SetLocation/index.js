import React, { Component } from 'react';
import { UPDATE_SETTINGS } from '../../../queries';
import { Mutation } from 'react-apollo';
import AddressSearch from '../../common/AddressSearch';
import { ErrorBoundary, catchErrors } from '../../common/ErrorHandler';
import { withNamespaces } from 'react-i18next';
import Modal from '../../common/Modal';
import { toast } from 'react-toastify';

class SetLocationModal extends Component {
  state = { address: '', long: null, lat: null };
  componentDidMount() {
    this.mounted = true;
  }
  componentWillUnmount() {
    this.mounted = false;
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.address !== nextState.address) {
      return true;
    }
    return false;
  }

  setLocationValues = pos => {
    const { lat, long, address } = pos;
    console.log('SET:', lat, long, address, pos);
    if (lat && long) {
      if (this.mounted) {
        return this.setState({ lat, long, address });
      }
    }
    if (this.mounted) {
      return this.setState({ address });
    }
  };

  handleSubmit = updateSettings => {
    const { t } = this.props;
    updateSettings()
      .then(async ({ data }) => {
        if (data.updateSettings) {
          this.props.setLocation({
            coords: {
              longitude: this.state.long,
              latitude: this.state.lat
            },
            city: this.state.address
          });
          toast.success(t('locset') + ': ' + this.state.address);
          this.props.close();
        } else {
          toast.error(t('locnotset'));
        }
      })
      .catch(res => {
        catchErrors(res.graphQLErrors);
      });
  };

  handleRemoveLocLock = async updateSettings => {
    await navigator.geolocation.getCurrentPosition(
      pos => this.setLocation(pos, updateSettings),
      err => {
        alert(
          this.props.t(
            'Please enable location services to remove your set location.'
          )
        );
        return;
      }
    );
  };

  render() {
    const { close, isBlackMember, t } = this.props;

    const { address, lat, long } = this.state;
    return (
      <Mutation
        mutation={UPDATE_SETTINGS}
        variables={{
          city: address,
          lat,
          long
        }}
      >
        {updateSettings => {
          return (
            <Modal
              header={t('common:setloc')}
              close={close}
              description={
                !isBlackMember && (
                  <small>
                    {t('compmsg')}
                    <br />
                    {t('compsecmsg')}
                  </small>
                )
              }
              okSpan={
                lat !== null ? (
                  <span
                    onClick={() => this.handleSubmit(updateSettings)}
                    disabled={lat === null}
                    className="color"
                  >
                    {t('Save')}
                  </span>
                ) : null
              }
            >
              <ErrorBoundary>
                <div className="m-body">
                  {t('setcity')}:
                  <AddressSearch
                    style={{ width: '100%' }}
                    setLocationValues={this.setLocationValues}
                    address={address}
                    type={'(cities)'}
                    placeholder={t('common:setloc') + '...'}
                    handleRemoveLocLock={() =>
                      this.handleRemoveLocLock(updateSettings)
                    }
                  />
                </div>
              </ErrorBoundary>
            </Modal>
          );
        }}
      </Mutation>
    );
  }
}

export default withNamespaces('modals')(SetLocationModal);
