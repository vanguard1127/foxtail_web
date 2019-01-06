import React from "react";
import { sexOptions } from "../../docs/data";
import Select from "react-select";

const InterestedInDropdown = ({ setValue, value, placeholder }) => {
  return (
    <div className="dropdown">
      <Select
        defaultValue={
          value && value.map(val => sexOptions.find(el => el.value === val))
        }
        closeMenuOnSelect={false}
        onChange={el => setValue(el.map(e => e.value))}
        options={sexOptions}
        isMulti
        className="js-example-basic-multiple"
        placeholder=""
      />
      <label>{placeholder}</label>
    </div>
  );
};

export default InterestedInDropdown;
