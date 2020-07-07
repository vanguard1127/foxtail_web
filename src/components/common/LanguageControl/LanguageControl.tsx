import React, { memo, useRef, useState, useEffect } from "react";

import i18n from "../../../i18n";

const LanguageControl: React.FC<{ lang: string }> = memo(({
  lang,
}) => {
  const wrapperRef = useRef(null);
  const [state, setState] = useState({
    menuOpen: false,
    selectedLang: lang,
    languages: ["en"]
  })

  const setLang = lang => {
    i18n.changeLanguage(lang);
    setState({ ...state, selectedLang: lang, menuOpen: false });
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    }
  }, []);

  const handleClickOutside = event => {
    if (wrapperRef && !wrapperRef.current.contains(event.target) && state.menuOpen
    ) {
      setState({ ...state, menuOpen: false });
    }
  };

  const toggleMenuOpen = () => {
    setState({ ...state, menuOpen: !state.menuOpen });
  };

  let convertLang = state.selectedLang;
  if (convertLang === "en-US") {
    convertLang = "en";
  }

  return (
    <span ref={wrapperRef}>
      <div className="language-choose" onClick={toggleMenuOpen}>
        <i className={`flag ${convertLang}`} />
      </div>
      <div
        className={`language-dropdown ${state.menuOpen ? "click" : ""}`}
      >
        <ul>
          {state.languages
            .filter(x => convertLang !== x)
            .map(lang => (
              <li key={lang}>
                <span>
                  <i className={`flag ${lang}`} onClick={() => setLang(lang)} />
                </span>
              </li>
            ))}
        </ul>
      </div>
    </span>
  );
});

export default LanguageControl;
