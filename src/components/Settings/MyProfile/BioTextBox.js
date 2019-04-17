import React from "react";

const BioTextBox = ({ t, setValue, ErrorBoundary, about }) => {
  return (
    <div className="textarea">
      <label>{t("probio")}:</label>
      <ErrorBoundary>
        <textarea
          onChange={e =>
            setValue({
              name: "about",
              value: e.target.value,
              noSave: true
            })
          }
          onMouseLeave={e => {
            setValue({
              name: "about",
              value: e.target.value
            });
          }}
          onBlur={e => {
            setValue({
              name: "about",
              value: e.target.value
            });
          }}
          value={about}
        />
      </ErrorBoundary>
    </div>
  );
};
export default BioTextBox;
