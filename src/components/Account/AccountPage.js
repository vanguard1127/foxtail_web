import React from "react";
import MyProfileInfo from "./MyProfileInfo";
import MyUserInfo from "./MyUserInfo";
import withAuth from "../withAuth";

const AccountPage = ({ session }) => (
  <div>
    <MyProfileInfo />
    <MyUserInfo />
  </div>
);

export default withAuth(session => session && session.currentuser)(AccountPage);
