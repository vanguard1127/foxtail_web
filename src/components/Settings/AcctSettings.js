import React, { Component } from "react";
import Dialog from "../Modals/Dialog";
import ChangePhoneBtn from "./ChangePhoneBtn";
import * as yup from "yup";

//TODO:Add languages dictionary

class AcctSettings extends Component {
  state = {
    showDialog: false,
    msg: "",
    btnText: "",
    title: "",
    setting: "",
    successMsg: ""
  };
  shouldComponentUpdate(nextProps, nextState) {
    if (this.state !== nextState) {
      return true;
    }
    return false;
  }
  toggleDialog = () => {
    this.props.ErrorHandler.setBreadcrumb("Dialog Modal Toggled:");
    this.setState({ showDialog: !this.state.showDialog });
  };

  setDialogContent = ({ title, msg, btnText, setting, successMsg }) => {
    this.setState({
      title,
      msg,
      btnText,
      setting,
      successMsg,
      showDialog: !this.state.showDialog
    });
  };

  render() {
    const { ErrorHandler, t, setValue } = this.props;
    const { showDialog, title, msg, btnText, setting, successMsg } = this.state;
    let schema;
    if (setting === "email") {
      schema = yup.object().shape({
        text: yup
          .string()
          .email("Invalid email address")
          .required("Email is required!")
      });
    } else if (setting === "username") {
      schema = yup.object().shape({
        text: yup.string().required("Username is required!")
      });
    } else if (setting === "gender") {
      schema = yup.object().shape({
        text: yup.string().required("Gender is required!")
      });
    }
    return (
      <div className="content mtop">
        <div className="row">
          <div className="col-md-12">
            <span className="heading">Account Setting</span>
          </div>
          <div className="col-md-12">
            <div className="item">
              <button
                onClick={() =>
                  this.setDialogContent({
                    title: "Update Email",
                    msg:
                      "Please enter an email that you check often. We use this only for communications from Foxtail and our members.",
                    btnText: "Update",
                    setting: "email",
                    successMsg: "Please check your email for confirmation"
                  })
                }
              >
                Update Email
              </button>
            </div>
          </div>
          <div className="col-md-12">
            <div className="item">
              <ChangePhoneBtn
                t={t}
                setValue={value => setValue({ name: "phone", value })}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="item">
              <button
                onClick={() =>
                  this.setDialogContent({
                    title: "Change Username",
                    msg: "You may change your username every 30 days.",
                    btnText: "Update",
                    setting: "username",
                    successMsg: "Username has been updated Successfully"
                  })
                }
              >
                Change Username
              </button>
            </div>
          </div>
          <div className="col-md-6">
            <div className="item">
              <button
                onClick={() =>
                  this.setDialogContent({
                    title: "Change Gender",
                    msg: "You may only change your gender once!",
                    btnText: "Update",
                    setting: "gender",
                    successMsg: "Gender has been updated Successfully"
                  })
                }
              >
                Change Gender
              </button>
            </div>
          </div>
        </div>
        {showDialog && (
          <Dialog
            close={() => this.toggleDialog()}
            ErrorBoundary={ErrorHandler.ErrorBoundary}
            title={title}
            msg={msg}
            btnText={btnText}
            successMsg={successMsg}
            schema={schema}
            setValue={value => setValue({ name: setting, value })}
          />
        )}
      </div>
    );
  }
}

export default AcctSettings;
