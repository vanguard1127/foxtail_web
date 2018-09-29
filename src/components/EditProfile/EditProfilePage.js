import React, { Component } from "react";
import PhotoGrid from "./PhotoGrid";
import MultiSelectDropdown from "../MultiSelectDropdown";
import withAuth from "../withAuth";
import { Query } from "react-apollo";
import { GET_MY_PROFILE } from "../../queries";
import { Input, Button, Icon } from "antd";

const { TextArea } = Input;

const options = [
  { value: "cuddling", label: "Cuddling" },
  { value: "cooking", label: "Cooking" },
  { value: "flirting", label: "Flirting" }
];

class EditProfile extends Component {
  state = {
    desires: []
  };

  handleChangeSelect = value => {
    this.setState({ desires: value });
  };

  render() {
    return (
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
                    value={this.state.desires}
                    options={options}
                    style={{ width: "100%" }}
                  />
                  Bio:
                  <TextArea rows={4} />
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
                  <Button size="large" style={{ margin: "10px" }}>
                    Find Members Nearby <Icon type="search" />
                  </Button>
                </div>
              </div>
            </div>
          );
        }}
      </Query>
    );
  }
}

export default withAuth(session => session && session.currentuser)(EditProfile);
