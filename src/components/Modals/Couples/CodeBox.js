import React from "react";
import { GENERATE_CODE } from "../../../queries";
import { Query } from "react-apollo";
import { EmailShareButton, EmailIcon } from "react-share";
import Spinner from "../../common/Spinner";

const CodeBox = ({ toggleIncludeMsgs, includeMsgs, setValue }) => {
  return (
    <div className="create-profile">
      <div className="couple-head">
        <span className="first">Want to create a Couple Profile? </span>
        <span className="second">
          Send this Couple's Code to your partner :
        </span>
      </div>
      <Query query={GENERATE_CODE} fetchPolicy="cache-first">
        {({ data, loading, error }) => {
          if (loading) {
            return <Spinner message="Loading..." size="large" />;
          }
          if (!data.generateCode) {
            return <div>Error has occured. Please contact support</div>;
          }
          const code = data.generateCode;
          return (
            <span>
              <div className="code">{code}</div>

              <div className="choose-box">
                <div className="select-checkbox">
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
                </div>
              </div>
              <EmailShareButton
                url={code}
                subject={"Join me on Foxtail as a couple."}
                body={
                  "Join me on Foxtail as a couple. Check out more details here:" +
                  code +
                  " (This code expires in 3 days)"
                }
                className="Demo__some-network__share-button"
              >
                <EmailIcon size={32} round />
              </EmailShareButton>
            </span>
          );
        }}
      </Query>
    </div>
  );
};

export default CodeBox;
