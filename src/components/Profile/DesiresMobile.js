import React from "react";
const DesiresMobile = ({ desires }) => {
  return (
    <div className="mobile desires">
      <div className="profile-head">Desires</div>
      <ul>
        {desires.reduce(function(result, desire) {
          result.push(<li>{desire}</li>);
          if (result.length > 1) {
            result.push(<li>...</li>);
          }
          return result;
        }, [])}
      </ul>
    </div>
  );
};

export default DesiresMobile;
