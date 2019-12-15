import React, { Fragment, Component, PureComponent } from "react";
import { withRouter } from "react-router-dom";
import { withTranslation } from "react-i18next";
import Spinner from "../common/Spinner";
import NavbarAuth from "./NavbarAuth";
class Navbar extends Component {
  shouldComponentUpdate(nextProps) {
    const { session, location } = this.props;
    if (session) {
      if (nextProps.session === undefined) {
        return true;
      }
      if (session.currentuser && nextProps.session.currentuser) {
        if (
          session.currentuser.username !==
            nextProps.session.currentuser.username ||
          session.currentuser.userID !== nextProps.session.currentuser.userID ||
          session.currentuser.profilePic !==
            nextProps.session.currentuser.profilePic
        ) {
          return true;
        }
      }
    }
    if (
      location.pathname !== nextProps.location.pathname ||
      this.props.t !== nextProps.t ||
      this.props.tReady !== nextProps.tReady
    ) {
      return true;
    }
    return false;
  }

  render() {
    const { session, history, t, tReady, dayjs } = this.props;
    if (!tReady) {
      return <Spinner />;
    }

    return (
      <Fragment>
        {session && session.currentuser ? (
          <NavbarAuth session={session} t={t} history={history} dayjs={dayjs} />
        ) : (
          history.push("/")
        )}
      </Fragment>
    );
  }
}

export default withTranslation("common")(withRouter(Navbar));
