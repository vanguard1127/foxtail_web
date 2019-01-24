import React, { Component } from "react";
import DistanceSlider from "../common/DistanceSlider";
import Dropdown from "../common/Dropdown";
import AgeRange from "../common/AgeRange";
import AddressSearch from "../common/AddressSearch";
const milesToKilometers = miles => miles / 0.621371;
const kilometersToMiles = kilometers => kilometers * 0.621371;
class Preferences extends Component {
  render() {
    const { values, setValue, setLocationValues, t } = this.props;
    const {
      distance,
      distanceMetric,
      ageRange,
      interestedIn,
      location
    } = values;
    const distanceSliderMax =
      distanceMetric === "mi" ? 100 : Math.floor(milesToKilometers(100));

    const convertFunction =
      "mi" === distanceMetric ? kilometersToMiles : milesToKilometers;
    // The input uses original metric
    // But displays and sends the selected metric
    let convertedDistance = distance;

    convertedDistance = Math.floor(convertFunction(distance));
    const lang = localStorage.getItem("i18nextLng");

    return (
      <div className="content">
        <div className="row">
          <div className="col-md-12">
            <span className="heading">{t("myserchpref")}</span>
          </div>
          <div className="col-md-6">
            <DistanceSlider
              value={distance}
              setValue={el =>
                setValue({
                  name: "distance",
                  value: el
                })
              }
              t={t}
            />
          </div>
          <div className="col-md-6">
            <AgeRange
              value={ageRange}
              setValue={el =>
                setValue({
                  name: "ageRange",
                  value: el
                })
              }
              t={t}
            />
          </div>
          <div className="col-md-6">
            <div className="item">
              <div className="switch-con border-top">
                <div className="sw-head">{t("dmetric")}:</div>
                <div className="sw-btn">
                  <div className="switch distance">
                    <input
                      type="checkbox"
                      id="distance"
                      checked={distanceMetric === "mi" ? true : false}
                      onChange={e => {
                        setValue({
                          name: "distanceMetric",
                          value: distanceMetric === "km" ? "mi" : "km"
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
              type={"interestedIn"}
              onChange={el =>
                setValue({
                  name: "interestedIn",
                  value: el.map(e => e.value)
                })
              }
              value={interestedIn}
              placeholder={t("common:Interested") + ":"}
              lang={lang}
            />
          </div>

          <div className="col-md-12">
            <div className="item">
              <AddressSearch
                style={{ width: 150 }}
                setLocationValues={({ lat, long, address }) =>
                  setLocationValues({
                    lat,
                    long,
                    address
                  })
                }
                address={location}
                type={"(cities)"}
                placeholder={t("common:setloc") + "..."}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Preferences;
