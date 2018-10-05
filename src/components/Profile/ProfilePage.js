import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Query } from "react-apollo";
import { GET_PROFILE } from "../../queries";
import moment from "moment";
import ImageCarousel from "./ImageCarousel";
import DesiresList from "../Desire/DesiresList";

class ProfilePage extends Component {
  state = {
    selectedPhoto: 0
  };

  handleImageClick = event => {
    const { name } = event.target;
    this.setState({ selectedPhoto: parseInt(name, 10) });
  };

  render() {
    const { id } = this.props.match.params;
    const { selectedPhoto } = this.state;
    return (
      <Query query={GET_PROFILE} variables={{ id }}>
        {({ data, loading, error }) => {
          if (loading) {
            return <div>Loading</div>;
          }
          if (error) {
            return <div>Error: {error.message}</div>;
          }
          const { users, photos, desires, about } = data.profile;
          const publicPics = photos.slice(0, 4);
          const privatePics = photos.slice(4, 8);
          return (
            <div
              className="centerColumn"
              style={{
                display: "flex",
                flex: 1,
                padding: "20px",
                flexDirection: "column"
              }}
            >
              <div
                style={{ backgroundColor: "blue", flex: 2, display: "flex" }}
              >
                <div
                  className="leftRow"
                  style={{
                    backgroundColor: "red",
                    flexDirection: "column",
                    flex: "1",
                    display: "flex",
                    padding: "3vh"
                  }}
                >
                  {users.map((user, index) => (
                    <div key={index}>
                      {" "}
                      <strong> {user.username}</strong>,
                      {moment().diff(user.dob, "years")} {user.gender}
                      <div>
                        {" "}
                        <img
                          alt="badge"
                          src={require("../../images/badge.JPG")}
                          style={{ width: "20px", height: "20px" }}
                        />{" "}
                        STD Verified
                      </div>
                    </div>
                  ))}
                  <div
                    className="leftRow"
                    style={{ flex: 1, flexDirection: "column" }}
                  >
                    <h5>Bio:</h5>
                    <div>{about}</div>
                  </div>
                  <div
                    className="leftColumn"
                    style={{ flex: 1, flexDirection: "column" }}
                  >
                    <h5>Desires:</h5>
                    <DesiresList desires={desires} />
                  </div>
                </div>
                <div
                  className="centerColumn"
                  style={{ backgroundColor: "green" }}
                >
                  <ImageCarousel
                    photos={photos}
                    showThumbs={false}
                    autoPlay={true}
                    selectedItem={selectedPhoto}
                  />
                  <ul style={{ display: "flex" }}>
                    {publicPics.map((photo, index) => {
                      console.log(photo);
                      return (
                        <li>
                          <img
                            src={require("../../images/girl1.jpg")}
                            name={index}
                            alt={index}
                            key={index}
                            onClick={this.handleImageClick}
                            style={{
                              width: "10vw",
                              height: "12vh",
                              padding: "5px",
                              display: "inline"
                            }}
                          />
                        </li>
                      );
                    })}
                  </ul>
                  <ul style={{ display: "flex" }}>
                    {privatePics.map((photo, index) => {
                      console.log(photo);
                      return (
                        <li>
                          <img
                            src={require("../../images/girl1.jpg")}
                            name={index + 4}
                            alt={index + 4}
                            key={index + 4}
                            onClick={this.handleImageClick}
                            style={{
                              width: "10vw",
                              height: "12vh",
                              padding: "5px",
                              display: "inline"
                            }}
                          />
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>

              <div
                className="centerRow"
                style={{ flex: 1, backgroundColor: "orange" }}
              />
            </div>
          );
        }}
      </Query>
    );
  }
}

export default withRouter(ProfilePage);
