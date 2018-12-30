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
        <a href={null} onClick={() => this.togglePopup()}>
          Create Event
        </a>
        {this.state.showPopup ? (
          <CreateEvent closePopup={() => this.togglePopup()} />
        ) : null}
      </div>
    );
  }
}

export default CreateEventBtn;
