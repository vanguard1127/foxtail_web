import React, { PureComponent, cloneElement } from "react";
import { withTranslation } from "react-i18next";
class Menu extends PureComponent {
  constructor(props) {
    super(props);
    this.wrapperRef = React.createRef();
  }

  state = {
    menuOpen: false
  };

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
    this.mounted = true;
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
    this.mounted = false;
  }

  handleClickOutside = async event => {
    if (
      this.wrapperRef &&
      !this.wrapperRef.current.contains(event.target) &&
      this.state.menuOpen
    ) {
      if (this.props.closeAction) {
        this.props.closeAction();
      }
      this.close();
    }
  };

  close = () => {
    if (this.mounted) {
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
            close: this.close,
            t
          })}
      </div>
    );
  }
}

export default withTranslation("common")(Menu);
