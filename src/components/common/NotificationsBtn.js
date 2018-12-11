import React, { Component } from "react";
import { Dropdown, Menu, Icon } from "antd";
import { GENERATE_CODE } from "../../queries";
import { Query } from "react-apollo";
import Spinner from "../common/Spinner";
const menu = (
  <Menu>
    <Menu.Item key="0">
      <a href="http://www.alipay.com/">1st menu item</a>
    </Menu.Item>
    <Menu.Item key="1">
      <a href="http://www.taobao.com/">2nd menu item</a>
    </Menu.Item>
    <Menu.Divider />
    <Menu.Item key="3">3rd menu item</Menu.Item>
  </Menu>
);
class NotificationBtn extends Component {
  state = { token: "", ccLast4: "" };

  render() {
    // return (
    //   <Query query={GENERATE_CODE} fetchPolicy="cache-first">
    //     {({ data, loading, error }) => {
    //       if (loading) {
    //         return <Spinner message="Loading..." size="large" />;
    //       }
    //       if (!data.generateCode) {
    //         return <div>Error has occured. Please contact support</div>;
    //       }
    return (
      <Dropdown overlay={menu} trigger={["click"]}>
        <a className="ant-dropdown-link" href="#">
          <Icon type="bell" style={{ fontSize: "24px", color: "#eee" }} />
        </a>
      </Dropdown>
    );
    //     }}
    //   </Query>
    // );
  }
}

export default NotificationBtn;
