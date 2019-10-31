import React, { PureComponent } from "react";
import FirebaseAuth from "../../Landing/FirebaseAuth";

const initialState = {
  csrf: "",
  code: ""
};
class ConfirmPhoneButton extends PureComponent {
  state = { ...initialState };
  componentDidMount() {
    this.mounted = true;
  }
  componentWillUnmount() {
    this.mounted = false;
  }
  
  render() {
    const { csrf, code, lang } = this.state;
    const { t, token, phone, sendConfirmationMessage } = this.props;
    return (
      <span className="color" onClick={()=>{
        sendConfirmationMessage();
      }}>
      {t("sendvcode")}
    </span>
      
    );
  }
}

export default ConfirmPhoneButton;
