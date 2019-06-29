import React, { Component } from "react";
class InboxSearchTextBox extends Component {
  shouldComponentUpdate(nextProps) {
    if (this.props.t !== nextProps.t) {
      return true;
    }
    return false;
  }
  render() {
    const { t, handleSearchTextChange } = this.props;

    return (
      <div className="search">
        <input
          type="text"
          placeholder={t("search") + "..."}
          onChange={handleSearchTextChange}
        />
      </div>
    );
  }
}

export default InboxSearchTextBox;
