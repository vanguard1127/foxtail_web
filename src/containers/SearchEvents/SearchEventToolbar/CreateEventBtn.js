import React, { PureComponent, Fragment } from "react";
import CreateEvent from "components/Modals/CreateEvent/";
class CreateEventBtn extends PureComponent {
  state = { showPopup: false };
  togglePopup = () => {
    const { showPopup } = this.state;
    this.setState(
      {
        showPopup: !showPopup
      },
      () => {
        this.props.toggleScroll(!showPopup);
      }
    );
  };
  render() {
    const { lang, t, ErrorHandler, history, ReactGA, dayjs } = this.props;
    ErrorHandler.setBreadcrumb("Open Create Event");
    return (
      <Fragment>
        <div className="create-event-btn" onClick={this.togglePopup}>
          <span>{t("common:createevent")}</span>
        </div>
        {this.state.showPopup ? (
          <CreateEvent
            close={this.togglePopup}
            ErrorHandler={ErrorHandler}
            lang={lang}
            history={history}
            ReactGA={ReactGA}
            dayjs={dayjs}
          />
        ) : null}
      </Fragment>
    );
  }
}

export default CreateEventBtn;
