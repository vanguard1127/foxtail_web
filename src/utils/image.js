export const preventContextMenu = e => {
  e.preventDefault();
  //TODO: figure out how to translate this
  //const i18n = require("./i18n");
  alert(
    "Right-click disabled: Saving images on Foxtail will result in your account being banned."
  );
};
