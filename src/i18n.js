import i18n from "i18next";
import detector from "i18next-browser-languagedetector";
import { reactI18nextModule } from "react-i18next";
import translationEN from "./locales/en/translation.json";
import translationDE from "./locales/de/translation.json";
// import translationEN from "../public/locales/en/translation.json";
// import translationDE from "../public/locales/de/translation.json";

// the translations
const resources = {
  en: {
    translation: translationEN
  },
  de: {
    translation: translationDE
  }
};
i18n
  .use(detector)
  .use(reactI18nextModule) // passes i18n down to react-i18next
  .init({
    resources,
    lng: "en",
    keySeparator: false, // we do not use keys in form messages.welcome
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });
export default i18n;

// import i18n from "i18next";
// import detector from "i18next-browser-languagedetector";
// import backend from "i18next-xhr-backend";
// import { reactI18nextModule } from "react-i18next";
// // translations are already at
// // '../public/locales/en/translation.json'
// // which is the default for the xhr backend to load from​
// i18n
//   .use(backend)
//   .use(reactI18nextModule) // passes i18n down to react-i18next
//   .init({
//     backend: {
//       loadPath: "./locales/{{lng}}/translation.json"
//     },
//     lng: "en",
//     fallbackLng: "en", // use en if detected lng is not available
//     keySeparator: false, // we do not use keys in form messages.welcome
//     interpolation: {
//       escapeValue: false // react already safes from xss
//     },
//     react: {
//       wait: true
//     }
//   });
// export default i18n;
