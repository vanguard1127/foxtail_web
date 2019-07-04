import React, { PureComponent } from "react";

class LinkBox extends PureComponent {
  render() {
    const { code, handleTextChange, next, t } = this.props;

    return (
      <div className="receive-code">
        <div>
          <span className="second">{t("cplProfileDesc")}</span>
        </div>
        <br />
        <div className="couple-head">
          <div>
            <span className="first">{t("coderecv")}?</span>
            <span className="second">{t("addcode")}:</span>
          </div>
        </div>
        <div className="item nobottom">
          <div className="input">
            <input
              type="text"
              required
              id="couples_code"
              onChange={e => handleTextChange(e.target.value)}
              value={code}
            />
            <label title={t("code")} htmlFor="couples_code" />
          </div>
        </div>
        <div className="item sticky">
          <div className="button">
            <button
              disabled={code !== "" ? false : true}
              onClick={() => next()}
            >
              {t("Next")}
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default LinkBox;
