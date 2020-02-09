export default (code, cb) => {
  const textField = document.createElement("textarea");
  textField.innerText = code;
  textField.style.width = "0px";
  textField.style.height = "0px";
  textField.style.zIndex = "0";
  textField.style.top = "0px";
  textField.style.position = "absolute";

  document.body.appendChild(textField);
  textField.select();
  document.execCommand("copy");
  if (cb) {
    cb();
  }
};
