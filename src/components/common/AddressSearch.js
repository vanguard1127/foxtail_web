import React, { PureComponent } from 'react';
import { withNamespaces } from 'react-i18next';
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng
} from 'react-places-autocomplete';

class AddressSearch extends PureComponent {
  handleChange = address => {
    if (address === 'My Location') {
      this.props.handleRemoveLocLock();
      return;
    }
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
      .then(latLng => console.log('Success', latLng))
      .catch(error => console.error('Error', error));
  };

  render() {
    const { type, address, t, placeholder, hideReset } = this.props;
    const onError = (status, clearSuggestions) => {
      console.log('Google Maps API returned error with status: ', status);
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
            <div className="search" style={{ position: 'relative' }}>
              {/* <label>Location</label> */}
              <div style={{ display: 'flex' }}>
                <input
                  {...getInputProps({
                    placeholder,
                    className: 'location-search-input'
                  })}
                />

                {!hideReset && (
                  <span
                    style={{
                      flex: '1',
                      backgroundColor: 'transparent',
                      marginLeft: '-9%',
                      cursor: 'pointer'
                    }}
                    onClick={() => this.handleChange('My Location')}
                  >
                    <span className="reset-icon" />
                  </span>
                )}
              </div>
              <div className="autocomplete-dropdown-container">
                {loading && <div>{t('common:Loading') + '...'}</div>}
                {suggestions.map(suggestion => {
                  const className = suggestion.active
                    ? 'suggestion-item--active'
                    : 'suggestion-item';
                  // inline style for demonstration purpose
                  const style = suggestion.active
                    ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                    : { backgroundColor: '#ffffff', cursor: 'pointer' };
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

export default withNamespaces('common')(AddressSearch);
