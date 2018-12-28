import React from "react";
import { sexOptions } from "../../docs/data";
import Select from "react-select";

const GenderDropdown = ({ setValue, value }) => {
  return (
    <div class="dropdown">
      <Select
        defaultValue={value.map(val => sexOptions.find(el => el.value === val))}
        closeMenuOnSelect={false}
        onChange={el => setValue(el.map(e => e.value))}
        options={sexOptions}
        isMulti
        className="js-example-basic-multiple"
      />
      <label>Gender(s):</label>
    </div>
  );
};

export default GenderDropdown;
