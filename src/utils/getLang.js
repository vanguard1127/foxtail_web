const getLang = () => {
  let lang = localStorage.getItem("i18nextLng");
  const availableLangs = process.env.REACT_APP_AVAIL_LANGUAGES_LIST.split(",");
  if (availableLangs.indexOf(lang) < 0) {
    lang = "en";
  }
  return lang;
};

export default getLang;
