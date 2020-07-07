import React from "react";
import { WithT } from "i18next";

interface IAd {
  img: string;
  message: string;
  btnText: string;
  link: string;
  title: string;
}

interface IAdProps extends WithT {
  ad: IAd,
  goToBlk: () => void,
  goToCpl: () => void,
}

const Ad: React.FC<IAdProps> = ({
  ad: { message, img, link, btnText, title },
  goToBlk,
  goToCpl,
  t,
}) => {
  if (!message) {
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
  const callback = link === 'blk' ? goToBlk : link === 'cpl' ? goToCpl : () => { };
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
            <span className="button" onClick={callback}>
              {btnText}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Ad;
