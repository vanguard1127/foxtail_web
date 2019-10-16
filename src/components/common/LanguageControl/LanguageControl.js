import React, { PureComponent } from "react";
import i18n from "../../../i18n";

class LanguageControl extends PureComponent {
  constructor(props) {
    super(props);
    this.wrapperRef = React.createRef();
  }

  state = {
    menuOpen: false,
    selectedLang: this.props.lang,
    languages: ["en"]
  };

  setLang = lang => {
    if (this.mounted) {
      i18n.changeLanguage(lang);
      this.setState({ selectedLang: lang, menuOpen: false });
    }
  };

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
    document.addEventListener("touchstart", this.handleClickOutside);
    this.mounted = true;
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
    document.removeEventListener("touchstart", this.handleClickOutside);
    this.mounted = false;
  }

  handleClickOutside = event => {
    if (
      this.wrapperRef &&
      !this.wrapperRef.current.contains(event.target) &&
      this.state.menuOpen &&
      this.mounted
    ) {
      this.setState({ menuOpen: false });
    }
  };

  toggleMenuOpen = () => {
    if (this.mounted) {
      this.setState({ menuOpen: !this.state.menuOpen });
    }
  };

  render() {
    let convertLang = this.state.selectedLang;
    if (convertLang === "en-US") {
      convertLang = "en";
    }

    return (
      <span ref={this.wrapperRef}>
        <div className="language-choose" onClick={this.toggleMenuOpen}>
          <i className={`flag ${convertLang}`} />
        </div>
        <div
          className={`language-dropdown ${this.state.menuOpen ? "click" : ""}`}
        >
          <ul>
            {this.state.languages
              .filter(x => convertLang !== x)
              .map(lang => (
                <li key={lang}>
                  <span>
                    <i
                      className={`flag ${lang}`}
                      onClick={() => this.setLang(lang)}
                    />
                  </span>
                </li>
              ))}
          </ul>
        </div>
      </span>
    );
  }
}

export default LanguageControl;
