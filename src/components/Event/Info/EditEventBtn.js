import React, { PureComponent, Fragment } from "react";
import CreateEvent from "../../Modals/CreateEvent/";
class EditEventBtn extends PureComponent {
  state = { showPopup: false };
  togglePopup = () => {
    this.setState({
      showPopup: !this.state.showPopup
    });
  };
  render() {
    this.props.ErrorHandler.setBreadcrumb("Open Edit Event");
    return (
      <Fragment>
        <div className="join-event">
          <span onClick={() => this.togglePopup()}>
            {this.props.t("common:updateevent")}
          </span>
        </div>

        {this.state.showPopup ? (
          <CreateEvent
            close={this.togglePopup}
            ErrorHandler={this.props.ErrorHandler}
            eventID={this.props.id}
            updateEventProps={this.props.updateEventProps}
            refetch={this.props.refetch}
          />
        ) : null}
      </Fragment>
    );
  }
}

export default EditEventBtn;
