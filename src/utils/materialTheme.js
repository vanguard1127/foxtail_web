import { createMuiTheme } from "@material-ui/core";
export const materialTheme = createMuiTheme({
  overrides: {
    palette: {
      primary: {
        main: "#CB0032"
      }
    },
    MuiTypography: {
      colorPrimary: { color: "#CB0032" }
    },
    MuiPickersToolbar: {
      toolbar: {
        backgroundColor: "#CB0032"
      }
    },
    MuiPickerDTTabs: {
      tabs: {
        backgroundColor: "#CB0032"
      }
    },
    PrivateTabIndicator: {
      colorSecondary: {
        backgroundColor: "#CB0032"
      }
    },
    MuiPickersMonth: {
      monthSelected: {
        color: " #CB0032"
      }
    },
    MuiPickersDay: {
      day: {
        color: "#CB0032"
      },
      daySelected: {
        backgroundColor: "#CB0032"
      },
      dayDisabled: {
        color: "##616d78"
      },
      current: {
        color: "#cf003c"
      }
    },
    MuiCircularProgress: { color: "#fff" },
    MuiPickersModal: {
      dialogAction: {
        color: "#CB0032"
      }
    },
    MuiPickersClock: { pin: { backgroundColor: "#CB0032" } },
    MuiPickersClockPointer: {
      pointer: { backgroundColor: "#CB0032" },
      thumb: { border: "14px solid #CB0032" }
    }
  }
});
