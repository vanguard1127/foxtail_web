import React, { Component, Fragment } from "react";
import { withRouter } from "react-router-dom";
import { Query } from "react-apollo";
import Message from "rc-message";
import { GET_SETTINGS } from "../../queries";
import Spinner from "../common/Spinner";
import { sexOptions } from "../../docs/data";
import withAuth from "../withAuth";
import BlackMemberModal from "../common/BlackMemberModal";

import SettingsPage from "./SettingsPage";

class Settings extends Component {
  state = {
    coupleModalVisible: false,
    blkMemberModalVisible: false,
    isChanged: false,
    lang: "en",
    newDistanceMetric: null,
    lat: null,
    long: null,
    location: null
  };

  setBlkMemberModalVisible = (e, blkMemberModalVisible) => {
    e.preventDefault();
    this.setState({ blkMemberModalVisible });
    this.handleFormChange();
  };

  render() {
    const { session } = this.props;
    const { coupleModalVisible, blkMemberModalVisible, isChanged } = this.state;

    return (
      <Fragment>
        <section className="breadcrumb settings">
          <div className="container">
            <div className="col-md-12">
              <span className="head">
                <a href="#">Hello, {session.currentuser.username} 👋</a>
              </span>
              <span className="title">
                You last logged in at: 03 October 2018 13:34
              </span>
            </div>
          </div>
        </section>{" "}
        <Query query={GET_SETTINGS} fetchPolicy="network-only">
          {({ data, loading, error }) => {
            if (loading) {
              return <Spinner message="Loading..." size="large" />;
            }
            if (error) {
              return <div>{error.message}</div>;
            }
            if (!data.getSettings) {
              return <div>Error occured. Please contact support!</div>;
            }

            const settings = data.getSettings;

            return (
              <Fragment>
                {" "}
                <SettingsPage
                  settings={settings}
                  coupleModalToggle={this.toggleCouplesPopup}
                  blkMemberModalVisible={this.blkMemberModalVisible}
                />
              </Fragment>
            );
          }}
        </Query>
        {session.currentuser.blackMember && (
          <BlackMemberModal
            visible={blkMemberModalVisible}
            close={e => this.setBlkMemberModalVisible(e, false)}
            userID={session.currentuser.userID}
            refetchUser={this.props.refetch}
          />
        )}
      </Fragment>
    );
  }
}

export default withAuth(session => session && session.currentuser)(
  withRouter(Settings)
);
