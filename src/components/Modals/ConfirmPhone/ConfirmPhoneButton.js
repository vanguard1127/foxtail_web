import React, { PureComponent } from "react";

class ConfirmPhoneButton extends PureComponent {
  componentDidMount() {
    this.mounted = true;
  }
  componentWillUnmount() {
    this.mounted = false;
  }

  render() {
    const { t, sendConfirmationMessage } = this.props;
    return (
      <span className="color" onClick={sendConfirmationMessage}>
        {t("sendvcode")}
      </span>
    );
  }
}

export default ConfirmPhoneButton;
