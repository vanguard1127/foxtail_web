import React, { Component } from "react";
import CreateEvent from "../Modals/CreateEvent/";
class CreateEventBtn extends Component {
  state = { showPopup: false };
  togglePopup = () => {
    this.setState({
      showPopup: !this.state.showPopup
    });
  };
  render() {
    return (
      <div className="create-event-btn">
        <span href={null} onClick={() => this.togglePopup()}>
          {this.props.t("Create Event")}
        </span>
        {this.state.showPopup ? (
          <CreateEvent closePopup={() => this.togglePopup()} />
        ) : null}
      </div>
    );
  }
}

export default CreateEventBtn;
