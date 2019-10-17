import React from "react";
const SearchBox = ({ value, onChange, t }) => {
  return (
    <div className="search">
      <input
        type="text"
        placeholder={t("searchdesires") + "..."}
        value={value}
        onChange={e =>
          onChange({ name: "searchText", value: e.target.value.toLowerCase() })
        }
      />
    </div>
  );
};

export default SearchBox;
