export const preventContextMenu = e => {
  e.preventDefault();
  alert(
    'Right-click disabled: Saving images on Foxtail will result in your account being banned.'
  );
};
