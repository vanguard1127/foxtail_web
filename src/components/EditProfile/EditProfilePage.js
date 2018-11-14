import React, { Component } from "react";
import PhotoGrid from "./PhotoGrid";
import withAuth from "../withAuth";
import { withRouter } from "react-router-dom";
import { Query, Mutation } from "react-apollo";
import { GET_MY_PROFILE, UPDATE_PROFILE } from "../../queries";
import { Input, Button, Icon, Select } from "antd";
import { desireOptions } from "../../docs/data";

const { TextArea } = Input;
const Option = Select.Option;

const initialState = {
  desires: [],
  about: "",
  publicPhotoList: [],
  privatePhotoList: []
};

class EditProfile extends Component {
  state = { ...initialState };

  clearState = () => {
    this.setState({ ...initialState });
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
    console.log(
      "public list",
      this.state.publicPhotoList,
      "private list",
      this.state.privatePhotoList
    );
  };

  handleChangeSelect = value => {
    this.setState({ desires: value });
  };

  handleSubmit = updateProfile => {
    updateProfile()
      .then(({ data }) => {
        console.log("done", data);
        //TODO: use data to alter search...
        this.clearState();
        if (this.props.intro) {
          this.props.history.push("/search");
        }
      })
      .catch(e => console.log(e.message));
  };

  handleChange = event => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  render() {
    const { desires, about, publicPhotoList, privatePhotoList } = this.state;
    return (
      <Mutation
        mutation={UPDATE_PROFILE}
        variables={{
          about,
          desires,
          publicPhotoList,
          privatePhotoList
        }}
      >
        {(updateProfile, { data, loading, error }) => (
          <Query query={GET_MY_PROFILE}>
            {({ data, loading, error }) => {
              if (loading) {
                return <div>Loading</div>;
              }
              if (error) {
                return <div>Error</div>;
              }
              const { users, photos } = data.getMyProfile;
              return (
                <div>
                  <h4>Edit Profile: {users.map(user => user.username)}</h4>
                  <div className="centerColumn">
                    <PhotoGrid
                      photos={photos}
                      handlePhotoListChange={this.handlePhotoListChange}
                    />
                    <div
                      className="centerColumn"
                      style={{
                        width: "30vw",
                        height: "35vh",
                        justifyContent: "space-between"
                      }}
                    >
                      Desires:
                      <Select
                        mode="multiple"
                        placeholder="Interested In"
                        style={{ width: "100%" }}
                        onChange={this.handleChangeSelect}
                        defaultValue={data.getMyProfile.desires}
                      >
                        {desireOptions.map(option => (
                          <Option key={option.value}>{option.label}</Option>
                        ))}
                      </Select>
                      Bio:
                      <TextArea
                        rows={4}
                        placeholder="About you"
                        defaultValue={data.getMyProfile.about}
                        name="about"
                        onChange={this.handleChange}
                      />
                      Verifications (Verified members get more responses):
                      <div
                        style={{
                          justifyContent: "space-between",
                          display: "flex",
                          width: "45%"
                        }}
                      >
                        <Button>Photo Verify</Button>
                        <Button>STD Verify</Button>
                      </div>
                      <Button
                        size="large"
                        style={{ margin: "10px" }}
                        onClick={() => this.handleSubmit(updateProfile)}
                      >
                        Find Members Nearby <Icon type="search" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            }}
          </Query>
        )}
      </Mutation>
    );
  }
}

export default withAuth(session => session && session.currentuser)(
  withRouter(EditProfile)
);
