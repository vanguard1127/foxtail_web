import React, { useState } from "react";
import CircularProgress from "@material-ui/core/CircularProgress";

import Menu from "components/common/Menu";
import NoProfileImg from "assets/img/elements/no-profile.png";

import MyAccountMenu from "./MyAccountMenu";

const MyAccountItem = ({ currentUser, t }) => {
  const [loading, setLoading] = useState(true);
  const [proPic, setPropic] = useState(currentUser.profilePic);

  return (
    <Menu
      menuOpener={
        <div data-name="myaccount" style={{ display: "flex" }}>
          <span className="avatar">
            {loading && (
              <div style={{ position: "absolute" }}>
                <CircularProgress />
              </div>
            )}
            <img
              src={currentUser.profilePic || proPic}
              onLoad={() => {
                setLoading(false);
              }}
              onError={() => {
                setLoading(false);
                setPropic(NoProfileImg);
              }}
              alt=""
            />
          </span>
          {currentUser.coupleProfileName ? (
            <span className="username" title={currentUser.coupleProfileName}>
              {currentUser.coupleProfileName}
            </span>
          ) : (
              <span className="username" title={currentUser.username}>
                {currentUser.username}
              </span>
            )}
        </div>
      }
    >
      <MyAccountMenu
        isCouple={currentUser.coupleProfileName !== null ? true : false}
        isBlack={currentUser.blackMember.active ? true : false}
        t={t}
      />
    </Menu>
  );
};

export default MyAccountItem;
