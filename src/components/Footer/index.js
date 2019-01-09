import React from "react";

const Footer = () => {
  return (
    <footer>
      <div className="brand">
        <div className="container">
          <div className="col-md-12">
            <div className="logo">
              <span />
            </div>
            <div className="medias">
              <ul>
                <li className="facebook">
                  <span>
                    <i />
                  </span>
                </li>
                <li className="twitter">
                  <span>
                    <i />
                  </span>
                </li>
                <li className="instagram">
                  <span>
                    <i />
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="copyright">
        <div className="container">
          <div className="col-md-12">
            <span className="text">
              © 2018 - 2019 Foxtail App Inc. Registered in one or more
              countries.
            </span>
            <div className="menu">
              <ul>
                <li>
                  <span>Terms & Conditions</span>
                </li>
                <li>
                  <span>Privacy Policy</span>
                </li>
                <li>
                  <span>Contact Us</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
