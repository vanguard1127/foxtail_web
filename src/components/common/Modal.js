import React from 'react';

const Modal = ({ close, header, children, description, okSpan }) => {
  return (
    <section className="login-modal show">
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
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Modal;
