import React, { Component } from 'react';
import { UPDATE_SETTINGS } from '../../../queries';
import { Mutation } from 'react-apollo';
import AddressSearch from '../../common/AddressSearch';
import { ErrorBoundary } from '../../common/ErrorHandler';
import { withNamespaces } from 'react-i18next';
import Modal from '../../common/Modal';

class SetLocationModal extends Component {
  state = { address: '', long: null, lat: null };

  setLocationValues = ({ lat, long, address }) => {
    if (lat && long) {
      return this.setState({ lat, long, address });
    }
    return this.setState({ address });
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
          alert(t('locset') + ': ' + this.state.address);
          this.props.close();
        } else {
          alert(t('locnotset'));
        }
      })
      .catch(res => {
        console.log(res);
        const errors = res.graphQLErrors.map(error => {
          return error.message;
        });

        //TODO: send errors to analytics from here
        this.setState({ errors });
      });
  };

  render() {
    const { close, isBlackMember, t } = this.props;

    const { address, lat, long } = this.state;
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
                  <button
                    onClick={() => this.handleSubmit(updateSettings)}
                    disabled={lat === null}
                  >
                    {t('Save')}
                  </button>
                );
              }}
            </Mutation>
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
            />
          </div>
        </ErrorBoundary>
      </Modal>
    );
  }
}

export default withNamespaces('modals')(SetLocationModal);
