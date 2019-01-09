import React from "react";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng
} from "react-places-autocomplete";

export default class AddressSearch extends React.Component {
  handleChange = address => {
    this.props.setLocationValues({
      address
    });
  };

  handleSelect = address => {
    geocodeByAddress(address)
      .then(results => getLatLng(results[0]))
      .then(latLng => {
        this.props.setLocationValues({
          lat: latLng.lat,
          long: latLng.lng,
          address
        });
      })
      .then(latLng => console.log("Success", latLng))
      .catch(error => console.error("Error", error));
  };

  render() {
    const { type, address } = this.props;
    const onError = (status, clearSuggestions) => {
      console.log("Google Maps API returned error with status: ", status);
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
            <div className="dropdown">
              {/* <label>Location</label> */}
              <input
                {...getInputProps({
                  placeholder: "Search Places ...",
                  className: "location-search-input"
                })}
              />
              <div className="autocomplete-dropdown-container">
                {loading && <div>Loading...</div>}
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
