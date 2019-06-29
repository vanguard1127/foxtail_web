import React, { Component } from "react";

class DesiresBlock extends Component {
  shouldComponentUpdate(nextProps) {
    if (this.props.t !== nextProps.t) {
      return true;
    }
    return false;
  }
  render() {
    const { desires, t, id } = this.props;
    return (
      <span className="interest">
        <ul>
          {desires.reduce(function(result, desire, currentIndex) {
            if (result.length < 2) {
              result.push(<li key={desire}>{t(desire)}</li>);
              if (result.length > 1 && desires.length > 2) {
                result.push(<li key={"na" + id}>+{desires.length - 2}</li>);
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
