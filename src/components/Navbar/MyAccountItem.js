import React, { Component } from "react";
import MyAccountMenu from "./MyAccountMenu";

class MyAccountItem extends Component {
  constructor(props) {
    super(props);
    this.wrapperRef = React.createRef();
  }

  state = {
    menuOpen: false
  };

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  handleClickOutside = event => {
    if (
      this.wrapperRef &&
      !this.wrapperRef.current.contains(event.target) &&
      this.state.menuOpen
    ) {
      this.setState({ menuOpen: false });
    }
  };

  render() {
    const { menuOpen } = this.state;
    const { currentuser } = this.props;
    console.log("currentuser (never be undef)", currentuser);
    return (
      <span
        onClick={() => this.setState({ menuOpen: !menuOpen })}
        ref={this.wrapperRef}
      >
        <span className="avatar">
          <img
            src={process.env.PUBLIC_URL + "/assets/img/usr/avatar/1001@2x.png"}
            alt=""
          />
        </span>
        <span className="username">John Doe</span>
        {menuOpen && (
          <MyAccountMenu close={() => this.setState({ menuOpen: false })} />
        )}
      </span>
    );
  }
}

export default MyAccountItem;
