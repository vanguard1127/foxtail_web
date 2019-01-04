import React, { Fragment, Component } from "react";
import { NavLink } from "react-router-dom";
import { withRouter } from "react-router-dom";
import { Mutation } from "react-apollo";
import { LOGIN, FB_RESOLVE } from "../../queries";
import AccountKit from "react-facebook-account-kit";

import UserToolbar from "./UserToolbar";

const Navbar = ({ session, history, refetch }) => (
  <Fragment>
    {session && session.currentuser ? (
      <NavbarAuth session={session} />
    ) : (
      history.push("/")
    )}
  </Fragment>
);

//TODO: check it not id and try to make recursive
class NavbarAuth extends Component {
  componentDidMount() {
    console.log("TEST");
    window.addEventListener("beforeunload", function(event) {
      localStorage.setItem("AYY", "test");
    });
  }

  render() {
    let href = window.location.href.split("/");
    href = href[3];
    const { session } = this.props;
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
                <li className={href === "members" && "active"}>
                  <NavLink to="/members">Meet Members</NavLink>
                </li>
                <li className={href === "events" && "active"}>
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
              {session.currentuser !== undefined && (
                <UserToolbar currentuser={session.currentuser} href={href} />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Navbar);
