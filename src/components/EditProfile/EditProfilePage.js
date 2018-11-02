import React, { Component } from "react";
import PhotoGrid from "./PhotoGrid";
import withAuth from "../withAuth";
import { withRouter } from "react-router-dom";
import { Query, Mutation } from "react-apollo";
import { GET_MY_PROFILE, UPDATE_PROFILE } from "../../queries";
import { Input, Button, Icon, Select, Col } from "antd";
import { desireOptions } from "../../docs/data";
import EditCanvasImage from './EditCanvasImage';

const { TextArea } = Input;
const Option = Select.Option;

const initialState = {
  desires: [],
  about: ""
};

class EditProfile extends Component {
  state = { ...initialState };

  clearState = () => {
    this.setState({ ...initialState });
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
        this.props.history.push("/search");
      })
      .catch(e => console.log(e.message));
  };

  handleChange = event => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  render() {
    const { desires, about } = this.state;
    return (
      <Mutation
        mutation={UPDATE_PROFILE}
        variables={{
          about,
          desires
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
                  <Col span={6}>
                    <EditCanvasImage/>
                  </Col>
                  <Col span={6} offset={3}>
                    <PhotoGrid photos={photos} />
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
                  </Col>
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
