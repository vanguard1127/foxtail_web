import React from "react";
import { NavLink } from "react-router-dom";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from "@material-ui/core";

import { IAlertData } from "./NavbarAuth";

interface IAlertProps {
  alert: IAlertData;
  close: () => void;
  visible: boolean;
  t: any;
}

// TODO Find out alert TYPE, need actual alert from backend call
const Alert: React.FC<IAlertProps> = ({ alert, close, t, visible }) => {
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
          <NavLink to={alert.link} color="primary">
            {t("Go")}
          </NavLink>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default Alert;
