import React, { Component } from "react";
import PhotoGrid from "./PhotoGrid";
import MultiSelectDropdown from "../MultiSelectDropdown";
import withAuth from "../withAuth";
import { withRouter } from "react-router-dom";
import { Query, Mutation } from "react-apollo";
import { GET_MY_PROFILE, UPDATE_PROFILE } from "../../queries";
import { Input, Button, Icon } from "antd";

const { TextArea } = Input;

const options = [
  { value: "cuddling", label: "Cuddling" },
  { value: "cooking", label: "Cooking" },
  { value: "dating", label: "Dating" },
  { value: "flirting", label: "Flirting" }
];

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
                  <div className="centerColumn">
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
                      <MultiSelectDropdown
                        name="desires"
                        placeholder="Interested In"
                        handleChange={this.handleChangeSelect}
                        options={options}
                        style={{ width: "100%" }}
                        defaultValue={data.getMyProfile.desires}
                      />
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
