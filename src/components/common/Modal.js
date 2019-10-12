import React, { Component } from "react";
import { Spring } from "react-spring/renderprops";

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
      maxWidth,
      maxHeight
    } = this.props;

    return (
      <Spring from={{ opacity: 0.6 }} to={{ opacity: 1 }}>
        {props => (
          <div className="popup-wrapper">
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
                    {/* <span className="head">{header}</span> */}
                    {/* <a
                  className="close close-fullscreen-popup"
                  onClick={() => close()}
                /> */}
                    <form>
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
              <div
                className={fullWidth ? "" : "col-md-6"}
                style={fullWidth ? {} : { maxWidth: "520px" }}
              >
                <div
                  className={`${fullWidth ? "popup full" : "popup"} ${
                    maxWidth ? "max-width" : ""
                  } ${maxHeight ? "max-height" : ""}`}
                >
                  {!noHeader && <span className="head">{header}</span>}
                  {close && <a className="close" onClick={() => close()} />}
                  <form>
                    <div className="form-content">
                      {children}
                      {description && (
                        <span className="description">{description}</span>
                      )}
                      {okSpan && <div className="submit">{okSpan}</div>}
                      {cancelSpan && <div className="submit">{cancelSpan}</div>}
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
