import React from "react";
import PlacesAutocomplete from "react-places-autocomplete";

export default class AddressSearch extends React.Component {
  render() {
    const { value, onChange, onSelect, style } = this.props;
    return (
      <PlacesAutocomplete
        value={value}
        onChange={onChange}
        onSelect={onSelect}
        searchOptions={{
          types: ["address"]
        }}
        shouldFetchSuggestions={value.length > 3}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div>
            <input
              style={{ ...style }}
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
        )}
      </PlacesAutocomplete>
    );
  }
}