const validateLang = lang => {
  if (lang === "en-US") {
    lang = "en";
  }
  return lang;
};

export default validateLang;
