import React from "react";
import { desireOptions } from "../../docs/data";
const DesiresSection = ({ desires }) => {
  return (
    <div className="desires">
      <div className="profile-head">Desires</div>
      <ul>
        {desires.reduce(function(result, desire) {
          result.push(
            <li>{desireOptions.find(el => el.key === desire).value}</li>
          );
          return result;
        }, [])}
      </ul>
    </div>
  );
};

export default DesiresSection;
