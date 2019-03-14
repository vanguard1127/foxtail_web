import React, { PureComponent } from 'react';

class DesiresBlock extends PureComponent {
  render() {
    const { desires, t, id } = this.props;
    return (
      <span className="interest">
        <ul>
          {desires.reduce(function(result, desire, currentIndex) {
            //TODO: Break on 2 so it doesnt keep adding desires
            if (result.length < 2) {
              result.push(<li key={desire}>{t(desire)}</li>);
              if (result.length > 1) {
                result.push(<li key={'na' + id}>+{desires.length - 2}</li>);
              }
            }
            return result;
          }, [])}
        </ul>
      </span>
    );
  }
}

export default DesiresBlock;
