import React, { useState } from "react";
import MyAccountMenu from "./MyAccountMenu";
import Menu from "../common/Menu";
const NoProfileImg = require("../../assets/img/elements/no-profile.png");

const MyAccountItem = ({ currentuser, setRef, t }) => {
  const [proPic, setPropic] = useState(
    currentuser ? currentuser.profilePic : null
  );

  return (
    <Menu
      menuOpener={
        <div data-name="myaccount" ref={setRef} style={{ display: "flex" }}>
          <span className="avatar">
            <img
              src={proPic}
              alt=""
              onError={() => {
                setPropic(NoProfileImg);
              }}
            />
          </span>
          {currentuser.coupleProfileName ? (
            <span className="username" title={currentuser.coupleProfileName}>
              {currentuser.coupleProfileName}
            </span>
          ) : (
            <span className="username" title={currentuser.username}>
              {currentuser.username}
            </span>
          )}
        </div>
      }
    >
      <MyAccountMenu
        isCouple={currentuser.coupleProfileName !== null ? true : false}
        isBlack={currentuser.blackMember.active ? true : false}
        t={t}
      />
    </Menu>
  );
};

export default MyAccountItem;
