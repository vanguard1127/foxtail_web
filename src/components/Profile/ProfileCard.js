import React, { Component } from "react";
import ImageCarousel from "./ImageCarousel";
import NamePlate from "./NamePlate";
import DesiresList from "../Desire/DesiresList";
import { Card, Icon, Avatar } from "antd";

const { Meta } = Card;

class ProfileCard extends Component {
  state = {};

  render() {
    const { users, desires, about, id } = this.props.profile;
    return (
      <Card
        style={{
          width: "50%",
          display: "inline-block",
          border: "2px solid #eee",
          borderRadius: "5px",
          margin: "20px"
        }}
        cover={<ImageCarousel />}
        actions={[
          <Icon type="heart" />,
          <Icon type="message" />,
          <Icon type="share-alt" />,
          <Icon type="flag" />
        ]}
      >
        <Meta
          style={{
            height: "20vh"
          }}
          title={
            <ul>
              {users.map(user => (
                <li key={user.id}>
                  <NamePlate user={user} />
                </li>
              ))}
            </ul>
          }
          description={
            <div>
              Desires:
              <DesiresList desires={desires} /> Bio:
              <div>{about}</div>
            </div>
          }
        />
      </Card>
    );
  }
}

export default ProfileCard;
