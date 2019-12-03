// @ts-nocheck
import React from "react";
import lightBlue from "@material-ui/core/colors/lightBlue";
import { createMuiTheme } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/styles";

const materialTheme = createMuiTheme({
  overrides: {
    MuiPickersToolbar: {
      toolbar: {
        backgroundColor: lightBlue.A200
      }
    },
    MuiPickersCalendarHeader: {
      switchHeader: {
        // backgroundColor: lightBlue.A200,
        // color: "white",
      }
    },
    MuiPickersDay: {
      day: {
        color: lightBlue.A700
      },
      daySelected: {
        backgroundColor: lightBlue["400"]
      },
      dayDisabled: {
        color: lightBlue["100"]
      },
      current: {
        color: lightBlue["900"]
      }
    },
    MuiPickersModal: {
      dialogAction: {
        color: lightBlue["400"]
      }
    }
  }
});

const DatePickerTheme = Component => props => {
  return (
    <ThemeProvider theme={materialTheme}>
      <Component {...props} />
    </ThemeProvider>
  );
};
export default DatePickerTheme;
