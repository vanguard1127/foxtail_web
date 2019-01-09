import React, { Fragment, Component } from "react";
import { NavLink } from "react-router-dom";
import { withRouter } from "react-router-dom";
import { Mutation } from "react-apollo";
import { TOGGLE_ONLINE } from "../../queries";
import AccountKit from "react-facebook-account-kit";

import UserToolbar from "./UserToolbar";

class Navbar extends Component {
  state = { online: false };

  handleToggle = (toggleOnline, online) => {
    this.setState({ online }, () => {
      toggleOnline()
        .then(async ({ data }) => {
          if (data.toggleOnline !== null) {
            await this.props.refetch();
          }
        })
        .catch(res => {
          const errors = res.graphQLErrors.map(error => {
            return error.message;
          });

          //TODO: send errors to analytics from here
          this.setState({ errors });
        });
    });
  };

  render() {
    const { session, history } = this.props;
    const { online } = this.state;

    return (
      <Fragment>
        {session && session.currentuser ? (
          <Mutation
            mutation={TOGGLE_ONLINE}
            variables={{
              online
            }}
          >
            {(toggleOnline, { data, loading, error }) => (
              <NavbarAuth
                session={session}
                toggleOnline={online => this.handleToggle(toggleOnline, online)}
              />
            )}
          </Mutation>
        ) : (
          history.push("/")
        )}
      </Fragment>
    );
  }
}

//TODO: check it not id and try to make recursive
class NavbarAuth extends Component {
  componentDidMount() {
    //TODO: Dont call if already online
    const { toggleOnline } = this.props;
    toggleOnline(true);
    window.addEventListener("beforeunload", function(event) {
      localStorage.setItem("Test", "done");
      toggleOnline(false);
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
                    <span>Becoma a Black Member</span>
                  </li>
                  <li>
                    <span>My Account</span>
                  </li>
                  <li>
                    <span>Add Couple Partner</span>
                  </li>
                  <li>
                    <span>Logout</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-md-5 hidden-mobile">
              <ul className="menu">
                <li className={href === "members" ? "active" : ""}>
                  <NavLink to="/members">Meet Members</NavLink>
                </li>
                <li className={href === "events" ? "active" : ""}>
                  <NavLink to="/events">Go to Events</NavLink>
                </li>
              </ul>
            </div>
            <div className="col-md-2 col-12">
              <div className="logo">
                <span />
              </div>
            </div>
            <div className="col-md-5 flexible">
              {session.currentuser && (
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
