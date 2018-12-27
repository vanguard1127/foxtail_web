import React from "react";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng
} from "react-places-autocomplete";
import Select from "react-select";
const options = [
  { value: "chocolate", label: "Chocolate" },
  { value: "strawberry", label: "Strawberry" },
  { value: "vanilla", label: "Vanilla" }
];
export default class AddressSearch extends React.Component {
  state = { address: this.props.address };

  handleChange = address => {
    console.log("Addres", address);
    this.setState({ address });
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
    const { address } = this.state;
    const { type } = this.props;
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
          console.log(
            suggestions.map(sug => ({
              value: sug.description,
              label: sug.description
            }))
          );

          return (
            <div className="dropdown">
              {/* <select>
              <option>United States</option>
              <option>France</option>
              <option>Turkey</option>
            </select> */}
              <Select
                className="js-example-basic-single search"
                name="located[]"
                options={suggestions.map(sug => ({
                  value: sug.description,
                  label: sug.description
                }))}
              />
              <input
                {...getInputProps({
                  placeholder: "Search Places ...",
                  className: "location-search-input"
                })}
              />
            </div>

            // <div>
            //   <input
            //     style={{ ...style }}
            //     {...getInputProps({
            //       placeholder: "Search Places ...",
            //       className: "location-search-input"
            //     })}
            //   />
            //   <div className="autocomplete-dropdown-container">
            //     {loading && <div>Loading...</div>}
            //     {suggestions.map(suggestion => {
            //       const className = suggestion.active
            //         ? "suggestion-item--active"
            //         : "suggestion-item";
            //       // inline style for demonstration purpose
            //       const style = suggestion.active
            //         ? { backgroundColor: "#fafafa", cursor: "pointer" }
            //         : { backgroundColor: "#ffffff", cursor: "pointer" };
            //       return (
            //         <div
            //           {...getSuggestionItemProps(suggestion, {
            //             className,
            //             style
            //           })}
            //         >
            //           <span>{suggestion.description}</span>
            //         </div>
            //       );
            //     })}
            //   </div>
            // </div>
          );
        }}
      </PlacesAutocomplete>
    );
  }
}
