import React, { Component } from "react";
import NoticesList from "./NoticesList";
class NoticesItem extends Component {
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
    const { count, t } = this.props;
    const { menuOpen } = this.state;
    return (
      <div
        className={!menuOpen ? "notification" : "notification active"}
        ref={this.wrapperRef}
      >
        <span
          className="icon alert"
          onClick={() => this.setState({ menuOpen: !menuOpen })}
        >
          {count > 0 && <span className="count">{count}</span>}
        </span>
        {menuOpen && (
          <NoticesList close={() => this.setState({ menuOpen: false })} t={t} />
        )}
      </div>
    );
  }
}

export default NoticesItem;
