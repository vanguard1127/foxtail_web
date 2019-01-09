import React, { Component } from "react";
import DistanceSlider from "../common/DistanceSlider";
import InterestedInDropdown from "../common/InterestedInDropdown";
import AgeRange from "../common/AgeRange";
import AddressSearch from "../common/AddressSearch";
const milesToKilometers = miles => miles / 0.621371;
const kilometersToMiles = kilometers => kilometers * 0.621371;
class Preferences extends Component {
  UNSAFE_componentWillReceiveProps() {
    //See if prev props and current props mean calculacte
  }
  render() {
    const {
      distance,
      updateSettings,
      ageRange,
      interestedIn,
      distanceMetric,
      location
    } = this.props;
    const distanceSliderMax =
      distanceMetric === "mi" ? 100 : Math.floor(milesToKilometers(100));

    const convertFunction =
      "mi" === distanceMetric ? kilometersToMiles : milesToKilometers;
    // The input uses original metric
    // But displays and sends the selected metric
    let convertedDistance = distance;

    convertedDistance = Math.floor(convertFunction(distance));

    return (
      <div className="content">
        <div className="row">
          <div className="col-md-12">
            <span className="heading">My Search Preferences</span>
          </div>
          <div className="col-md-6">
            <DistanceSlider
              value={distance}
              setValue={el =>
                this.setValue({
                  name: "distance",
                  value: el,
                  updateSettings
                })
              }
            />
          </div>
          <div className="col-md-6">
            <AgeRange
              value={ageRange}
              setValue={el =>
                this.setValue({
                  name: "ageRange",
                  value: el,
                  updateSettings
                })
              }
            />
          </div>
          <div className="col-md-6">
            <div className="item">
              <div className="switch-con border-top">
                <div className="sw-head">Distance Metric:</div>
                <div className="sw-btn">
                  <div className="switch distance">
                    <input
                      type="checkbox"
                      id="distance"
                      checked={distanceMetric === "mi" ? true : false}
                      onChange={e => {
                        this.setValue({
                          name: "distanceMetric",
                          value: distanceMetric === "km" ? "mi" : "km",
                          updateSettings
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
            <InterestedInDropdown
              setValue={el =>
                this.setValue({
                  name: "interestedIn",
                  value: el,
                  updateSettings
                })
              }
              value={interestedIn}
              placeholder={"Gender(s):"}
            />
          </div>

          <div className="col-md-12">
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
                type={"(cities)"}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Preferences;
