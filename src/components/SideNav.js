import React from "react";
import { Nav, NavIcon, NavText, withRR4 } from "react-sidenav";
import SvgIcon from "react-icons-kit";
import { ic_aspect_ratio } from "react-icons-kit/md/ic_aspect_ratio";
import { ic_business } from "react-icons-kit/md/ic_business";
import { ic_business_center } from "react-icons-kit/md/ic_business_center";
import { ic_format_list_bulleted } from "react-icons-kit/md/ic_format_list_bulleted";
import { ic_people } from "react-icons-kit/md/ic_people";

const Icon20 = props => <SvgIcon size={props.size || 20} icon={props.icon} />;
const SideNav = withRR4();
const BaseContainer = props => (
  <div
    style={{
      display: "inline-block",
      paddingBottom: 16,
      fontFamily: "Roboto",
      width: 240,
      ...props.style
    }}
  >
    {props.children}
  </div>
);

const SideNavWithAlerts = () => (
  <SideNav
    highlightBgColor="#eee"
    defaultSelected="products"
    highlightColor="#E91E63"
  >
    <div />
    <Nav id="orders">
      <NavIcon>
        <Icon20 icon={ic_format_list_bulleted} />
      </NavIcon>
      <NavText>
        {" "}
        <span style={{ paddingRight: 6 }}>Inbox</span>{" "}
        <span
          style={{
            textAlign: "center",
            lineHeight: "16px",
            height: 16,
            width: 16,
            margin: "0 auto",
            borderRadius: "50%",
            fontSize: 9,
            display: "inline-block",
            color: "#FFF",
            background: "#ff5b57"
          }}
        >
          10
        </span>
      </NavText>
    </Nav>
    <Nav id="search">
      <NavIcon>
        <Icon20 icon={ic_aspect_ratio} />
      </NavIcon>
      <NavText> Find Members </NavText>
    </Nav>

    <Nav id="event/search">
      <NavIcon>
        <Icon20 icon={ic_business_center} />
      </NavIcon>
      <NavText> Find Events </NavText>
    </Nav>
    <Nav id="editprofile">
      <NavIcon>
        <Icon20 size={16} icon={ic_aspect_ratio} />
      </NavIcon>
      <NavText> Edit Profile </NavText>
    </Nav>
    <Nav>
      <NavIcon>
        <Icon20 icon={ic_people} />
      </NavIcon>
      <NavText> Settings </NavText>

      <Nav
        id="myaccount"
        onNavClick={() => {
          console.log("Promote clicked!", arguments);
        }}
      >
        <NavIcon>
          <Icon20 size={16} icon={ic_business} />
        </NavIcon>
        <NavText> My Account </NavText>
      </Nav>
    </Nav>
  </SideNav>
);
const SideNavItem = ({ session }) => (
  <nav className="header">
    {session && session.currentuser ? (
      <SideNavDiv session={session} />
    ) : (
      <div />
    )}
  </nav>
);
const SideNavDiv = ({ session }) => (
  <div style={{ display: "flex", height: "87vh" }}>
    <BaseContainer
      style={{
        background: "#FFF",
        color: "#444",
        boxShadow: "0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)"
      }}
    >
      <div className="profileBox">
        <div style={{ width: 100, height: 50 }}>
          <div style={{ color: "#00E66" }}>{session.currentuser.username}</div>
          <img
            alt="logo"
            src="http://3.bp.blogspot.com/-HKVCX2P1Gd4/VJ6-KFnyWvI/AAAAAAAABKY/haON9g2yy8g/s1600/Couples-Love-HD-profile-images-collection-downaldof.jpg"
            style={{ borderRadius: "30px", width: 40, height: 40 }}
          />
          <div style={{ fontSize: 11 }}> Member 35 days </div>
        </div>
      </div>
      <SideNavWithAlerts />
    </BaseContainer>
  </div>
);

export default SideNavItem;
