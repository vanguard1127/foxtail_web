import React, { PureComponent } from 'react';
import AddressSearch from '../common/AddressSearch';
import Select from '../common/Select';

class SearchEventsFilters extends PureComponent {
  render() {
    const {
      location,
      setLocationValues,
      handleChangeSelect,
      maxDistance,
      t
    } = this.props;
    return (
      <div className="settings-con">
        <Select
          onChange={handleChangeSelect}
          label={t('disway') + ':'}
          defaultOptionValue={maxDistance.toString()}
          options={[
            { label: '5' + ' ' + t('miles'), value: '5' },
            { label: '10' + ' ' + t('miles'), value: '10' },
            { label: '20' + ' ' + t('miles'), value: '20' },
            { label: '50' + ' ' + t('miles'), value: '50' }
          ]}
          className={'dropdown'}
        />
        <div>
          <label>{t('From')}:</label>
          <AddressSearch
            style={{ width: 150 }}
            setLocationValues={setLocationValues}
            address={location}
            type={'(cities)'}
            placeholder={t('srchcity') + '...'}
          />
        </div>
      </div>
    );
  }
}

export default SearchEventsFilters;
