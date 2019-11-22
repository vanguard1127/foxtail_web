import React from "react";
import { Spring } from "react-spring/renderprops";
import "react-credit-cards/es/styles-compiled.css";
import "./CreditCard.css";
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

  render() {
    let body;
    switch (this.state.type) {
      case "share":
        body = (
          <ShareForm
            {...this.props}
            toggleSharePopup={this.props.toggleSharePopup}
          />
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
                <div className="offset-md-3 col-md-6">{body}</div>
              </div>
            </section>
          </div>
        )}
      </Spring>
    );
  }
}
