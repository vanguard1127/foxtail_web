import React, { PureComponent } from 'react';
class InboxSearchTextBox extends PureComponent {
  render() {
    const { t } = this.props;

    return (
      <div className="search">
        <input type="text" placeholder={t('search') + '...'} />
      </div>
    );
  }
}

export default InboxSearchTextBox;
