import React, { Component } from "react";
import ImageCarousel from "./ImageCarousel";
import NamePlate from "./NamePlate";
import DesiresList from "../Desire/DesiresList";
import { Card, Icon } from "antd";
import { LIKE_PROFILE } from "../../queries";
import { Mutation } from "react-apollo";
import { withRouter } from "react-router-dom";

const { Meta } = Card;

class ProfileCard extends Component {
  state = {};

  handleSubmit = likeProfile => {
    likeProfile()
      .then()
      .catch(res => {
        const errors = res.graphQLErrors.map(error => {
          return error.message;
        });

        //TODO: send errors to analytics from here
        this.setState({ errors });
      });
  };

  render() {
    const { users, desires, photos, id } = this.props.profile;
    const { profile } = this.props;
    return (
      <Mutation
        mutation={LIKE_PROFILE}
        variables={{
          toProfileID: id
        }}
      >
        {(likeProfile, { data, loading }) => {
          //TODO: Create finalized trigger like reaction. Started below

          return (
            <Card
              style={{
                width: "25%",
                display: "inline-block",
                border: "2px solid #eee",
                borderRadius: "5px",
                margin: "20px"
              }}
              cover={
                <div
                  // TODO: Add settime out and message to this so user know they liked
                  style={
                    loading
                      ? {
                          backgroundColor: "red",
                          width: "100%",
                          height: "100%",
                          opacity: "0.50",
                          MozOpacity: "50%",
                          WebkitOpacity: "50%",
                          zIndex: "2"
                        }
                      : null
                  }
                >
                  <div>
                    <ImageCarousel photos={photos} showThumbs={false} />
                    <Icon
                      style={{
                        float: "right",
                        padding: "7px",
                        fontSize: "20px",
                        cursor: "pointer"
                      }}
                      type="info-circle"
                      onClick={() =>
                        this.props.history.push("/members/" + profile.id)
                      }
                    />
                  </div>
                </div>
              }
              actions={[
                <Icon
                  type="heart"
                  style={{ fontSize: "25px" }}
                  theme="twoTone"
                  twoToneColor={!data || !data.likeProfile ? "#eb2f96" : "#666"}
                  onClick={() => this.handleSubmit(likeProfile)}
                  key="like"
                />,
                <Icon
                  type="message"
                  style={{ fontSize: "25px" }}
                  theme="twoTone"
                  twoToneColor="#1A63FF"
                  key="message"
                />,
                <Icon
                  type="share-alt"
                  style={{ fontSize: "25px" }}
                  onClick={() => this.props.showShareModal(true, profile)}
                  key="share"
                />,
                <Icon
                  type="flag"
                  style={{ fontSize: "20px", color: "#E84D3B" }}
                  onClick={() => this.props.showBlockModal(true, profile)}
                  key="flag"
                />
              ]}
            >
              <Meta
                style={{
                  height: "5vh"
                }}
                title={
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    {users.map(user => (
                      <div key={user.id}>
                        <a
                          onClick={() =>
                            this.props.history.push("/members/" + profile.id)
                          }
                        >
                          {" "}
                          <NamePlate user={user} />
                        </a>
                      </div>
                    ))}
                  </div>
                }
                description={
                  <div>
                    <DesiresList desires={desires} />
                  </div>
                }
              />
            </Card>
          );
        }}
      </Mutation>
    );
  }
}

export default withRouter(ProfileCard);
