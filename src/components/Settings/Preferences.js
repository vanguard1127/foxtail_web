import React, { Component } from 'react';
import DistanceSlider from '../common/DistanceSlider';
import Dropdown from '../common/Dropdown';
import AgeRange from '../common/AgeRange';
import AddressSearch from '../common/AddressSearch';
class Preferences extends Component {
  shouldComponentUpdate(nextProps) {
    if (
      this.props.distance !== nextProps.distance ||
      this.props.distanceMetric !== nextProps.distanceMetric ||
      this.props.ageRange !== nextProps.ageRange ||
      this.props.interestedIn !== nextProps.interestedIn ||
      this.props.city !== nextProps.city
    ) {
      return true;
    }
    return false;
  }
  render() {
    const {
      distance,
      distanceMetric,
      ageRange,
      interestedIn,
      city,
      setValue,
      setLocationValues,
      t
    } = this.props;

    const lang = localStorage.getItem('i18nextLng');

    return (
      <div className="content">
        <div className="row">
          <div className="col-md-12">
            <span className="heading">{t('myserchpref')}</span>
          </div>
          <div className="col-md-6">
            <DistanceSlider
              value={distance}
              setValue={el =>
                setValue({
                  name: 'distance',
                  value: el
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
                setValue({
                  name: 'ageRange',
                  value: el
                })
              }
              t={t}
            />
          </div>
          <div className="col-md-6">
            <div className="item">
              <div className="switch-con border-top">
                <div className="sw-head">{t('dmetric')}:</div>
                <div className="sw-btn">
                  <div className="switch distance">
                    <input
                      type="checkbox"
                      id="distance"
                      checked={distanceMetric === 'mi' ? true : false}
                      onChange={e => {
                        setValue({
                          name: 'distanceMetric',
                          value: distanceMetric === 'km' ? 'mi' : 'km'
                        });
                      }}
                    />
                    <label htmlFor="distance" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <Dropdown
              type={'interestedIn'}
              onChange={el =>
                setValue({
                  name: 'interestedIn',
                  value: el.map(e => e.value)
                })
              }
              value={interestedIn}
              placeholder={t('common:Interested') + ':'}
              lang={lang}
            />
          </div>

          <div className="col-md-12">
            <div className="item">
              <AddressSearch
                style={{ width: 150 }}
                setLocationValues={({ lat, long, address }) => {
                  setLocationValues({
                    lat,
                    long,
                    city: address
                  });
                }}
                address={city}
                type={'(cities)'}
                placeholder={t('common:setloc') + '...'}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Preferences;
