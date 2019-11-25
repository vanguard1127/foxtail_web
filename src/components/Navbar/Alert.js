import React from "react";
import { NavLink } from "react-router-dom";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
const Alert = ({ alert, close, t, visible }) => {
  return (
    <Dialog onClose={close} aria-labelledby="Image" open={visible}>
      {alert.text && (
        <DialogTitle id="alert-dialog-title">{t(alert.text)}</DialogTitle>
      )}
      {alert.body && (
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {alert.name}
            {t("common:" + alert.body) + " "} {alert.event}
          </DialogContentText>
        </DialogContent>
      )}
      {alert.link && (
        <DialogActions>
          <NavLink to={alert.link} color="primary" autoFocus>
            {t("Go")}
          </NavLink>
        </DialogActions>
      )}
    </Dialog>
  );
};
export default Alert;
