import React from "react";

const Ad = ({
  t,
  ad: { message, img, link, btnText, title },
  goToBlk,
  goToCpl
}) => {
  if (message === "") {
    return (
      <section className="not-found">
        <div className="container">
          <div className="col-md-12">
            <div className="icon">
              <i className="nico message" />
            </div>
            <span className="head nopad">{t("nomsgs")}</span>
          </div>
        </div>
      </section>
    );
  }
  let callback = null;
  if (link === "blk") {
    callback = goToBlk;
  } else if (link === "cpl") {
    callback = goToCpl;
  }
  return (
    <div className="col-md-12">
      <div className="inbox-ads">
        <div className="content">
          <div className="ad-con">
            <img
              src={process.env.REACT_APP_S3_BUCKET_URL + "creatives/" + img}
              alt=""
              width="100%"
              height="100%"
            />
          </div>
          <div className="detail-con">
            <span className="head">{title}</span>
            <span className="description">{message}</span>
            <span href="#" className="button" onClick={callback}>
              {btnText}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Ad;
