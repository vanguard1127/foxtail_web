import React, { memo } from "react";
import { withRouter, Redirect, RouteComponentProps } from "react-router-dom";
import { withTranslation, WithTranslation } from "react-i18next";

import Spinner from "components/common/Spinner";
import { ISession } from "types/user";

import NavbarAuth from "./components/NavbarAuth"

interface INavbarProps extends RouteComponentProps, WithTranslation {
  session: ISession;
  dayjs: any;
}

const Navbar: React.FC<INavbarProps> = memo(({
  session,
  history,
  tReady,
  dayjs,
  t,
}) => {
  if (!tReady) {
    return <Spinner />;
  }

  return (
    <header className="topbar">
      {session && session.currentuser ? (
        <NavbarAuth session={session} t={t} history={history} dayjs={dayjs} />
      ) : (
          <Redirect to="/" />
        )}
    </header>
  );
})

export default withTranslation("common")(withRouter(Navbar));
