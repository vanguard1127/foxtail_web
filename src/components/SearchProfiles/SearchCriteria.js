import React, { Component, Fragment } from 'react';
import { Mutation, Query } from 'react-apollo';
import { UPDATE_SETTINGS, GET_SETTINGS, REMOVE_LOCLOCK } from '../../queries';
import Dropdown from '../common/Dropdown';
import AddressSearch from '../common/AddressSearch';
import SetLocationModal from '../Modals/SetLocation';
import DistanceSlider from '../common/DistanceSlider';
import AgeRange from '../common/AgeRange';

const CURRENT_LOC_LABEL = 'My Location';

class SearchCriteria extends Component {
  state = {
    skip: 0,
    loading: false,
    lat: this.props.lat || null,
    long: this.props.long || null,
    locModalVisible: false,
    location: '',
    profile: null,
    ...this.props.searchCriteria
  };

  setLocModalVisible = visible => {
    this.setState({ locModalVisible: visible });
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

  handleSubmit = updateSettings => {
    updateSettings()
      .then(({ data }) => {
        console.log('IN', data);
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
          'Please enable location services to remove your set location.'
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

  setLocationValues = ({ lat, long, address, updateSettings }) => {
    this.setState({ lat, long, location: address });
    if (lat && long) {
      this.handleSubmit(updateSettings);
    }
  };

  setValue = ({ name, value, updateSettings }) => {
    this.setState({ [name]: value });
    this.handleSubmit(updateSettings);
    this.props.setValue({ name, value });
  };

  render() {
    const {
      long,
      lat,
      distance,
      distanceMetric,
      ageRange,
      interestedIn,
      location,
      locModalVisible
    } = this.state;

    const lang = localStorage.getItem('i18nextLng');
    const { t, loading } = this.props;
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
                      address={''}
                      type={'(cities)'}
                      placeholder={t('common:setloc') + '...'}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="item">
                    <Dropdown
                      type={'interestedIn'}
                      onChange={el => null}
                      value={[]}
                      placeholder={t('common:Interested') + ':'}
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
    return (
      <div>
        <Mutation mutation={REMOVE_LOCLOCK}>
          {(removeLocation, { loading }) => {
            return (
              <Mutation
                mutation={UPDATE_SETTINGS}
                variables={{
                  distance,
                  distanceMetric,
                  ageRange,
                  interestedIn,
                  location,
                  lat,
                  long
                }}
              >
                {(updateSettings, { loading }) => {
                  return (
                    <section className="meet-filter">
                      <div className="container">
                        <div className="col-md-12">
                          <div className="row">
                            <div className="col-md-6">
                              <div className="item">
                                <AddressSearch
                                  style={{ width: 150 }}
                                  setLocationValues={({ lat, long, address }) =>
                                    this.setLocationValues({
                                      lat,
                                      long,
                                      address,
                                      updateSettings
                                    })
                                  }
                                  address={location}
                                  type={'(cities)'}
                                  placeholder={t('common:setloc') + '...'}
                                />
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="item">
                                <Dropdown
                                  type={'interestedIn'}
                                  onChange={el =>
                                    this.setValue({
                                      name: 'interestedIn',
                                      value: el.map(e => e.value),
                                      updateSettings
                                    })
                                  }
                                  value={interestedIn}
                                  placeholder={t('common:Interested') + ':'}
                                  lang={lang}
                                />
                              </div>
                            </div>
                            <div className="col-md-6">
                              <DistanceSlider
                                value={distance}
                                setValue={el =>
                                  this.setValue({
                                    name: 'distance',
                                    value: el,
                                    updateSettings
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
                                    name: 'ageRange',
                                    value: el,
                                    updateSettings
                                  })
                                }
                                t={t}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>
                  );
                }}
              </Mutation>
            );
          }}
        </Mutation>

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

export default SearchCriteria;
