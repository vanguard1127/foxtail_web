import React, { Component } from "react";
import PhotoGrid from "./PhotoGrid";
import withAuth from "../withAuth";
import { withRouter } from "react-router-dom";
import { Query, Mutation } from "react-apollo";
import { GET_MY_PROFILE, UPDATE_PROFILE } from "../../queries";
import { Input, Button, Icon, Select, message, Form } from "antd";
import { desireOptions } from "../../docs/data";
import Error from "../common/Error";
import Spinner from "../common/Spinner";

const { TextArea } = Input;
const Option = Select.Option;
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 15 }
};

const initialState = {
  publicPhotoList: [],
  privatePhotoList: []
};

class EditProfileForm extends Component {
  state = { ...initialState };

  componentDidMount() {
    if (this.props.location.state) {
      message.warn(this.props.location.state.alert);
    }
  }
  clearState = () => {
    this.setState({ ...initialState });
  };

  validateForm = () => {
    const { publicPhotoList } = this.state;

    const isInvalid = publicPhotoList.length === 0;

    return isInvalid;
  };

  handlePhotoListChange = (fileList, isPrivate) => {
    const cleanfileList = fileList.map(file => {
      file.url = file.url.replace(
        "https://ft-img-bucket.s3.amazonaws.com/",
        ""
      );
      return file;
    });
    if (isPrivate) {
      this.setState({
        privatePhotoList: cleanfileList.map(file => JSON.stringify(file))
      });
    } else {
      this.setState({
        publicPhotoList: cleanfileList.map(file => JSON.stringify(file))
      });
    }
    fileList.map(file => {
      file.url = "https://ft-img-bucket.s3.amazonaws.com/" + file.url;
      return file;
    });
  };

  handleChangeSelect = value => {
    this.setState({ desires: value });
  };

  handleSubmit = (e, updateProfile, aboutTest) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (err) {
        return;
      }
      console.log("Received values of form: ", values);

      updateProfile()
        .then(({ data }) => {
          if (data.updateProfile) {
            message.success("Settings have been saved");
          } else {
            message.error("Error saving settings. Please contact support.");
          }
          //TODO: use data to alter search...
          this.clearState();
          if (aboutTest === "") {
            this.props.history.push("/search");
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
    const { getFieldDecorator } = this.props.form;
    const { publicPhotoList, privatePhotoList } = this.state;
    return (
      <Query query={GET_MY_PROFILE}>
        {({ data, loading, error }) => {
          if (loading) {
            return <Spinner message="Loading..." size="large" />;
          }
          if (error) {
            return <Error error={error} />;
          }

          const { users, photos, about, desires } = data.getMyProfile;

          return (
            <Mutation
              mutation={UPDATE_PROFILE}
              variables={{
                about: this.props.form.getFieldValue("about"),
                desires: this.props.form.getFieldValue("desires"),
                publicPhotoList,
                privatePhotoList
              }}
            >
              {(updateProfile, { loading }) => {
                return (
                  <div>
                    <h4>Edit Profile: {users.map(user => user.username)}</h4>
                    <Form
                      className="centerColumn"
                      style={{
                        display: "flex"
                      }}
                      onSubmit={e => this.handleSubmit(e, updateProfile, about)}
                    >
                      <FormItem
                        {...formItemLayout}
                        label={" "}
                        colon={false}
                        validateStatus={
                          publicPhotoList.length === 0 ? "error" : ""
                        }
                        help={
                          publicPhotoList.length === 0 &&
                          "Please upload at least 1 public image of yourself."
                        }
                      >
                        <PhotoGrid
                          photos={photos}
                          handlePhotoListChange={this.handlePhotoListChange}
                          gridStyle={{ width: "33vw" }}
                        />
                      </FormItem>
                      Desires
                      <FormItem label={""} colon={false}>
                        {getFieldDecorator("desires", {
                          rules: [
                            {
                              required: true,
                              message: "Please select at least 1 desire"
                            }
                          ],
                          initialValue: desires ? desires : []
                        })(
                          <Select
                            mode="multiple"
                            placeholder="Interested In"
                            style={{ width: "33vw" }}
                            onChange={this.handleChangeSelect}
                            currentvalue={this.props.form.getFieldValue(
                              "desires"
                            )}
                          >
                            {desireOptions.map(option => (
                              <Option key={option.value}>{option.label}</Option>
                            ))}
                          </Select>
                        )}
                      </FormItem>
                      Bio
                      <FormItem {...formItemLayout} label={""} colon={false}>
                        {getFieldDecorator("about", {
                          initialValue: about ? about : "",
                          rules: [
                            {
                              required: true,
                              message: "Please write a short bio"
                            },
                            {
                              max: 1000,
                              min: 20,
                              message:
                                "Please keep your bio between 20 and 1000 characters"
                            }
                          ]
                        })(
                          <TextArea
                            rows={4}
                            placeholder="About you"
                            style={{ width: "33vw" }}
                          />
                        )}
                      </FormItem>
                      Verifications (Verified members get more responses)
                      <FormItem {...formItemLayout} label={""} colon={false}>
                        <div style={{ width: "33vw" }}>
                          <Button>Photo Verify</Button>
                          <Button>STD Verify</Button>
                        </div>
                      </FormItem>
                      <FormItem {...formItemLayout} label={""} colon={false}>
                        <Button
                          size="large"
                          type="primary"
                          htmlType="submit"
                          style={{ margin: "10px" }}
                          disabled={loading || this.validateForm()}
                        >
                          {about === "" ? (
                            <span>
                              Find Members Nearby <Icon type="search" />
                            </span>
                          ) : (
                            "Save"
                          )}
                        </Button>
                      </FormItem>
                    </Form>
                  </div>
                );
              }}
            </Mutation>
          );
        }}
      </Query>
    );
  }
}

const EditProfile = Form.create()(EditProfileForm);

export default withAuth(session => session && session.currentuser)(
  withRouter(EditProfile)
);
