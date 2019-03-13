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
    distance: this.props.distance,
    distanceMetric: this.props.distanceMetric,
    ageRange: this.props.ageRange,
    interestedIn: this.props.interestedIn,
    city: this.props.city,
    country: this.props.country,
    lat: this.props.lat,
    long: this.props.long,
    locModalVisible: false
  };

  setLocModalVisible = visible => {
    this.setState({ locModalVisible: visible });
  };

  //TODO: Refactor to use setValue
  setLocation = async (pos, updateSettings) => {
    var crd = pos.coords;
    const { long, lat } = this.props;

    const citycntry = await getCityCountry({
      long: crd.longitude,
      lat: crd.latitude
    });

    if (long !== crd.longitude && lat !== crd.latitude) {
      await this.props.setLocation({
        long: crd.longitude,
        lat: crd.latitude,
        city: citycntry.city,
        country: citycntry.country
      });

      if (updateSettings) {
        this.handleSubmit(updateSettings);
      }
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
      this.props.setValue({ name: 'city', value: city });
      this.setState({
        city
      });
    }
  };

  setValue = ({ name, value, updateSettings }) => {
    this.props.setValue({ name, value });
    this.setState({ [name]: value }, () => this.handleSubmit(updateSettings));
  };

  render() {
    const { locModalVisible } = this.state;
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
    const {
      lang,
      distance,
      distanceMetric,
      ageRange,
      interestedIn,
      city
    } = this.props;

    return (
      <div>
        <Mutation mutation={REMOVE_LOCLOCK}>
          {removeLocation => {
            return (
              <Mutation
                mutation={UPDATE_SETTINGS}
                variables={{
                  distance: this.state.distance,
                  distanceMetric: this.state.distanceMetric,
                  ageRange: this.state.ageRange,
                  interestedIn: this.state.interestedIn,
                  city: this.state.city,
                  country: this.state.country,
                  lat: this.state.lat,
                  long: this.state.long
                }}
              >
                {updateSettings => {
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
