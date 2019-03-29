import React, { PureComponent } from "react";
class InboxSearchTextBox extends PureComponent {
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
