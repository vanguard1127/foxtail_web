import React from "react";

const Header = ({ close }) => {
  return (
    <div className="m-head">
      <span className="heading">Couple Profile Management</span>
      <span className="title">
        It is a long established fact that a reader will be distracted by the
        readable
      </span>
      <a className="close" onClick={() => close()} />
    </div>
  );
};

export default Header;
