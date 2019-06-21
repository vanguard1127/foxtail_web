import React, { Component } from "react";
import Tooltip from "@material-ui/core/Tooltip";
import DistanceSlider from "../../common/DistanceSlider";
import Dropdown from "../../common/Dropdown";
import AgeRange from "../../common/AgeRange";
import AddressSearch from "../../common/AddressSearch";
import DistanceMetricSwitch from "./DistanceMetricSwitch";
class Preferences extends Component {
  shouldComponentUpdate(nextProps) {
    if (
      this.props.distanceMetric !== nextProps.distanceMetric ||
      this.props.city !== nextProps.city
    ) {
      return true;
    }
    return false;
  }

  handleRemoveLocLock = async () => {
    await navigator.geolocation.getCurrentPosition(
      pos => {
        const { latitude, longitude } = pos.coords;
        this.props.setLocationValues({ lat: latitude, long: longitude });
      },
      err => {
        alert(this.props.t("common:enablerem"));
        return;
      }
    );
  };
  render() {
    const {
      distance,
      distanceMetric,
      ageRange,
      interestedIn,
      city,
      setValue,
      setLocationValues,
      t,
      ErrorBoundary,
      isBlackMember,
      lang
    } = this.props;

    return (
      <ErrorBoundary>
        <div className="content">
          <div className="row">
            <div className="col-md-12">
              <span className="heading">
                {t("myserchpref")}
                <Tooltip
                  title="Search Preferences used to search members on the Meet Members page"
                  placement="left-start"
                >
                  <span className="tip" />
                </Tooltip>
              </span>
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
                metric={distanceMetric}
                style={{ zIndex: 0 }}
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
                style={{ zIndex: 0 }}
              />
            </div>
            <div className="col-md-6">
              <div className="item">
                <DistanceMetricSwitch
                  setValue={setValue}
                  t={t}
                  distanceMetric={distanceMetric}
                />
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
                  setLocationValues={({ lat, long, address }) => {
                    setLocationValues({
                      lat,
                      long,
                      city: address
                    });
                  }}
                  address={city}
                  type={"(cities)"}
                  placeholder={t("common:setloc") + "..."}
                  handleRemoveLocLock={this.handleRemoveLocLock}
                  isBlackMember={isBlackMember}
                />
              </div>
            </div>
          </div>
        </div>
      </ErrorBoundary>
    );
  }
}

export default Preferences;
