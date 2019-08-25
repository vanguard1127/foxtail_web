import React, { Component } from "react";
import { Context } from "./SearchProfilesPage";
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
      <Context.Consumer>
        {({ desireOptions }) => (
          <span className="interest">
            <ul>
              {desires.reduce(function(result, desire) {
                if (result.length < 2) {
                  if (desireOptions.find(el => el.value === desire)) {
                    const desireLbl = t(
                      desireOptions.find(el => el.value === desire).label
                    );
                    result.push(
                      <li key={desire} title={desireLbl}>
                        {desireLbl}
                      </li>
                    );
                    if (result.length > 1 && desires.length > 2) {
                      result.push(
                        <li key={"na" + id}>+{desires.length - 2}</li>
                      );
                    }
                  }
                }
                return result;
              }, [])}
            </ul>
          </span>
        )}
      </Context.Consumer>
    );
  }
}

export default DesiresBlock;
