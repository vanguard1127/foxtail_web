import React from "react";

const BioTextBox = ({ t, setValue, ErrorBoundary, about }) => {
  return (
    <div className="textarea profile-bio-textarea">
      <label>{t("probio")}:</label>
      <ErrorBoundary>
        <textarea
          className="bio"
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
