import React, { PureComponent } from "react";
import { LINK_PROFILE, GET_SETTINGS } from "../../../queries";
import { Mutation } from "react-apollo";
class IncludeMsgSlide extends PureComponent {
  render() {
    const {
      includeMsgs,
      code,
      setValue,
      prev,
      close,
      handleLink,
      t
    } = this.props;

    return (
      <>
        <div> {t("includeold")}?</div>
        <br />
        <div>{t("onlychatres")}</div>
        <div style={{ padding: "20px" }}>
          {" "}
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
            <span style={{ paddingLeft: "5px" }}>{t("includemsg")}</span>
          </label>
        </div>
        <div className="submit">
          <Mutation
            mutation={LINK_PROFILE}
            refetchQueries={[{ query: GET_SETTINGS }]}
            variables={{
              code
            }}
          >
            {(linkProfile, { loading }) => (
              <span
                disabled={code !== "" ? false : true}
                onClick={() => handleLink(linkProfile, close)}
                className="color"
              >
                {t("Link")}
              </span>
            )}
          </Mutation>
          <span
            className="border"
            disabled={code !== "" ? false : true}
            onClick={() => prev()}
          >
            {t("Back")}
          </span>
        </div>
      </>
    );
  }
}

export default IncludeMsgSlide;
