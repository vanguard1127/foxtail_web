export default (): string => {
  const lang = localStorage.getItem("i18nextLng") || "en";
  const availableLangs = process.env.REACT_APP_AVAIL_LANGUAGES_LIST.split(",");
  if (availableLangs.indexOf(lang) < 0) {
    return "en";
  }
  return lang;
};
