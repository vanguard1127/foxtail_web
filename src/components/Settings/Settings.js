import React, { Component, Fragment } from "react";
import { withRouter, Prompt } from "react-router-dom";
import { Mutation, Query } from "react-apollo";
import { UPDATE_SETTINGS, GET_SETTINGS } from "../../queries";
import Spinner from "../common/Spinner";
import { sexOptions } from "../../docs/data";
import withAuth from "../withAuth";
import CoupleModal from "../common/CoupleModal";
import BlackMemberModal from "../common/BlackMemberModal";

import DistanceSlider from "../common/DistanceSlider";
import InterestedInDropdown from "../common/InterestedInDropdown";
import AgeRange from "../common/AgeRange";
import AddressSearch from "../common/AddressSearch";

import {
  Form,
  Input,
  Switch,
  Slider,
  Button,
  Icon,
  Tooltip,
  Radio,
  Select,
  message
} from "antd";

const milesToKilometers = miles => miles / 0.621371;
const kilometersToMiles = kilometers => kilometers * 0.621371;
const Option = Select.Option;
const FormItem = Form.Item;

class SettingsForm extends Component {
  state = {
    coupleModalVisible: false,
    blkMemberModalVisible: false,
    isChanged: false,
    lang: "en",
    newDistanceMetric: null
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
            message.success("Settings have been saved");
          } else {
            message.error("Error saving settings. Please contact support.");
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

  render() {
    const { getFieldDecorator } = this.props.form;
    const { session } = this.props;
    const { coupleModalVisible, blkMemberModalVisible, isChanged } = this.state;
    let { lang } = this.state;

    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 }
    };
    return (
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

          if (Object.keys(this.props.form.getFieldsValue()).length !== 0) {
            settings = this.props.form.getFieldsValue();
          } else {
            settings = data.getSettings;
            lang = data.getSettings.lang;
          }
          const initialDistanceMetric = data.getSettings.distanceMetric;
          const {
            location,
            visible,
            newMsgNotify,
            emailNotify,
            showOnline,
            likedOnly,
            vibrateNotify,
            couplePartner,
            distance,
            distanceMetric,
            ageRange,
            interestedIn
          } = settings;

          console.log(
            distance,
            settings.distanceMetric,
            data.getSettings.distanceMetric
          );
          const convertFunction =
            "mi" === distanceMetric ? kilometersToMiles : milesToKilometers;
          // The input uses original metric
          // But displays and sends the selected metric
          let convertedDistance = distance;
          if (distanceMetric !== initialDistanceMetric) {
            convertedDistance = Math.floor(convertFunction(distance));
          }
          console.log("d1", distance, "d2", convertedDistance, distanceMetric);
          return (
            <Mutation
              mutation={UPDATE_SETTINGS}
              variables={{
                distance: convertedDistance,
                distanceMetric,
                ageRange,
                interestedIn,
                location,
                visible,
                newMsgNotify,
                lang,
                emailNotify,
                showOnline,
                likedOnly,
                vibrateNotify
              }}
            >
              {(updateSettings, { loading }) => {
                // The input always uses the first metric it was given
                // And sends a transformed metric if the user changed it
                const initialDistanceSliderMax =
                  initialDistanceMetric === "mi"
                    ? 100
                    : Math.floor(milesToKilometers(100));

                const distanceSliderMax =
                  distanceMetric === "mi"
                    ? 100
                    : Math.floor(milesToKilometers(100));
                return (
                  <Fragment>
                    <section className="breadcrumb settings">
                      <div className="container">
                        <div className="col-md-12">
                          <span className="head">
                            <a href="#">Hello, John Locke 👋</a>
                          </span>
                          <span className="title">
                            You last logged in at: 03 October 2018 13:34
                          </span>
                        </div>
                      </div>
                    </section>
                    <section className="settings">
                      <div className="container">
                        <div className="col-md-12">
                          <div className="row">
                            <div className="col-md-12 col-lg-3">
                              <div className="sidebar">
                                <div className="profile-picture-content">
                                  <div className="picture">
                                    <input
                                      type="file"
                                      className="filepond upload-avatar"
                                      name="filepond"
                                    />
                                  </div>
                                </div>

                                <div className="menu">
                                  <ul>
                                    <li className="active">
                                      <a href="#">My Account</a>
                                    </li>
                                    <li>
                                      <a href="#">Add Couple Partner</a>
                                    </li>
                                    <li>
                                      <a href="#">Become a Black Member</a>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-12 col-lg-9">
                              <div className="page mtop">
                                <div className="form">
                                  <div className="content">
                                    <div className="row">
                                      <div className="col-md-12">
                                        <span className="heading">
                                          My Search Preferences
                                        </span>
                                      </div>
                                      <div className="col-md-6">
                                        <DistanceSlider
                                          value={distance}
                                          setValue={el =>
                                            this.setValue({
                                              name: "distance",
                                              value: el
                                            })
                                          }
                                        />
                                      </div>
                                      <div className="col-md-6">
                                        <AgeRange
                                          value={ageRange}
                                          setValue={el =>
                                            this.setValue({
                                              name: "ageRange",
                                              value: el
                                            })
                                          }
                                        />
                                      </div>

                                      <div className="col-md-12">
                                        <div className="item">
                                          <div className="dropdown">
                                            <select
                                              className="js-example-basic-single"
                                              name="states[]"
                                            >
                                              <option>Mile</option>
                                              <option>KM</option>
                                            </select>
                                            <label>Distance Metric</label>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="col-md-6">
                                        <InterestedInDropdown
                                          setValue={el =>
                                            this.setValue({
                                              name: "interestedIn",
                                              value: el
                                            })
                                          }
                                          value={interestedIn}
                                          placeholder={"Gender(s):"}
                                        />
                                      </div>
                                      <div className="col-md-6">
                                        <div className="item">
                                          <AddressSearch
                                            style={{ width: 150 }}
                                            setLocationValues={
                                              this.setLocationValues
                                            }
                                            address={location}
                                            type={"(cities)"}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="content mtop">
                                    <div className="row">
                                      <div className="col-md-12">
                                        <span className="heading">
                                          Public Photos{" "}
                                          <i>(No nudity please)</i>
                                        </span>
                                      </div>
                                      <div className="col-md-12">
                                        <input
                                          type="file"
                                          className="filepond public"
                                          name="filepond"
                                          multiple
                                          data-max-file-size="3MB"
                                          data-max-files="3"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                  <div className="content mtop">
                                    <div className="row">
                                      <div className="col-md-12">
                                        <span className="heading">
                                          Private Photos{" "}
                                          <i>
                                            - (Nudity is OK. Will only show to
                                            matches.)
                                          </i>
                                        </span>
                                      </div>
                                      <div className="col-md-12">
                                        <input
                                          type="file"
                                          className="filepond private"
                                          name="filepond"
                                          multiple
                                          data-max-file-size="3MB"
                                          data-max-files="3"
                                        />
                                        >
                                      </div>
                                    </div>
                                  </div>
                                  <div className="content">
                                    <div className="row">
                                      <div className="col-md-12">
                                        <span className="heading">
                                          My Profile
                                        </span>
                                      </div>
                                      <div className="col-md-12">
                                        <div className="item">
                                          <div className="select_desires desires_select_popup">
                                            <span className="head">
                                              Desires select:
                                            </span>
                                            <ul className="selected">
                                              <li>Flirting</li>
                                              <li>Dating</li>
                                            </ul>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="col-md-12">
                                        <div className="item">
                                          <div className="textarea">
                                            <textarea>
                                              It is a long established fact that
                                              a reader will be distracted by the
                                              readable content of a page when
                                              looking at its layout. The point
                                              of using Lorem Ipsum is that it
                                              has a more-or-less normal
                                              distribution of letters, as
                                              opposed to using 'Content here,
                                              content here', making it look like
                                              readable English.
                                            </textarea>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="content mtop">
                                    <div className="row">
                                      <div className="col-md-12">
                                        <span className="heading">
                                          Verifications{" "}
                                          <i>
                                            - (Verified members get more
                                            responses)
                                          </i>
                                        </span>
                                      </div>
                                      <div className="col-md-12">
                                        <div className="verification-box">
                                          <span className="head">
                                            Photo Verification
                                          </span>
                                          <span className="title">
                                            It is a long established fact that a
                                            reader will be…
                                          </span>
                                          <a
                                            href="#"
                                            className="clickverify-btn photo"
                                          >
                                            Click Verification
                                          </a>
                                        </div>
                                      </div>
                                      {/* <div className="col-md-6">
                                            <div className="verification-box">
                                                <span className="head">STD Verification</span>
                                                <span className="title">It is a long established fact that a reader will be…</span>
                                                <a href="#" className="clickverify-btn">Click Verification</a>
                                            </div>
                                        </div> */}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>
                    <CoupleModal
                      visible={coupleModalVisible}
                      close={() => this.setCoupleModalVisible(false)}
                      setPartnerID={this.setPartnerID}
                      username={
                        this.props.form.getFieldValue("couplePartner") !==
                        "Add Partner"
                          ? this.props.form.getFieldValue("couplePartner")
                          : null
                      }
                    />
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
              }}
            </Mutation>
          );
        }}
      </Query>
    );
  }
}

const Settings = Form.create()(SettingsForm);

export default withAuth(session => session && session.currentuser)(
  withRouter(Settings)
);
