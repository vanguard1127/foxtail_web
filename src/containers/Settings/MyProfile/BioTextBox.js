import React, { useState } from "react";
import CircularProgress from "@material-ui/core/CircularProgress";

const BioTextBox = ({ t, setValue, ErrorBoundary, about }) => {
  // Declare a new state variable, which we'll call "count"
  const [saving, setSaving] = useState(false);

  return (
    <div className="textarea profile-bio-textarea">
      <label>{t("probio")}:</label>
      <ErrorBoundary>
        <textarea
          className="bio"
          onChange={e => {
            setValue({
              name: "about",
              value: e.target.value,
              noSave: true
            });
            setSaving(true);
            setTimeout(() => {
              setSaving(false);
            }, 1500);
          }}
          value={about}
        />
        {saving && (
          <div className="saving">
            {t("common:Saving")}...
            <CircularProgress size={16} color="secondary" />
          </div>
        )}
      </ErrorBoundary>
    </div>
  );
};
export default BioTextBox;
