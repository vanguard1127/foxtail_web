import React, { Component } from 'react';

class Modal extends Component {
  constructor(props) {
    super(props);
    this.wrapperRef = React.createRef();
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  handleClickOutside = event => {
    if (this.wrapperRef && this.wrapperRef.current === event.target) {
      this.props.close();
    }
  };

  render() {
    const {
      close,
      header,
      children,
      description,
      okSpan,
      cancelSpan
    } = this.props;

    return (
      <section className="login-modal show" ref={this.wrapperRef}>
        <div className="container">
          <div className="offset-md-3 col-md-6">
            <div className="popup">
              <span className="head">{header}</span>
              <a className="close" onClick={() => close()} />
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
        </div>
      </section>
    );
  }
}

export default Modal;
