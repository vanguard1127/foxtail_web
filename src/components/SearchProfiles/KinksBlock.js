import React, { Component } from "react";
import { Context } from "./SearchProfilesPage";
class KinksBlock extends Component {
  shouldComponentUpdate(nextProps) {
    if (this.props.t !== nextProps.t) {
      return true;
    }
    return false;
  }

  render() {
    const { kinks, t, id } = this.props;
    return (
      <Context.Consumer>
        {({ kinkOptions }) => (
          <span className="interest">
            <ul>
              {kinks.reduce(function(result, kink) {
                if (result.length < 2) {
                  if (kinkOptions.find(el => el.value === kink)) {
                    const kinkLbl = t(
                      kinkOptions.find(el => el.value === kink).label
                    );
                    result.push(
                      <li key={kink} title={kinkLbl}>
                        {kinkLbl}
                      </li>
                    );
                    if (result.length > 1 && kinks.length > 2) {
                      result.push(
                        <li key={"na" + id}>+{kinks.length - 2}</li>
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

export default KinksBlock;
