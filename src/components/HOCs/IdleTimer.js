import { PureComponent } from "react";
import { withApollo } from "react-apollo";
import axios from "axios";
import { toast } from "react-toastify";

class IdleTimer extends PureComponent {
  constructor(props) {
    super(props);

    this.state = { logginStatus: true };
    this.events = [
      "load",
      "mousemove",
      "mousedown",
      "click",
      "scroll",
      "keypress"
    ];

    this.warn = this.warn.bind(this);
    this.logout = this.logout.bind(this);
    this.resetTimeout = this.resetTimeout.bind(this);

    for (var i in this.events) {
      window.addEventListener(this.events[i], this.resetTimeout);
    }

    this.setTimeout();
  }
  componentWillUnmount() {
    this.destroy();
  }
  clearTimeout() {
    if (this.warnTimeout) clearTimeout(this.warnTimeout);

    if (this.logoutTimeout) clearTimeout(this.logoutTimeout);
  }

  setTimeout() {
    this.warnTimeout = setTimeout(this.warn, 5 * 60 * 1000);

    this.logoutTimeout = setTimeout(this.logout, 6 * 60 * 1000);
  }

  resetTimeout() {
    if (this.warnTimeout) {
      if (toast.isActive("warn")) {
        toast.dismiss("warn");
      }
      this.clearTimeout();
    }
    this.setTimeout();
  }

  warn() {
    if (!toast.isActive("warn")) {
      toast("Idle warning: You will be logged out automatically in 1 minute", {
        toastId: "warn",
        autoClose: false
      });
    }
  }

  logout() {
    // Send a logout request to the API
    this.setState({ logginStatus: false });
    this.handleLogout();
  }

  destroy() {
    this.clearTimeout();
    for (var i in this.events) {
      window.removeEventListener(this.events[i], this.resetTimeout);
    }
  }

  handleLogout = () => {
    axios.get(
      process.env.REACT_APP_HTTPS_URL +
        "/offline?token=" +
        localStorage.getItem("token")
    );
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    sessionStorage.clear();
    this.destroy();
    //Causes console error but currently best option.
    this.props.client.resetStore();

    window.location.replace("/");
  };

  render() {
    return null;
  }
}

export default withApollo(IdleTimer);
