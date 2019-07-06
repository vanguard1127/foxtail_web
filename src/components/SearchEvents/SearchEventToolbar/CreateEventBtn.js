import React, { PureComponent, Fragment } from "react";
import CreateEvent from "../../Modals/CreateEvent/";
class CreateEventBtn extends PureComponent {
  state = { showPopup: false };
  togglePopup = () => {
    this.setState({
      showPopup: !this.state.showPopup
    });
  };
  render() {
    const { lang, t, ErrorHandler, history, ReactGA } = this.props;
    ErrorHandler.setBreadcrumb("Open Create Event");
    return (
      <Fragment>
        <div className="create-event-btn" onClick={() => this.togglePopup()}>
          <span>{t("common:createevent")}</span>
        </div>
        {this.state.showPopup ? (
          <CreateEvent
            close={this.togglePopup}
            ErrorHandler={ErrorHandler}
            lang={lang}
            history={history}
            ReactGA={ReactGA}
          />
        ) : null}
      </Fragment>
    );
  }
}

export default CreateEventBtn;
