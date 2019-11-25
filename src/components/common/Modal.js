import React, { Component } from "react";
import { Spring } from "react-spring/renderprops";
import Spinner from "../common/Spinner";

class Modal extends Component {
  constructor(props) {
    super(props);
    this.wrapperRef = React.createRef();
  }
  shouldComponentUpdate(nextProps) {
    if (this.props.children !== nextProps.children) {
      return true;
    }
    return false;
  }
  componentDidMount() {
    if (!this.props.disableOffClick) {
      document.addEventListener("mousedown", this.handleClickOutside);
      document.addEventListener("tocuhdown", this.handleClickOutside);
    }
  }

  componentWillUnmount() {
    if (!this.props.disableOffClick) {
      document.removeEventListener("mousedown", this.handleClickOutside);
      document.removeEventListener("touchstart", this.handleClickOutside);
    }
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

  render() {
    const {
      close,
      header,
      children,
      description,
      okSpan,
      cancelSpan,
      fullWidth,
      fullScreen,
      className,
      popupClass,
      noHeader,
      noFade,
      showLoader,
      scrollable
    } = this.props;

    return (
      <Spring
        from={{ opacity: 0.6 }}
        to={{ opacity: 1 }}
        immediate={noFade}
        after={{ test: "o" }}
      >
        {props => (
          <div className="popup-wrapper" style={props}>
            <section
              style={props}
              className={`login-modal show ${
                fullScreen ? "full-screen-modal " : " "
              }${className ? className : ""}`}
              ref={this.wrapperRef}
            >
              {fullScreen ? (
                <div
                  className="container"
                  style={{ width: "100%", height: "100vh" }}
                >
                  <div>
                    <div
                      className={`popup ${popupClass ? popupClass : ""}`}
                      style={{ height: "100vh", padding: "unset" }}
                    >
                      {showLoader && <Spinner />}
                      <form className="form">
                        <div className="form-content">
                          {children}
                          {description && (
                            <span className="description">{description}</span>
                          )}
                          {okSpan && <div className="submit">{okSpan}</div>}
                          {cancelSpan && (
                            <div className="submit">{cancelSpan}</div>
                          )}
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              ) : (
                <div style={fullWidth ? {} : { maxWidth: "520px" }}>
                  <div
                    className={`${
                      scrollable || fullWidth ? "popup full" : "popup"
                    }`}
                  >
                    {!noHeader && <span className="head">{header}</span>}
                    {close && <a className="close" onClick={() => close()} />}
                    <form className="form">
                      <div className="form-content">
                        {children}
                        {description && (
                          <span className="description">{description}</span>
                        )}
                        {okSpan && <div className="submit">{okSpan}</div>}
                        {cancelSpan && (
                          <div className="submit">{cancelSpan}</div>
                        )}
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </section>
          </div>
        )}
      </Spring>
    );
  }
}

export default Modal;
