import React from "react";
import { sexOptions } from "../../docs/data";
import Select from "./Select";

const InterestedInDropdown = ({ onChange, value, placeholder }) => {
  return (
    <Select
      onChange={onChange}
      multiple
      label={placeholder}
      defaultOptionValues={
        value && value.map(val => sexOptions.find(el => el.value === val))
      }
      options={sexOptions}
      className={"dropdown"}
    />
  );
};

export default InterestedInDropdown;
