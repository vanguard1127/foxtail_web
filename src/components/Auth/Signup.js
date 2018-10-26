import React from "react";
import moment from "moment";
import { withRouter } from "react-router-dom";
import { Mutation } from "react-apollo";
import { CREATE_USER, FB_RESOLVE } from "../../queries";
import Error from "../Error";
import AccountKit from "react-facebook-account-kit";
import MultiSelect from "../MultiSelect";
import { Button, DatePicker, Input, Checkbox, Icon } from "antd";
import { sexOptions } from "../../docs/data";

const ButtonGroup = Button.Group;

const initialState = {
  username: "",
  email: "",
  phone: "",
  dob: "",
  interestedIn: [],
  gender: "",
  iscouple: false,
  csrf: "",
  code: ""
};

class Signup extends React.Component {
  state = { ...initialState };

  clearState = () => {
    this.setState({ ...initialState });
  };

  handleChange = event => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  onChangeDate = (date, dateString) => {
    this.setState({ dob: dateString });
  };

  handleChangeSelect = value => {
    this.setState({ interestedIn: value });
  };

  handleFBReturn = ({ state, code }, fbResolve, createUser) => {
    this.setState({
      csrf: state,
      code
    });
    fbResolve().then(({ data }) => {
      this.setState({ phone: data.fbResolve });
      createUser().then(async ({ data }) => {
        localStorage.setItem("token", data.createUser.token);
        //    await this.props.refetch();
        this.clearState();
        this.props.history.push("/editprofile");
      });
    });
  };

  validateForm = () => {
    const { username, email, dob, interestedIn, gender } = this.state;

    const isInvalid = !username || !email || !dob || !interestedIn || !gender;

    return isInvalid;
  };

  render() {
    const {
      username,
      email,
      dob,
      interestedIn,
      gender,
      iscouple,
      csrf,
      code,
      phone
    } = this.state;

    return (
      <div className="centerColumn fullHeight">
        <h2 className="App">Become a Foxtail Member</h2>{" "}
        <Mutation mutation={FB_RESOLVE} variables={{ csrf, code }}>
          {(fbResolve, { data, loading, error }) => {
            return (
              <Mutation
                mutation={CREATE_USER}
                variables={{
                  username,
                  email,
                  phone,
                  dob,
                  interestedIn,
                  gender
                }}
              >
                {(createUser, { data, loading, error }) => {
                  return (
                    <form
                      className="form"
                      onSubmit={event => event.preventDefault()}
                      style={{
                        ...this.props.formStyle,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-around"
                      }}
                    >
                      <Input
                        placeholder="Name"
                        name="username"
                        onChange={this.handleChange}
                        value={username}
                      />
                      <Input
                        placeholder="Email"
                        name="email"
                        onChange={this.handleChange}
                        value={email}
                      />
                      <DatePicker
                        onChange={this.onChangeDate}
                        defaultValue={
                          dob
                            ? moment({ dob })
                            : moment(
                                new Date().setFullYear(
                                  new Date().getFullYear() - 18
                                )
                              )
                        }
                      />
                      <div className="itemRow">
                        <p>Gender:</p>
                        <ButtonGroup
                          onClick={this.handleChange}
                          selected={gender}
                        >
                          <Button
                            type="primary"
                            icon="man"
                            size="large"
                            name="gender"
                            value="M"
                          />
                          <Button
                            type="primary"
                            icon="woman"
                            size="large"
                            name="gender"
                            value="F"
                          />
                          <Button
                            type="primary"
                            icon="cloud-download"
                            size="large"
                            name="gender"
                            value="T"
                          />
                        </ButtonGroup>
                      </div>
                      <div>
                        <MultiSelect
                          name="interestedIn"
                          placeholder="Interested In"
                          handleChange={this.handleChangeSelect}
                          value={interestedIn}
                          options={sexOptions}
                          style={{ width: "100%" }}
                        />
                      </div>
                      <Checkbox
                        name="iscouple"
                        onChange={this.handleChange}
                        value={iscouple}
                      >
                        Are you a couple?
                      </Checkbox>

                      <AccountKit
                        appId="172075056973555" // Update this!
                        version="v1.1" // Version must be in form v{major}.{minor}
                        onResponse={resp => {
                          this.handleFBReturn(resp, fbResolve, createUser);
                        }}
                        csrf={"889306f7553962e44db6ed508b4e8266"} // Required for security
                        countryCode={"+1"} // eg. +60
                        phoneNumber={"1111116711"} // eg. 12345678
                        emailAddress={"trses@dofo.com"} // eg. me@site.com
                      >
                        {p => (
                          <div>
                            <Button
                              size="large"
                              disabled={loading || this.validateForm()}
                              {...p}
                            >
                              {" "}
                              <Icon
                                type="check-circle"
                                theme="twoTone"
                                twoToneColor="#52c41a"
                              />
                              Verify your phone number to begin
                            </Button>

                            <small>
                              <br />
                              Phone number will be used for login and not
                              marketing.
                            </small>
                          </div>
                        )}
                      </AccountKit>
                      {error && <Error error={error} />}
                    </form>
                  );
                }}
              </Mutation>
            );
          }}
        </Mutation>
      </div>
    );
  }
}

export default withRouter(Signup);
