export default (
  url: string,
  title: string,
  win: any,
  width: number,
  height: number
) => {
  const y = win.top.outerHeight / 2 + win.top.screenY - height / 2;
  const x = win.top.outerWidth / 2 + win.top.screenX - width / 2;
  return win.open(
    url,
    title,
    `toolbar=no,
        location=no,
        directories=no,
        status=no,
        menubar=no,
        scrollbars=no,
        resizable=no,
        copyhistory=no,
        width=${width},
        height=${height},
        top=${y},
        left=${x}
    `
  );
};
