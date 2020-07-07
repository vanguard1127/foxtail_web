import React, { memo, useState } from "react";
import { useMutation } from "react-apollo";
import { WithT } from "i18next";

import { UPDATE_SETTINGS } from "queries";
import Dropdown from "components/common/Dropdown";
import AddressSearch from "components/common/AddressSearch";
import DistanceSlider from "components/common/DistanceSlider";
import AgeRange from "components/common/AgeRange";
import getCityCountry from "utils/getCityCountry";

import UIWrapper from "./UIWrapper";

import "../searchProfiles.css";

interface ISearchCriteriaProps extends WithT {
  loading: boolean;
  setLocation: (val: any) => void;
  setValue: ({ name, value }: { name: string, value: string }) => void
  lat: any;
  long: any;
  lang: any;
  distance: any;
  distanceMetric: any;
  ageRange: any;
  interestedIn: any;
  city: any;
  country: any;
  ErrorHandler: any;
  isBlackMember: boolean;
  ReactGA: any;
}

const SearchCriteria: React.FC<ISearchCriteriaProps> = memo(({
  loading,
  setLocation,
  setValue,
  lat,
  long,
  lang,
  distance,
  distanceMetric,
  ageRange,
  interestedIn,
  city,
  country,
  ErrorHandler,
  isBlackMember,
  ReactGA,
  t,
}) => {
  const [interestedInState, setInterestedInState] = useState(interestedIn);
  const [updateSettings] = useMutation(UPDATE_SETTINGS, {
    variables: {
      distance,
      distanceMetric,
      ageRange,
      interestedIn,
      city,
      country,
      lat,
      long
    }
  });

  const setLocationHandler = async (pos, updateSettings) => {
    var crd = pos.coords;
    const citycntry = await getCityCountry({
      long: crd.longitude,
      lat: crd.latitude
    });
    if (long !== crd.longitude && lat !== crd.latitude) {
      setLocation({
        long: crd.longitude,
        lat: crd.latitude,
        city: citycntry.city,
        country: citycntry.country
      });
      if (updateSettings) {
        handleSubmit(updateSettings);
      }
    }
  };

  const handleSubmit = updateSettings => {
    updateSettings()
      .then(() => {
        ReactGA.event({
          category: "Profile Search",
          action: "Change criteria"
        });
      })
      .catch(res => {
        ErrorHandler.catchErrors(res);
      });
  };

  const setLocationValues = async ({ lat, long, city, updateSettings }) => {
    if (lat && long) {
      setLocationHandler({ coords: { longitude: long, latitude: lat } }, updateSettings);
    } else {
      setValue({ name: "city", value: city });
    }
  };

  const setValueHandler = ({ name, value, updateSettings }) => {
    setValue({ name, value });
    handleSubmit(updateSettings);
  };

  if (loading) {
    return (
      <UIWrapper>
        <div className="col-md-6">
          <div className="item">
            <AddressSearch
              setLocationValues={({ lat, long, address }) => {
                setLocationValues({
                  lat,
                  long,
                  city: address,
                  updateSettings
                });
              }}
              address=""
              type="(cities)"
              placeholder={`${t("common:setloc")}...`}
              isBlackMember={isBlackMember}
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="item">
            <Dropdown
              type={"interestedIn"}
              multiple
              onChange={el => null}
              value={[]}
              placeholder={t("common:Interested") + ":"}
              className="dropdown wide"
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
      </UIWrapper>
    );
  }

  return (
    <UIWrapper>
      <div className="col-md-6">
        <div className="item">
          <AddressSearch
            setLocationValues={({ lat, long, address }) => {
              setLocationValues({
                lat,
                long,
                city: address,
                updateSettings
              });
            }}
            address={city}
            type={"(cities)"}
            placeholder={t("common:setloc") + "..."}
            isBlackMember={isBlackMember}
          />
        </div>
      </div>
      <div className="col-md-6">
        <div className="item">
          <Dropdown
            type="interestedIn"
            multiple
            onChange={el => setInterestedInState(el.map(e => e.value))}
            onClose={() =>
              setValueHandler({
                name: "interestedIn",
                value: interestedInState,
                updateSettings
              })
            }
            value={interestedInState}
            placeholder={t("common:Interested") + ":"}
            lang={lang}
            className="dropdown wide"
          />
        </div>
      </div>
      <div className="col-md-6">
        <DistanceSlider
          value={distance}
          setValue={el =>
            setValueHandler({
              name: "distance",
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
          setValue={el => {
            setValueHandler({
              name: "ageRange",
              value: el,
              updateSettings
            })
          }}
          t={t}
        />
      </div>
    </UIWrapper>
  )
});

export default SearchCriteria;
