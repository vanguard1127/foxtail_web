import React from "react";
import { withRouter, Link } from "react-router-dom";
import { Layout, Divider } from "antd";

const { Footer } = Layout;

const FooterBar = () => (
  <Footer style={{ display: "flex" }}>
    <div
      style={{
        display: "flex",
        justifyContent: "flex-start",
        flex: 1
      }}
    >
      Foxtail ©2018 Created by Foxes
    </div>
    <div
      style={{
        display: "flex",
        justifyContent: "flex-end",
        flex: 1
      }}
    >
      {" "}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          flex: 1,
          width: 25
        }}
      >
        <Link to={"#"}>Terms</Link>
        <Divider type="vertical" />
        <Link to={"#"}>Privacy</Link>
        <Divider type="vertical" />
        <Link to={"#"}>FAQs</Link>
        <Divider type="vertical" />
        <Link to={"#"}>About</Link>
        <Divider type="vertical" />
        <Link to={"#"}>Support</Link>
      </div>
    </div>
  </Footer>
);

export default withRouter(FooterBar);
