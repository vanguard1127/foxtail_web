import React, { Component } from "react";
import PhotoGrid from "./PhotoGrid";
import withAuth from "../withAuth";
import { withRouter } from "react-router-dom";
import { Query, Mutation } from "react-apollo";
import { GET_MY_PROFILE, UPDATE_PROFILE } from "../../queries";
import { Input, Button, Icon, message, Form } from "antd";
import { desireOptions, s3url } from "../../docs/data";
import Spinner from "../common/Spinner";
import PhotoVerModal from "../common/PhotoVerModal";
import STDVerModal from "../common/STDVerModal";
import DesiresTransfer from "../Desire/DesiresTransfer";
import CoupleModal from "../common/CoupleModal";

const { TextArea } = Input;
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 15 }
};

const initialState = {
  publicPhotoList: [],
  privatePhotoList: [],
  photoVerModalVisible: false,
  stdVerModalVisible: false,
  coupleModalVisible: false
};

class EditProfileForm extends Component {
  constructor(props) {
    super(props);

    const { couple } = this.props.match.params;
    this.state = { ...initialState, isCouple: couple };
  }
  componentDidMount() {
    if (this.props.location.state) {
      message.warn(this.props.location.state.alert);
    }
  }
  clearState = () => {
    this.setState({ ...initialState });
  };

  setCoupleModalVisible = coupleModalVisible => {
    this.setState({ coupleModalVisible });
  };

  validateForm = () => {
    const { publicPhotoList } = this.state;

    const isInvalid = publicPhotoList.length === 0;

    return isInvalid;
  };

  setPhotoVerModalVisible = photoVerModalVisible => {
    this.setState({ photoVerModalVisible });
  };

  setSTDVerModalVisible = stdVerModalVisible => {
    this.setState({ stdVerModalVisible });
  };

  handlePhotoListChange = (fileList, isPrivate) => {
    const cleanfileList = fileList.map(file => {
      file.url = file.url.replace(s3url, "");
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
      file.url = s3url + file.url;
      return file;
    });
  };

  handleDesireSelect = value => {
    this.props.form.setFieldsValue({ desires: value });
  };

  handleSubmit = ({ e, updateProfile, refetch, about }) => {
    e.preventDefault();
    const { isCouple } = this.state;
    this.props.form.validateFields((err, values) => {
      if (err) {
        return;
      }

      updateProfile()
        .then(async ({ data }) => {
          if (data.updateProfile) {
            message.success("Settings have been saved");
          } else {
            message.error("Error saving settings. Please contact support.");
          }
          //TODO: use data to alter search...Possible <redirect state></redirect>
          await refetch();
          console.log(this.props);
          await this.props.refetch();
          console.log("DONE");
        })
        .then(() => {
          if (isCouple === "couple") {
            this.setCoupleModalVisible(true);
          } else if (about === "") {
            this.props.history.push("/members");
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
    const { isCouple } = this.state;

    const {
      publicPhotoList,
      privatePhotoList,
      photoVerModalVisible,
      stdVerModalVisible,
      coupleModalVisible
    } = this.state;
    return (
      <Query query={GET_MY_PROFILE}>
        {({ data, loading, error, refetch }) => {
          if (loading) {
            return <Spinner message="Loading..." size="large" />;
          }

          if (!data.getMyProfile) {
            return <div>An error has occured. Please contact support!</div>;
          }

          const { users, photos, about, desires } = data.getMyProfile;
          const myUser = users.find(
            user => user.username === this.props.session.currentuser.username
          );

          const needPics =
            photos[0].url === "x" && publicPhotoList.length === 0;
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
                      onSubmit={e =>
                        this.handleSubmit({ e, updateProfile, refetch, about })
                      }
                    >
                      <FormItem
                        {...formItemLayout}
                        label={" "}
                        colon={false}
                        validateStatus={needPics ? "error" : ""}
                        help={
                          needPics &&
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
                          <DesiresTransfer
                            chosen={this.props.form.getFieldValue("desires")}
                            selectDesires={this.handleDesireSelect}
                          />
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
                          <Button
                            disabled={myUser.verifications.photo}
                            onClick={() => this.setPhotoVerModalVisible(true)}
                          >
                            Photo Verify
                          </Button>
                          <Button
                            disabled={myUser.verifications.std}
                            onClick={() => this.setSTDVerModalVisible(true)}
                          >
                            STD Verify
                          </Button>
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
                    <PhotoVerModal
                      visible={photoVerModalVisible}
                      close={() => this.setPhotoVerModalVisible(false)}
                      reason={"Submit Photo Verification"}
                    />
                    <STDVerModal
                      visible={stdVerModalVisible}
                      close={() => this.setSTDVerModalVisible(false)}
                    />
                    {isCouple === "couple" && (
                      <CoupleModal
                        visible={coupleModalVisible}
                        close={() => {
                          this.setCoupleModalVisible(false);
                          this.props.history.push("/members");
                        }}
                        setPartnerID={this.setPartnerID}
                        username={
                          this.props.form.getFieldValue("couplePartner") !==
                          "Add Partner"
                            ? this.props.form.getFieldValue("couplePartner")
                            : null
                        }
                      />
                    )}
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
