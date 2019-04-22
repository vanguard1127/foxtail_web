import React, { Component } from "react";
import { withNamespaces } from "react-i18next";
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

    if (this.props.isBlackMember !== undefined) {
      if (!this.props.isBlackMember && this.props.address) {
        toast("Only Black Members can change location");
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
        alert(
          this.props.t(
            "Please enable location services to remove your set location."
          )
        );
        return;
      }
    );
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (
      nextState.address !== this.state.address ||
      nextProps.address !== this.props.address
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
    geocodeByAddress(address)
      .then(async results => {
        if (this.mounted) {
          if (this.props.type === "address") {
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
              this.props.setLocationValues({
                lat: results[0].geometry.location.lat(),
                long: results[0].geometry.location.lng(),
                address: citycntry.city
              })
            );
          }
        }
      })
      .catch(
        error =>
          this.props.ErrorHandler && this.props.ErrorHandler.catchErrors(error)
      );
  };

  render() {
    const { type, t, placeholder, hideReset } = this.props;
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

export default withNamespaces("common")(AddressSearch);
