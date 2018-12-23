import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Query } from "react-apollo";
import { GET_PROFILE } from "../../queries";
import moment from "moment";
import ImageCarousel from "../SearchProfiles/ImageCarousel";
import DesiresList from "../Desire/DesiresList";
import Spinner from "../common/Spinner";
import { Icon, Button } from "antd";
import withAuth from "../withAuth";
import { s3url } from "../../docs/data";
const ButtonGroup = Button.Group;

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
            return <Spinner message="Loading..." size="large" />;
          } else if (!data || !data.profile) {
            return (
              <div>This profile either never existed or it no longer does.</div>
            );
          }
          console.log("test", data.profile.photos);

          const { users, photos, desires, about } = data.profile;
          const publicPics = photos.filter(
            photoObject => photoObject.url !== "x"
          );
          const privatePics = photos.filter(
            photoObject => photoObject.url === "x"
          );
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
              <div style={{ flex: 2, display: "flex" }}>
                <div
                  className="leftRow"
                  style={{
                    backgroundColor: "#666",
                    flexDirection: "column",
                    flex: "1",
                    display: "flex"
                  }}
                >
                  <div style={{ padding: "1vw", display: "flex" }}>
                    {users.map((user, index) => (
                      <div key={index}>
                        {" "}
                        <div
                          style={{
                            fontSize: "30px",
                            fontWeight: "bolder",
                            display: "inline"
                          }}
                        >
                          {" "}
                          {user.username}
                        </div>
                        ,{moment().diff(user.dob, "years")} {user.gender}
                        <div style={{ fontSize: "15px" }}>
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
                  </div>
                  <div
                    className="leftRow"
                    style={{ flex: 1, flexDirection: "column", padding: "2vw" }}
                  >
                    <div
                      style={{
                        fontSize: "20px",
                        fontWeight: "bold"
                      }}
                    >
                      Bio:
                    </div>
                    <div
                      style={{
                        overflowY: "auto",
                        fontSize: "18px",
                        display: "flex",
                        flexWrap: "wrap"
                      }}
                    >
                      {about}
                    </div>
                  </div>
                  <div
                    className="leftColumn"
                    style={{ flex: 1, flexDirection: "column", padding: "2vw" }}
                  >
                    <div
                      style={{
                        fontSize: "20px",
                        fontWeight: "bold"
                      }}
                    >
                      Desires:
                    </div>
                    <DesiresList
                      desires={desires}
                      style={{
                        overflowY: "aut0",
                        display: "flex",
                        flexWrap: "wrap"
                      }}
                      all={true}
                    />
                  </div>
                  <div
                    style={{
                      alignSelf: "center",
                      alignItems: "flex-end",
                      display: "flex",
                      width: "100%"
                    }}
                  >
                    <ButtonGroup
                      style={{
                        width: "100%"
                      }}
                    >
                      <Button
                        style={{
                          width: "25%",
                          height: "8vh"
                        }}
                      >
                        <Icon
                          type="heart"
                          style={{ fontSize: "25px" }}
                          theme="twoTone"
                          twoToneColor="#eb2f96"
                        />
                      </Button>
                      <Button
                        style={{
                          width: "25%",
                          height: "8vh"
                        }}
                      >
                        <Icon
                          type="message"
                          style={{ fontSize: "25px" }}
                          theme="twoTone"
                          twoToneColor="#1A63FF"
                        />
                      </Button>
                      <Button
                        style={{
                          width: "25%",
                          height: "8vh"
                        }}
                      >
                        <Icon type="share-alt" style={{ fontSize: "25px" }} />
                      </Button>
                      <Button
                        style={{
                          width: "25%",
                          height: "8vh"
                        }}
                      >
                        <Icon
                          type="flag"
                          style={{ fontSize: "25px", color: "#E84D3B" }}
                        />
                      </Button>
                    </ButtonGroup>
                  </div>
                </div>
                <div
                  className="centerColumn"
                  style={{ backgroundColor: "#eee" }}
                >
                  <ImageCarousel
                    photos={publicPics}
                    showThumbs={false}
                    autoPlay={true}
                    selectedItem={selectedPhoto}
                  />
                  <ul style={{ display: "flex" }}>
                    {publicPics.map((photo, index) => {
                      return (
                        <li key={index + photo.url.charAt(0)}>
                          <img
                            src={s3url + photo.url}
                            name={index}
                            alt={index}
                            onClick={this.handleImageClick}
                            style={{
                              width: "10vw",
                              height: "12vh",
                              margin: "5px",
                              display: "inline",
                              cursor: "pointer"
                            }}
                          />
                        </li>
                      );
                    })}
                  </ul>
                  {/*<ul style={{ display: "flex" }}>
                    {privatePics.map((photo, index) => {
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
                              margin: "5px",
                              display: "inline",
                              cursor: "pointer"
                            }}
                          />
                        </li>
                      );
                    })}
                  </ul>*/}
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

export default withAuth(session => session && session.currentuser)(
  withRouter(ProfilePage)
);
