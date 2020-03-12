import React, { Component, cloneElement } from "react";
import { withTranslation } from "react-i18next";
class Menu extends Component {
  constructor(props) {
    super(props);
    this.wrapperRef = React.createRef();
  }

  state = {
    menuOpen: false
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (
      this.state.menuOpen !== nextState.menuOpen ||
      this.props.menuOpener !== nextProps.menuOpener
    ) {
      return true;
    }
    return false;
  }

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
    document.addEventListener("touchstart", this.handleClickOutside);
    this.mounted = true;
    if (this.props.closeAction) {
      this.props.closeAction();
    }
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
    document.removeEventListener("touchstart", this.handleClickOutside);
    this.mounted = false;
  }

  handleClickOutside = async event => {
    if (
      this.wrapperRef &&
      !this.wrapperRef.current.contains(event.target) &&
      this.state.menuOpen
    ) {
      this.close();
    }
  };

  close = () => {
    if (this.mounted) {
      this.setState({ menuOpen: false });
    }
  };

  render() {
    const { menuOpener, activeStyle, notActiveStyle } = this.props;
    const { menuOpen } = this.state;
    return (
      <div
        className={!menuOpen ? notActiveStyle : activeStyle}
        onClick={() => this.setState({ menuOpen: !menuOpen })}
        ref={this.wrapperRef}
      >
        {menuOpener}
        {menuOpen && cloneElement(this.props.children)}
      </div>
    );
  }
}

export default withTranslation("common")(Menu);
