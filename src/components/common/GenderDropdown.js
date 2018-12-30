import React from "react";
import { genderOptions } from "../../docs/data";
import Select from "react-select";

const GenderDropdown = ({ setValue, value, placeholder }) => {
  return (
    <div class="dropdown">
      <Select
        defaultValue={value.map(val =>
          genderOptions.find(el => el.value === val)
        )}
        closeMenuOnSelect={false}
        onChange={el => setValue(el.map(e => e.value))}
        options={genderOptions}
        isMulti
        className="js-example-basic-multiple"
        placeholder=""
      />
      <label>{placeholder}</label>
    </div>
  );
};

export default GenderDropdown;
