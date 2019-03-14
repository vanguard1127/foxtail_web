import React, { PureComponent } from 'react';
class EventHeader extends PureComponent {
  render() {
    const { t } = this.props;
    return (
      <section className="breadcrumb">
        <div className="container">
          <div className="col-md-12">
            <span className="head">{t('common:goevents')}</span>
            <span className="title">{t('common:eventsubtitle')}</span>
          </div>
        </div>
      </section>
    );
  }
}

export default EventHeader;
