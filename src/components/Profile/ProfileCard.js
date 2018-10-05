import React, { Component } from "react";
import ImageCarousel from "./ImageCarousel";
import NamePlate from "./NamePlate";
import DesiresList from "../Desire/DesiresList";
import { Card, Icon } from "antd";
import { LIKE_PROFILE } from "../../queries";
import { Mutation } from "react-apollo";

const { Meta } = Card;

class ProfileCard extends Component {
  state = {};

  handleSubmit = likeProfile => {
    const { id } = this.props.profile;
    likeProfile()
      .then(({ data }) => {
        this.props.removeProfile(id);
      })
      .catch(e => console.log(e.message));
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
        {(likeProfile, { data, loading, error }) => (
          <Card
            style={{
              width: "25%",
              display: "inline-block",
              border: "2px solid #eee",
              borderRadius: "5px",
              margin: "20px"
            }}
            cover={
              <div>
                <ImageCarousel photos={photos} showThumbs={false} />
                <Icon
                  style={{ float: "right", padding: "7px", fontSize: "20px" }}
                  type="info-circle"
                  onClick={() => this.props.showProfileModal(true, profile)}
                />
              </div>
            }
            actions={[
              <Icon
                type="heart"
                style={{ fontSize: "25px" }}
                theme="twoTone"
                twoToneColor="#eb2f96"
                onClick={() => this.handleSubmit(likeProfile)}
              />,
              <Icon
                type="message"
                style={{ fontSize: "25px" }}
                theme="twoTone"
                twoToneColor="#1A63FF"
              />,
              <Icon type="share-alt" style={{ fontSize: "25px" }} />,
              <Icon
                type="flag"
                style={{ fontSize: "20px", color: "#E84D3B" }}
                onClick={() => this.props.showBlockModal(true, profile)}
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
                      <NamePlate user={user} />
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
        )}
      </Mutation>
    );
  }
}

export default ProfileCard;
