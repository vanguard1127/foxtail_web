import React, { Component } from "react";
import i18n from "../../../i18n";
import Menu, { SubMenu, MenuItem } from "rc-menu";

class LanguageControl extends Component {
  setLang = lang => {
    i18n.changeLanguage(lang);
    this.setState({ lang });
  };
  setVisible = visible => {
    this.setState({ visible });
  };
  // <div class="language-choose"><i class="flag en"></i></div>
  // <div class="language-dropdown">
  //   <ul>
  //     <li>
  //       <a href="#"><i class="flag de"></i></a>
  //     </li>
  //   </ul>
  // </div>
  render() {
    return (
      <span>
        <Menu className="language-choose" defaultActiveFirst={true}>
          <SubMenu className="language-dropdown">
            <MenuItem key={"1"}>
              {" "}
              <a href="#">
                <i className="flag en" />
              </a>
            </MenuItem>
            <MenuItem key={"2"}>
              {" "}
              <a href="#">
                <i className="flag de" />
              </a>
            </MenuItem>
          </SubMenu>
        </Menu>
      </span>
    );
  }
}

export default LanguageControl;
