import React from "react";
import { LINK_PROFILE } from "../../../queries";
import { Mutation } from "react-apollo";
const IncludeMsgSlide = ({
  includeMsgs,
  code,
  setValue,
  prev,
  close,
  handleLink
}) => {
  return (
    <div>
      Would you like to include you Messages and Events in this Couple Profile?
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
        <b>Include Messages and Events in Couple Profile?</b>
      </label>
      <div className="button">
        <button disabled={code !== "" ? false : true} onClick={() => prev()}>
          Back
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
            Link
          </button>
        )}
      </Mutation>
    </div>
  );
};

export default IncludeMsgSlide;
