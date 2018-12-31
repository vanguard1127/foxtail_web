import React, { Fragment, Component } from "react";
import { NavLink } from "react-router-dom";
import { Menu, message, Button } from "antd";
import { withRouter } from "react-router-dom";
import { Mutation } from "react-apollo";
import { LOGIN, FB_RESOLVE } from "../../queries";
import AccountKit from "react-facebook-account-kit";
import Signout from "../Auth/Signout";
import NoticesDropdown from "../common/NoticesDropdown";
import InboxItem from "./InboxItem";
import MyAccountItem from "./MyAccountItem";

const Navbar = ({ session, history, refetch }) => (
  <Fragment>
    {session && session.currentuser ? (
      <NavbarAuth session={session} />
    ) : (
      <NavbarUnAuth history={history} refetch={refetch} />
    )}
  </Fragment>
);

class NavbarUnAuth extends Component {
  render() {
    return (
      <Menu
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={["1"]}
        style={{ lineHeight: "64px" }}
      >
        <Menu.Item>
          <Signout />
        </Menu.Item>
      </Menu>
    );
  }
}

//TODO: check it not id and try to make recursive
class NavbarAuth extends Component {
  render() {
    let href = window.location.href.split("/");
    href = href[3].concat(href[4] ? "/" + href[4] : "");
    return (
      // <Menu
      //   theme="dark"
      //   mode="horizontal"
      //   defaultSelectedKeys={["/"]}
      //   selectedKeys={["/" + href]}
      //   style={{ lineHeight: "64px" }}
      // >
      //   <Menu.Item key="/members">
      //     <NavLink to="/members">Meet Members</NavLink>
      //   </Menu.Item>
      //   <Menu.Item key="/events">
      //     <NavLink to="/events">Go to Events</NavLink>
      //   </Menu.Item>

      //   <Menu.Item key="/editprofile">
      //     <NavLink to="/editprofile">Edit Profile</NavLink>
      //   </Menu.Item>
      //   <Menu.Item key="/settings">
      //     <NavLink to="/settings">Settings</NavLink>
      //   </Menu.Item>
      //   <Menu.Item style={{ float: "right" }}>
      //     <MyAccountItem />
      //   </Menu.Item>
      //   <Menu.Item style={{ float: "right" }}>
      //     <NoticesDropdown style={{ fontSize: "16px", color: "#08c" }} />
      //   </Menu.Item>
      //   <Menu.Item style={{ float: "right" }} key="/inbox">
      //     <InboxItem />
      //   </Menu.Item>

      //   <Signout />
      // </Menu>
      <div className="container">
        <div className="col-md-12">
          <div className="row no-gutters">
            <div className="mobile">
              <div className="mobile-menu">
                <div className="hamburger hamburger--spring">
                  <span className="hamburger-box">
                    <span className="hamburger-inner" />
                  </span>
                </div>
              </div>
              <div className="mobile-toggle">
                <ul>
                  <li>
                    <NavLink to="/members">Meet Members</NavLink>
                  </li>
                  <li>
                    <NavLink to="/events">Go to Events</NavLink>
                  </li>
                  <li>
                    <NavLink to="/inbox">Inbox</NavLink>
                  </li>
                  <li>
                    <a href="#">Becoma a Black Member</a>
                  </li>
                  <li>
                    <a href="#">My Account</a>
                  </li>
                  <li>
                    <a href="#">Add Couple Partner</a>
                  </li>
                  <li>
                    <a href="#">Logout</a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-md-5 hidden-mobile">
              <ul className="menu">
                <li className="active">
                  <NavLink to="/members">Meet Members</NavLink>
                </li>
                <li>
                  <NavLink to="/events">Go to Events</NavLink>
                </li>
              </ul>
            </div>
            <div className="col-md-2 col-12">
              <div className="logo">
                <a href="#" />
              </div>
            </div>
            <div className="col-md-5 flexible">
              <div className="function">
                <InboxItem />
                <div className="notification active">
                  <span className="icon alert">
                    <span className="count">2</span>
                  </span>
                </div>
                <div className="user hidden-mobile">
                  <MyAccountItem />
                </div>
              </div>
              <div className="toggle">
                <div className="notification">
                  <div className="item">
                    <a href="#">
                      <span className="avatar">
                        <img
                          src={
                            process.env.PUBLIC_URL +
                            "assets/img/usr/avatar/1001@2x.png"
                          }
                          alt=""
                        />
                      </span>
                      <div>
                        <span className="text">
                          You have been invited to a chat by <b>Megread</b>
                        </span>
                        <span className="when">2 hours ago</span>
                      </div>
                    </a>
                  </div>
                  <div className="item">
                    <a href="#">
                      <span className="avatar">
                        <img
                          src={
                            process.env.PUBLIC_URL +
                            "assets/img/usr/avatar/1002@2x.png"
                          }
                          alt=""
                        />
                      </span>
                      <div>
                        <span className="text">
                          You have been invited to a chat by <b>Megread</b>
                        </span>
                        <span className="when">2 hours ago</span>
                      </div>
                    </a>
                  </div>
                  <div className="item">
                    <a href="#">
                      <span className="avatar">
                        <img
                          src={
                            process.env.PUBLIC_URL +
                            "assets/img/usr/avatar/1003@2x.png"
                          }
                          alt=""
                        />
                      </span>
                      <div>
                        <span className="text">
                          You have been invited to a chat by <b>Megread</b>
                        </span>
                        <span className="when">2 hours ago</span>
                      </div>
                    </a>
                  </div>
                  <div className="item">
                    <a href="#">
                      <span className="avatar">
                        <img
                          src={
                            process.env.PUBLIC_URL +
                            "assets/img/usr/avatar/1001@2x.png"
                          }
                          alt=""
                        />
                      </span>
                      <div>
                        <span className="text">
                          You have been invited to a chat by <b>Megread</b>
                        </span>
                        <span className="when">2 hours ago</span>
                      </div>
                    </a>
                  </div>
                </div>
                <div className="dropdown hidden-mobile">
                  <ul>
                    <li>
                      <a href="#">My Account</a>
                    </li>
                    <li>
                      <a href="#">Change Password</a>
                    </li>
                    <li>
                      <a href="#">Add Couple Partner</a>
                    </li>
                    <li className="border">
                      <a href="#">Become a Black Member</a>
                    </li>
                    <li>
                      <a href="#">Logout</a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Navbar);
