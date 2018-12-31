import React, { Component } from "react";
import i18n from "../../../i18n";
import Menu, { SubMenu, MenuItem } from "rc-menu";

class LanguageControl extends Component {
  constructor(props) {
    super(props);
    this.wrapperRef = React.createRef();
  }

  state = {
    menuOpen: false,
    selectedLang: "en",
    languages: ["en", "de"]
  };

  setLang = lang => {
    i18n.changeLanguage(lang);
    this.setState({ selectedLang: lang });
  };

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  handleClickOutside = event => {
    if (
      this.wrapperRef &&
      !this.wrapperRef.current.contains(event.target) &&
      this.state.menuOpen
    ) {
      this.setState({ menuOpen: false });
    }
  };

  render() {
    return (
      <div ref={this.wrapperRef}>
        <a className="login-btn">Already member? Login</a>
        <div
          className="language-choose"
          onClick={() => this.setState({ menuOpen: !this.state.menuOpen })}
        >
          <i
            className={`flag ${this.state.selectedLang}`}
            onClick={() => this.setLang("en")}
          />
        </div>
        <div
          className={`language-dropdown ${this.state.menuOpen ? "click" : ""}`}
        >
          <ul>
            {this.state.languages.filter(x => this.state.selectedLang !== x).map(lang => (
              <li key={lang}>
                <a href="#">
                  <i
                    className={`flag ${lang}`}
                    onClick={() => this.setLang(lang)}
                  />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}

export default LanguageControl;
