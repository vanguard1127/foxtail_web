import React, { Component, Fragment } from "react";
import { withRouter, Prompt } from "react-router-dom";
import { Query } from "react-apollo";
import Message from "rc-message";
import { GET_SETTINGS } from "../../queries";
import Spinner from "../common/Spinner";
import { sexOptions } from "../../docs/data";
import withAuth from "../withAuth";
import CoupleModal from "../common/CoupleModal";
import BlackMemberModal from "../common/BlackMemberModal";

import MyAccountForm from "./MyAccountForm";

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

  handleSubmit = (e, updateSettings) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (err) {
        return;
      }

      updateSettings()
        .then(({ data }) => {
          if (data.updateSettings) {
            this.setState({ isChanged: false });
            Message.success("Settings have been saved");
          } else {
            Message.error("Error saving settings. Please contact support.");
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

  setLocationValues = ({ lat, long, address }) => {
    if (lat && long) {
      this.setState({ lat, long, location: address });
    } else {
      this.setState({ location: address });
    }
  };

  //tried it the clever way using the form but it doesnt save the value properly
  handleLangChange = value => {
    this.setState({ lang: value });
    this.props.form.setFieldsValue({ lang: value });
    this.handleFormChange();
  };

  handleChangeSelect = value => {
    this.props.form.setFieldsValue({ interestedIn: value });
    this.handleFormChange();
  };

  onSwitch = (value, name) => {
    this.props.form.setFieldsValue({ [name]: value });
    this.handleFormChange();
  };

  setCoupleModalVisible = coupleModalVisible => {
    this.setState({ coupleModalVisible });
  };

  setBlkMemberModalVisible = (e, blkMemberModalVisible) => {
    e.preventDefault();
    this.setState({ blkMemberModalVisible });
    this.handleFormChange();
  };

  setPartnerID = id => {
    this.props.form.setFieldsValue({ couplePartner: id });
  };

  handleFormChange = () => {
    this.setState({ isChanged: true });
  };

  setValue = ({ name, value }) => {
    this.setState({ [name]: value });
  };

  render() {
    const { session } = this.props;
    const { coupleModalVisible, blkMemberModalVisible, isChanged } = this.state;
    let { lang } = this.state;

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

            let settings;

            // if (Object.keys(this.props.form.getFieldsValue()).length !== 0) {
            //   settings = this.props.form.getFieldsValue();
            // } else {
            settings = data.getSettings;
            lang = settings.lang;
            const couplePartner = settings.couplePartner;
            //}

            return (
              <Fragment>
                {" "}
                <MyAccountForm
                  settings={settings}
                  coupleModalVisible={this.coupleModalVisible}
                  blkMemberModalVisible={this.blkMemberModalVisible}
                  isChanged={this.isChanged}
                />{" "}
                <CoupleModal
                  visible={coupleModalVisible}
                  close={() => this.setCoupleModalVisible(false)}
                  setPartnerID={this.setPartnerID}
                  username={
                    couplePartner !== "Add Partner" ? couplePartner : null
                  }
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
        <Prompt
          when={isChanged}
          message={location =>
            `Are you sure you want to leave without saving your changes?`
          }
        />
      </Fragment>
    );
  }
}

export default withAuth(session => session && session.currentuser)(
  withRouter(Settings)
);
