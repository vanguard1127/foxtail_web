import React from "react";

const Footer = () => {
  return (
    <footer>
      <div className="brand">
        <div className="container">
          <div className="col-md-12">
            <div className="logo">
              <a href="#" />
            </div>
            <div className="medias">
              <ul>
                <li className="facebook">
                  <a href="#">
                    <i />
                  </a>
                </li>
                <li className="twitter">
                  <a href="#">
                    <i />
                  </a>
                </li>
                <li className="instagram">
                  <a href="#">
                    <i />
                  </a>
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
                  <a href="#">Terms & Conditions</a>
                </li>
                <li>
                  <a href="#">Privacy Policy</a>
                </li>
                <li>
                  <a href="#">Contact Us</a>
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
