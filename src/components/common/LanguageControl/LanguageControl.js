import React, { Component } from "react";
import i18n from "../../../i18n";

class LanguageControl extends Component {
  constructor(props) {
    super(props);
    this.wrapperRef = React.createRef();
  }

  state = {
    menuOpen: false,
    selectedLang: localStorage.getItem("i18nextLng"),
    languages: ["en", "de"]
  };

  setLang = lang => {
    i18n.changeLanguage(lang);
    this.setState({ selectedLang: lang, menuOpen: false });
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
      <span ref={this.wrapperRef}>
        <div
          className="language-choose"
          onClick={() => this.setState({ menuOpen: !this.state.menuOpen })}
        >
          <i className={`flag ${this.state.selectedLang}`} />
        </div>
        <div
          className={`language-dropdown ${this.state.menuOpen ? "click" : ""}`}
        >
          <ul>
            {this.state.languages
              .filter(x => this.state.selectedLang !== x)
              .map(lang => (
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
      </span>
    );
  }
}

export default LanguageControl;
