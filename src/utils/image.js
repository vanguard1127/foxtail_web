import i18n from "i18next";
export const preventContextMenu = e => {
  if (e.target.type === "text" || e.target.type === "textarea") {
    return;
  }
  e.stopPropagation();
  e.preventDefault();
  alert(
    i18n.t(
      "common:Right-click disabled - Saving images on Foxtail will result in your IP address being banned."
    )
  );
};
