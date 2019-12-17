import React, { useState } from "react";
import MyAccountMenu from "./MyAccountMenu";
import Menu from "../common/Menu";
import NoProfileImg from "../../assets/img/elements/no-profile.png";
import CircularProgress from "@material-ui/core/CircularProgress";

const MyAccountItem = ({ currentuser, setRef, t }) => {
  const [loading, setLoading] = useState(true);
  const [proPic, setPropic] = useState(currentuser.profilePic);
  return (
    <Menu
      menuOpener={
        <div data-name="myaccount" ref={setRef} style={{ display: "flex" }}>
          <span className="avatar">
            {loading && (
              <div style={{ position: "absolute" }}>
                <CircularProgress />
              </div>
            )}
            <img
              src={proPic}
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
