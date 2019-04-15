import React, { Component, cloneElement } from "react";
import { withNamespaces } from "react-i18next";
class Menu extends Component {
  constructor(props) {
    super(props);
    this.wrapperRef = React.createRef();
  }
  state = {
    menuOpen: false
  };
  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.menuOpen !== nextState.menuOpen) {
      return true;
    }
    return false;
  }

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  // componentDidUpdate() {
  //   if (this.props.closeAction && this.state.menuOpen === false) {
  //     this.props.closeAction();
  //   }
  // }
  handleClickOutside = async event => {
    if (
      this.wrapperRef &&
      !this.wrapperRef.current.contains(event.target) &&
      this.state.menuOpen
    ) {
      this.setState({ menuOpen: false });
    }
  };

  render() {
    const { menuOpener, activeStyle, notActiveStyle, t } = this.props;
    const { menuOpen } = this.state;

    return (
      <div
        className={!menuOpen ? notActiveStyle : activeStyle}
        onClick={() => this.setState({ menuOpen: !menuOpen })}
        ref={this.wrapperRef}
      >
        {menuOpener}
        {menuOpen &&
          cloneElement(this.props.children, {
            close: () => this.setState({ menuOpen: false }),
            t
          })}
      </div>
    );
  }
}

export default withNamespaces("common")(Menu);
