import React from 'react';

const DesiresBlock = ({ desires, t, id }) => {
  return (
    <span className="interest">
      <ul>
        {desires.reduce(function(result, desire) {
          //TODO: Break on 2 so it doesnt keep adding desires
          if (result.length < 2) {
            result.push(<li key={desire}>{t(desire)}</li>);
            if (result.length > 1) {
              result.push(<li key={'na' + id}>...</li>);
            }
          }
          return result;
        }, [])}
      </ul>
    </span>
  );
};

export default DesiresBlock;
