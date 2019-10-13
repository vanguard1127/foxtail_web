import i18n from "i18next";
export const preventContextMenu = e => {
  e.stopPropagation();
  e.preventDefault();
  alert(
    i18n.t(
      "common:Right-click disabled - Saving images on Foxtail will result in your account being banned."
    )
  );
};
