import React from "react";
import ProgressiveImage from "react-progressive-image";

const Ad = ({ ad: { message, img, tinyImg, btnText, title } }) => {
  if (message === "") {
    return (
      <section className="not-found">
        <div className="container">
          <div className="col-md-12">
            <div className="icon">
              <i className="nico message" />
            </div>
            <span className="head nopad">No message found</span>
          </div>
        </div>
      </section>
    );
  }
  return (
    <div className="col-md-12">
      <div className="inbox-ads">
        <div className="content">
          <div className="ad-con">
            <ProgressiveImage src={img} placeholder={tinyImg}>
              {src => <img src={src} alt="" width="100%" height="100%" />}
            </ProgressiveImage>{" "}
          </div>
          <div className="detail-con">
            <span className="head">{title}</span>
            <span className="description">{message}</span>
            <a href="#" className="button">
              {btnText}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Ad;
