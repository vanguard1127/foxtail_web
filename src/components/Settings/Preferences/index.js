import React, { Component } from "react";
import Tooltip from "../../common/Tooltip";
import DistanceSlider from "../../common/DistanceSlider";
import Dropdown from "../../common/Dropdown";
import AgeRange from "../../common/AgeRange";
import AddressSearch from "../../common/AddressSearch";
import DistanceMetricSwitch from "./DistanceMetricSwitch";
class Preferences extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    if (
      this.props.distanceMetric !== nextProps.distanceMetric ||
      this.props.city !== nextProps.city ||
      this.props.t !== nextProps.t ||
      this.state.interestedIn !== nextState.interestedIn
    ) {
      return true;
    }
    return false;
  }

  state = {
    interestedIn: this.props.interestedIn
  };

  render() {
    const {
      distance,
      distanceMetric,
      ageRange,
      city,
      setValue,
      setLocationValues,
      t,
      ErrorBoundary,
      isBlackMember,
      lang
    } = this.props;
    const { interestedIn } = this.state;

    return (
      <ErrorBoundary>
        <div className="content">
          <div className="row">
            <div className="col-md-12">
              <span className="heading">
                {t("myserchpref")}
                <Tooltip title={t("srchpref")} placement="left-start">
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
                multiple
                onChange={el =>
                  this.setState({
                    interestedIn: el.map(e => e.value)
                  })
                }
                onClose={el => {
                  setValue({
                    name: "interestedIn",
                    value: interestedIn
                  });
                }}
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
