import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import { UPDATE_SETTINGS, REMOVE_LOCLOCK } from '../../queries';
import Dropdown from '../common/Dropdown';
import AddressSearch from '../common/AddressSearch';
import SetLocationModal from '../Modals/SetLocation';
import DistanceSlider from '../common/DistanceSlider';
import AgeRange from '../common/AgeRange';
import getCityCountry from '../../utils/getCityCountry';

class SearchCriteria extends Component {
  state = {
    skip: 0,
    loading: false,
    locModalVisible: false,
    ...this.props.searchCriteria,
    city: this.props.searchCriteria.city,
    country: this.props.searchCriteria.country
  };

  setLocModalVisible = visible => {
    this.setState({ locModalVisible: visible });
  };

  //TODO: Refactor to use setValue
  setLocation = async (pos, updateSettings) => {
    var crd = pos.coords;

    const citycntry = await getCityCountry({
      long: crd.longitude,
      lat: crd.latitude
    });

    const { long, lat } = this.state;
    if (long !== crd.longitude && lat !== crd.latitude) {
      await this.setState({
        long: crd.longitude,
        lat: crd.latitude,
        city: citycntry.city,
        country: citycntry.country
      });

      if (updateSettings) {
        this.handleSubmit(updateSettings);
      }
      await this.props.setLocation({
        long: crd.longitude,
        lat: crd.latitude,
        city: citycntry.city,
        country: citycntry.country
      });
    }
  };

  handleSubmit = updateSettings => {
    updateSettings().catch(res => {
      const errors = res.graphQLErrors.map(error => {
        return error.message;
      });

      //TODO: send errors to analytics from here
      this.setState({ errors });
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

  setLocationValues = async ({ lat, long, city, updateSettings }) => {
    if (lat && long) {
      this.setLocation(
        {
          coords: {
            longitude: long,
            latitude: lat
          }
        },
        updateSettings
      );
    } else {
      this.setState({ city });
    }
  };

  setValue = ({ name, value, updateSettings }) => {
    this.setState({ [name]: value }, () => {
      this.handleSubmit(updateSettings);
    });

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
      city,
      country,
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
                  city,
                  country,
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
                                  setLocationValues={({
                                    lat,
                                    long,
                                    address
                                  }) => {
                                    this.setLocationValues({
                                      lat,
                                      long,
                                      city: address,
                                      updateSettings
                                    });
                                  }}
                                  address={city}
                                  type={'(cities)'}
                                  placeholder={t('common:setloc') + '...'}
                                  handleRemoveLocLock={() =>
                                    this.handleRemoveLocLock(updateSettings)
                                  }
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
