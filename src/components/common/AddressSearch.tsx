import React, { useState, useEffect } from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import PlacesAutocomplete, { geocodeByAddress } from "react-places-autocomplete";
import { toast } from "react-toastify";

import getCityCountry from "utils/getCityCountry";
import * as ErrorHandler from 'components/common/ErrorHandler';

interface IAddressSearchProps extends WithTranslation {
  address: string,
  isBlackMember: boolean,
  setLocationValues: (obj: { lat: number, long: number, address: string }) => void,
  type: string,
  placeholder: string,
  hideReset?: boolean,
}

const AddressSearch: React.FC<IAddressSearchProps> = ({
  address,
  isBlackMember,
  setLocationValues,
  type,
  placeholder,
  hideReset = false,
  t,
}) => {
  const [addressState, setAddressState] = useState<string>(address);

  const handleChange = newAddress => {
    if (newAddress === "My Location") {
      handleRemoveLocLock();
      return;
    }

    if (isBlackMember !== undefined) {
      if (!isBlackMember && address !== "") {
        if (!toast.isActive("onlyblkmem")) {
          toast(t("Only Black Members can change location."), {
            toastId: "onlyblkmem"
          });
        }
        return;
      }
    }
    setAddressState(newAddress);
  };

  const handleRemoveLocLock = async () => {
    await navigator.geolocation.getCurrentPosition(
      async pos => {
        const { latitude, longitude } = pos.coords;
        const citycntry = await getCityCountry({
          long: longitude,
          lat: latitude
        });
        setAddressState(citycntry.city);
        setLocationValues({
          lat: latitude,
          long: longitude,
          address: citycntry.city
        })
      },
      err => {
        alert(t("common:enablerem"));
        return;
      }
    );
  };

  useEffect(() => {
    setAddressState(address);
  }, [address]);

  const handleSelect = newAddress => {
    geocodeByAddress(newAddress)
      .then(async results => {
        if (type === "address") {
          setLocationValues({
            lat: results[0].geometry.location.lat(),
            long: results[0].geometry.location.lng(),
            address: newAddress
          });
        } else {
          const citycntry = await getCityCountry({
            long: results[0].geometry.location.lng(),
            lat: results[0].geometry.location.lat()
          });
          setAddressState(citycntry.city);
          setLocationValues({
            lat: results[0].geometry.location.lat(),
            long: results[0].geometry.location.lng(),
            address: citycntry.city
          })
        }
      })
      .catch(error => ErrorHandler.catchErrors(error));
  };

  const onError = (status, clearSuggestions) => {
    if (status !== "ZERO_RESULTS")
      ErrorHandler.catchErrors(status);
    clearSuggestions();
  };

  return (
    <PlacesAutocomplete
      value={addressState}
      onSelect={handleSelect}
      onChange={handleChange}
      searchOptions={{
        types: [type]
      }}
      shouldFetchSuggestions={addressState.length > 3}
      onError={onError}
    >
      {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => {
        return (
          <div className="search" style={{ position: "relative" }}>
            <div style={{ display: "flex" }}>
              <input
                id="search-location"
                aria-label="search location"
                {...getInputProps({ placeholder, className: "location-search-input" })}
              />

              {!hideReset && (
                <span
                  style={{
                    flex: "1",
                    backgroundColor: "transparent",
                    marginLeft: "-9%",
                    cursor: "pointer"
                  }}
                  onClick={() => handleChange("My Location")}
                >
                  <span className="reset-icon" />
                </span>
              )}
            </div>
            <div className="autocomplete-dropdown-container">
              {loading && (
                <div
                  className="suggestion-item"
                  style={{ backgroundColor: "#ffffff" }}
                >
                  {`${t("common:Loading")}...`}
                </div>
              )}
              {suggestions.map(suggestion => {
                const style = suggestion.active
                  ? { backgroundColor: "#fafafa", cursor: "pointer" }
                  : { backgroundColor: "#ffffff", cursor: "pointer" };
                return (
                  <div
                    key={suggestion.id}
                    {...getSuggestionItemProps(suggestion, {
                      className: `${suggestion.active ? "suggestion-item--active" : "suggestion-item"}`,
                      style
                    })}
                  >
                    <span>{suggestion.description}</span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      }}
    </PlacesAutocomplete>
  );
}

export default withTranslation("common")(AddressSearch);
