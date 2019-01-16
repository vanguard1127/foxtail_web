import React from "react";
import { LINK_PROFILE } from "../../../queries";
import { Mutation } from "react-apollo";
const IncludeMsgSlide = ({
  includeMsgs,
  code,
  setValue,
  prev,
  close,
  handleLink,
  t
}) => {
  return (
    <div>
      {t("includeold")}
      ?
      <input
        type="checkbox"
        id="cbox"
        checked={includeMsgs ? true : false}
        onChange={e => {
          setValue({
            name: "includeMsgs",
            value: !includeMsgs ? true : false
          });
        }}
      />
      <label htmlFor="cbox">
        <span />
        <b>{t("includemsg")}?</b>
      </label>
      <div className="button">
        <button disabled={code !== "" ? false : true} onClick={() => prev()}>
          {t("Back")}
        </button>
      </div>
      <Mutation
        mutation={LINK_PROFILE}
        variables={{
          code
        }}
      >
        {(linkProfile, { loading }) => (
          <button
            disabled={code !== "" ? false : true}
            onClick={() => handleLink(linkProfile, close)}
          >
            {t("Link")}
          </button>
        )}
      </Mutation>
    </div>
  );
};

export default IncludeMsgSlide;
