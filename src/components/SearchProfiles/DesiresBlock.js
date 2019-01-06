import React from "react";

const DesiresBlock = ({ desires }) => {
  return (
    <span className="interest">
      <ul>
        {desires.reduce(function(result, desire) {
          //TODO: Break on 2 so it doesnt keep adding desires
          result.push(<li key={desire}>{desire}</li>);
          if (result.length > 1) {
            result.push(<li key="na">...</li>);
          }
          return result;
        }, [])}
      </ul>
    </span>
  );
};

export default DesiresBlock;
