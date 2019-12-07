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
    document.addEventListener("mousedown", this.handleClickOutside);
    document.addEventListener("touchstart", this.handleClickOutside);
    window.scrollTo(0, 1);
  }
  componentWillUnmount() {
    this.mounted = false;
    document.removeEventListener("mousedown", this.handleClickOutside);
    document.removeEventListener("touchstart", this.handleClickOutside);
  }

  handleClickOutside = event => {
    if (
      (this.wrapperRef && this.wrapperRef.current === event.target) ||
      event.target.className === "container"
    ) {
      if (this.props.close) {
        this.props.close();
      }
    }
  };

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
            <section className="login-modal show" ref={this.wrapperRef}>
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
                    className="dropdown wide"
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
