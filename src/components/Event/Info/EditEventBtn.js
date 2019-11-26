import React, { PureComponent, Fragment } from "react";
import CreateEvent from "../../Modals/CreateEvent/";
class EditEventBtn extends PureComponent {
  state = { showPopup: false };

  componentDidMount() {
    this.mounted = true;
  }
  componentWillUnmount() {
    this.mounted = false;
  }

  togglePopup = () => {
    if (this.mounted) {
      const { showPopup } = this.state;
      this.setState(
        {
          showPopup: !showPopup
        },
        () => {
          if (this.props.toggleScroll) {
            this.props.toggleScroll(!showPopup);
          }
        }
      );
    }
  };
  render() {
    const {
      ErrorHandler,
      id,
      updateEventProps,
      refetch,
      lang,
      t,
      ReactGA
    } = this.props;
    this.props.ErrorHandler.setBreadcrumb("Open Edit Event");
    return (
      <Fragment>
        <div className="join-event">
          <span onClick={this.togglePopup}>{t("common:updateevent")}</span>
        </div>

        {this.state.showPopup ? (
          <CreateEvent
            close={this.togglePopup}
            ErrorHandler={ErrorHandler}
            eventID={id}
            updateEventProps={updateEventProps}
            refetch={refetch}
            lang={lang}
            ReactGA={ReactGA}
          />
        ) : null}
      </Fragment>
    );
  }
}

export default EditEventBtn;
