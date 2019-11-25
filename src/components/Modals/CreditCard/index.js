import React from "react";
import { Spring } from "react-spring/renderprops";
import "react-credit-cards/es/styles-compiled.css";
import "./CreditCard.css";
import Dropdown from "../../common/Dropdown";
import CCForm from "./CCForm";
import ShareForm from "./ShareForm";

export default class PaymentForm extends React.Component {
  state = {
    type: "share"
  };
  componentDidMount() {
    this.mounted = true;
  }
  componentWillUnmount() {
    this.mounted = false;
  }

  setValue = ({ name, value }) => {
    if (this.mounted) {
      this.setState({ [name]: value });
    }
  };

  render() {
    let body;
    const { toggleSharePopup, t, lang } = this.props;
    const { type } = this.state;
    switch (type) {
      case "share":
        body = (
          <ShareForm {...this.props} toggleSharePopup={toggleSharePopup} />
        );
        break;
      default:
        body = <CCForm {...this.props} />;
        break;
    }
    return (
      <Spring from={{ opacity: 0.6 }} to={{ opacity: 1 }} after={{ test: "o" }}>
        {props => (
          <div className="popup-wrapper credit-card" style={props}>
            <section className="login-modal show">
              <div className="container">
                <div className="offset-md-3 col-md-6">
                  <Dropdown
                    name="type"
                    value={type}
                    type="payType"
                    onChange={e => {
                      this.setValue({
                        name: "type",
                        value: e.value
                      });
                    }}
                    placeholder={t("paylbl")}
                    lang={lang}
                  />
                  {body}
                </div>
              </div>
            </section>
          </div>
        )}
      </Spring>
    );
  }
}
