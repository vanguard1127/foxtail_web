import React from "react";
const SearchBox = ({ value, onChange }) => {
  return (
    <div className="search">
      <input
        type="text"
        placeholder="Search desires..."
        value={value}
        onChange={e =>
          onChange({ name: "searchText", value: e.target.value.toLowerCase() })
        }
      />
    </div>
  );
};

export default SearchBox;
