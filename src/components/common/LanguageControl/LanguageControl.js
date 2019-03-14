import React, { PureComponent } from 'react';
import i18n from '../../../i18n';

class LanguageControl extends PureComponent {
  constructor(props) {
    super(props);
    this.wrapperRef = React.createRef();
  }

  state = {
    menuOpen: false,
    selectedLang: localStorage.getItem('i18nextLng'),
    languages: ['en', 'de', 'tu']
  };

  setLang = lang => {
    i18n.changeLanguage(lang);
    import('moment/locale/' + lang);
    this.setState({ selectedLang: lang, menuOpen: false });
  };

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
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
    let convertLang = this.state.selectedLang;
    if (convertLang === 'en-US') {
      convertLang = 'en';
    }

    return (
      <span ref={this.wrapperRef}>
        <div
          className="language-choose"
          onClick={() => this.setState({ menuOpen: !this.state.menuOpen })}
        >
          <i className={`flag ${convertLang}`} />
        </div>
        <div
          className={`language-dropdown ${this.state.menuOpen ? 'click' : ''}`}
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
