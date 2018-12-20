import i18n from "i18next";
import detector from "i18next-browser-languagedetector";
import backend from "i18next-xhr-backend";
import { reactI18nextModule } from "react-i18next";
// translations are already at
// '../public/locales/en/translation.json'
// which is the default for the xhr backend to load from
i18n
  .use(detector)
  .use(backend)
  .use(reactI18nextModule) // passes i18n down to react-i18next
  .init({
    fallbackLng: "en", // use en if detected lng is not available
    keySeparator: false, // we do not use keys in form messages.welcome
    saveMissing: true, // send not translated keys to endpoint
    interpolation: {
      escapeValue: false // react already safes from xss
    },
    // react-i18next options
    react: {
      wait: true
    }
  });
export default i18n;
