import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import PlacesAutocomplete, {
  geocodeByAddress
} from "react-places-autocomplete";
import getCityCountry from "../../utils/getCityCountry";
import { toast } from "react-toastify";

class AddressSearch extends Component {
  state = { address: this.props.address };
  componentDidMount() {
    this.mounted = true;
  }
  componentWillUnmount() {
    this.mounted = false;
  }
  handleChange = address => {
    if (address === "My Location") {
      this.handleRemoveLocLock();
      return;
    }
    const { isBlackMember, t } = this.props;
    if (isBlackMember !== undefined) {
      if (!isBlackMember && this.props.address) {
        if (!toast.isActive("onlyblkmem")) {
          toast(t("onlyblkmem"), {
            toastId: "onlyblkmem"
          });
        }
        return;
      }
    }
    this.setState({
      address
    });
  };

  handleRemoveLocLock = async () => {
    await navigator.geolocation.getCurrentPosition(
      async pos => {
        const { latitude, longitude } = pos.coords;
        const citycntry = await getCityCountry({
          long: longitude,
          lat: latitude
        });
        this.setState({ address: citycntry.city }, () =>
          this.props.setLocationValues({
            lat: latitude,
            long: longitude,
            address: citycntry.city
          })
        );
      },
      err => {
        alert(this.props.t("common:enablerem"));
        return;
      }
    );
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (
      nextState.address !== this.state.address ||
      nextProps.address !== this.props.address ||
      this.props.t !== nextProps.t ||
      this.props.tReady !== nextProps.tReady
    ) {
      return true;
    }
    return false;
  }

  componentDidUpdate(prev) {
    if (prev.address !== this.props.address) {
      this.setState({ address: this.props.address });
    }
  }

  handleSelect = address => {
    const { setLocationValues, ErrorHandler, type } = this.props;
    geocodeByAddress(address)
      .then(async results => {
        if (this.mounted) {
          if (type === "address") {
            this.props.setLocationValues({
              lat: results[0].geometry.location.lat(),
              long: results[0].geometry.location.lng(),
              address
            });
          } else {
            const citycntry = await getCityCountry({
              long: results[0].geometry.location.lng(),
              lat: results[0].geometry.location.lat()
            });
            this.setState({ address: citycntry.city }, () =>
              setLocationValues({
                lat: results[0].geometry.location.lat(),
                long: results[0].geometry.location.lng(),
                address: citycntry.city
              })
            );
          }
        }
      })
      .catch(error => ErrorHandler && ErrorHandler.catchErrors(error));
  };

  render() {
    const { type, t, placeholder, hideReset, isBlackMember } = this.props;
    const { address } = this.state;
    const onError = (status, clearSuggestions) => {
      this.props.ErrorHandler && this.props.ErrorHandler.catchErrors(status);
      clearSuggestions();
    };

    return (
      <PlacesAutocomplete
        value={address}
        onSelect={this.handleSelect}
        onChange={this.handleChange}
        searchOptions={{
          types: [type]
        }}
        shouldFetchSuggestions={address.length > 3}
        onError={onError}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => {
          return (
            <div className="search" style={{ position: "relative" }}>
              {/* <label>Location</label> */}
              <div style={{ display: "flex" }}>
                <input
                  readOnly={isBlackMember !== undefined && !isBlackMember}
                  onClick={() => {
                    if (isBlackMember !== undefined && !isBlackMember) {
                      if (!toast.isActive("onlyblkmem")) {
                        toast(t("onlyblkmem"), {
                          toastId: "onlyblkmem"
                        });
                      }
                    }
                  }}
                  aria-label="search location"
                  {...getInputProps({
                    placeholder,
                    className: "location-search-input"
                  })}
                />

                {!hideReset && (
                  <span
                    style={{
                      flex: "1",
                      backgroundColor: "transparent",
                      marginLeft: "-9%",
                      cursor: "pointer"
                    }}
                    onClick={() => this.handleChange("My Location")}
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
                    {t("common:Loading") + "..."}
                  </div>
                )}
                {suggestions.map(suggestion => {
                  const className = suggestion.active
                    ? "suggestion-item--active"
                    : "suggestion-item";
                  // inline style for demonstration purpose
                  const style = suggestion.active
                    ? { backgroundColor: "#fafafa", cursor: "pointer" }
                    : { backgroundColor: "#ffffff", cursor: "pointer" };
                  return (
                    <div
                      key={suggestion.id}
                      {...getSuggestionItemProps(suggestion, {
                        className,
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
}

export default withTranslation("common")(AddressSearch);
