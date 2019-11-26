import React from "react";
import Card from "react-credit-cards";
import "react-credit-cards/es/styles-compiled.css";
import {
  formatCreditCardNumber,
  formatCVC,
  formatExpirationDate
} from "../../../utils/cardformatter";
import { Mutation } from "react-apollo";
import { CREATE_SUBSCRIPTION } from "../../../queries";
import "./CreditCard.css";

const CCLogosPng = require("../../../assets/img/elements/cclogos.png");
const intialState = {
  ccnum: "",
  exp: "",
  cvc: "",
  fname: "",
  lname: "",
  number: "",
  name: "",
  expiry: "",
  issuer: "",
  focused: "",
  formData: null
};
export default class CCForm extends React.Component {
  state = {
    ...intialState
  };
  componentDidMount() {
    this.mounted = true;
  }
  componentWillUnmount() {
    this.mounted = false;
  }

  clearState = () => {
    if (this.mounted) {
      this.setState({ ...intialState });
    }
  };

  handleCallback = ({ issuer }, isValid) => {
    if (isValid) {
      this.setState({ issuer });
    }
  };

  handleInputFocus = ({ target }) => {
    this.setState({
      focused: target.name
    });
  };

  handleInputChange = ({ target }) => {
    if (target.name === "ccnum") {
      target.value = formatCreditCardNumber(target.value);
    } else if (target.name === "exp") {
      target.value = formatExpirationDate(target.value);
    } else if (target.name === "cvc") {
      target.value = formatCVC(target.value);
    }

    this.setState({ [target.name]: target.value });
  };

  handleSubmit = createSubscription => {
    if (this.mounted) {
      const { notifyClient, ccLast4, t } = this.props;
      createSubscription()
        .then(({ data }) => {
          const msg = !ccLast4
            ? t("common:Black Membership Activated")
            : t("common:Credit Card Updated");
          notifyClient(msg);
          this.clearState();
          window.location.reload(false);
        })
        .catch(res => {
          this.props.ErrorHandler.catchErrors(res.graphQLErrors);
        });
    }
  };

  render() {
    const { focused, ccnum, exp, cvc, fname, lname } = this.state;
    const { close, t, tReady, ErrorHandler, ccLast4 } = this.props;
    return (
      <div className="popup full">
        <a className="close" onClick={close} />
        {!ccLast4 ? (
          <div className="head">
            <h1>{t("Upgrade to Black")}</h1>
            <h4>
              {t(
                "Only $10 a Month. 7-Day Money Back Guarantee. Cancel Anytime.*"
              )}
            </h4>
          </div>
        ) : (
          <h1>{t("Update Credit Card")}</h1>
        )}
        <Card
          number={ccnum}
          name={fname + " " + lname}
          expiry={exp}
          cvc={cvc}
          focused={focused}
          callback={this.handleCallback}
        />
        <div className="form-container">
          <form className="form">
            <div className="form-content">
              <div className="input">
                <input
                  type="tel"
                  name="ccnum"
                  className="form-control"
                  placeholder={t("Card Number")}
                  pattern="[\d| ]{16,22}"
                  required
                  onChange={this.handleInputChange}
                  onFocus={this.handleInputFocus}
                />
                <br />
                <small>E.g.: 49..., 51..., 36..., 37...</small>
              </div>

              <div className="input col-6 form-control">
                <input
                  type="text"
                  name="fname"
                  placeholder={t("First Name")}
                  required
                  onChange={this.handleInputChange}
                  onFocus={this.handleInputFocus}
                />
              </div>
              <div className="input col-6 form-control">
                <input
                  type="text"
                  name="lname"
                  placeholder={t("Last Name")}
                  required
                  onChange={this.handleInputChange}
                  onFocus={this.handleInputFocus}
                />
              </div>

              <div className="input col-6 form-control">
                <input
                  type="tel"
                  name="exp"
                  placeholder={t("Valid Thru")}
                  pattern="\d\d/\d\d"
                  required
                  onChange={this.handleInputChange}
                  onFocus={this.handleInputFocus}
                />
              </div>

              <div className="input col-6 form-control">
                <input
                  type="tel"
                  name="cvc"
                  placeholder={t("CVC")}
                  pattern="\d{3,4}"
                  required
                  onChange={this.handleInputChange}
                  onFocus={this.handleInputFocus}
                />
              </div>
            </div>
            <div className="form-content">
              <div className="submit form-control">
                <Mutation
                  mutation={CREATE_SUBSCRIPTION}
                  variables={{ ccnum, exp, cvc, fname, lname }}
                >
                  {createSubscription => {
                    return (
                      <button
                        className="color"
                        //TODO: UNDO
                        disabled
                        // disabled={
                        //   ccnum === "" &&
                        //   exp === "" &&
                        //   cvc === "" &&
                        //   fname === "" &&
                        //   lname === ""
                        // }
                        onClick={e => {
                          e.preventDefault();
                          this.handleSubmit(createSubscription);
                        }}
                      >
                        Temporarily Unavailable
                        {/* {!ccLast4 ? t("UPGRADE") : t("Update")} */}
                      </button>
                    );
                  }}
                </Mutation>
                <button className="border cancelbtn" onClick={close}>
                  {t("Cancel")}
                </button>
              </div>
              {!ccLast4 && (
                <div>
                  <small>{t("*No refunds after 7 days.")}</small>
                  <small>
                    {t(
                      "*Couple Profiles: Both members must upgrade to upgrade the profile."
                    )}
                  </small>
                </div>
              )}
              <br />
              <div
                className="cclogos"
                style={{ backgroundImage: `url(${CCLogosPng})` }}
              />
            </div>
          </form>
        </div>
      </div>
    );
  }
}
