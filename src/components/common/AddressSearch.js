import React, { Component } from 'react';
import { withNamespaces } from 'react-i18next';
import PlacesAutocomplete, {
  geocodeByAddress
} from 'react-places-autocomplete';

class AddressSearch extends Component {
  componentDidMount() {
    this.mounted = true;
  }
  componentWillUnmount() {
    this.mounted = false;
  }
  handleChange = address => {
    if (address === 'My Location') {
      this.props.handleRemoveLocLock();
      return;
    }
    this.props.setLocationValues({
      address
    });
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.address !== this.props.address) {
      return true;
    }
    return false;
  }

  handleSelect = address => {
    geocodeByAddress(address)
      .then(results => {
        if (this.mounted) {
          this.props.setLocationValues({
            lat: results[0].geometry.location.lat(),
            long: results[0].geometry.location.lng(),
            address: results[0].formatted_address
          });
        }
      })
      .then(results => console.log('Success', results))
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
