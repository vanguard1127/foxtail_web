import React, { Component, Fragment } from 'react';
import CreateEvent from '../Modals/CreateEvent/';
class CreateEventBtn extends Component {
  state = { showPopup: false };
  togglePopup = () => {
    this.setState({
      showPopup: !this.state.showPopup
    });
  };
  render() {
    this.props.ErrorHandler.setBreadcrumb('Open Create Event');
    return (
      <Fragment>
        <div className="create-event-btn" onClick={() => this.togglePopup()}>
          <span>{this.props.t('common:createevent')}</span>
        </div>
        {this.state.showPopup ? (
          <CreateEvent
            closePopup={() => this.togglePopup()}
            ErrorHandler={this.props.ErrorHandler}
          />
        ) : null}
      </Fragment>
    );
  }
}

export default CreateEventBtn;
