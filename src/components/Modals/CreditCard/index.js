import React from "react";
import { Spring } from "react-spring/renderprops";
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
export default class PaymentForm extends React.Component {
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
      const { notifyClient, ccLast4 } = this.props;
      createSubscription()
        .then(({ data }) => {
          const msg = !ccLast4
            ? "Black Membership Activated"
            : "Credit Card Updated";
          notifyClient(msg);
          this.clearState();
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
      <Spring from={{ opacity: 0.6 }} to={{ opacity: 1 }} after={{ test: "o" }}>
        {props => (
          <div className="popup-wrapper credit-card" style={props}>
            <section className="login-modal show">
              <div className="container">
                <div className="offset-md-3 col-md-6">
                  <div className="popup">
                    <a className="close" onClick={() => close()} />
                    {!ccLast4 ? (
                      <div className="head">
                        <h1>Upgrade to Black</h1>
                        <h4>
                          Only $10 a Month. 7-Day Money Back Guarantee. Cancel
                          Anytime.*
                        </h4>
                      </div>
                    ) : (
                      <h1>Update Credit Card</h1>
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
                              placeholder="Card Number"
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
                              placeholder="First Name"
                              required
                              onChange={this.handleInputChange}
                              onFocus={this.handleInputFocus}
                            />
                          </div>
                          <div className="input col-6 form-control">
                            <input
                              type="text"
                              name="lname"
                              placeholder="Last Name"
                              required
                              onChange={this.handleInputChange}
                              onFocus={this.handleInputFocus}
                            />
                          </div>

                          <div className="input col-6 form-control">
                            <input
                              type="tel"
                              name="exp"
                              placeholder="Valid Thru"
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
                              placeholder="CVC"
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
                                    onClick={() =>
                                      this.handleSubmit(createSubscription)
                                    }
                                  >
                                    {!ccLast4 ? "UPGRADE" : "Update"}
                                  </button>
                                );
                              }}
                            </Mutation>
                            <button className="border" onClick={() => close()}>
                              Cancel
                            </button>
                          </div>
                          <div className="form-content">
                            <small>
                              *No refunds. You will not be charged after
                              cancellation.
                            </small>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}
      </Spring>
    );
  }
}
