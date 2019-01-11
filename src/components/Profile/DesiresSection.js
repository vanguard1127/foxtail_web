import React from "react";
import { desireOptions } from "../../docs/data";
const DesiresSection = ({ desires }) => {
  return (
    <div className="desires">
      <div className="profile-head">Desires</div>
      <ul>
        {desires.reduce(function(result, desire) {
          if (desireOptions.find(el => el.value === desire)) {
            result.push(
              <li key={desire}>
                {desireOptions.find(el => el.value === desire).label}
              </li>
            );
          }
          return result;
        }, [])}
      </ul>
    </div>
  );
};

export default DesiresSection;
