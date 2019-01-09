import React from "react";

const LinkBox = ({ code, handleTextChange, next }) => {
  return (
    <div className="receive-code">
      <div className="couple-head">
        <span className="first">Did you recieve a Couple's Code?</span>
        <span className="second">
          Add your Couple's Code here and click Next:
        </span>
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
          <label title="Couple's Code" htmlFor="couples_code" />
        </div>
      </div>
      <div className="item sticky">
        <div className="button">
          <button disabled={code !== "" ? false : true} onClick={() => next()}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default LinkBox;
