import React, { Component } from "react";
import PhotoUpload from "../../common/PhotoUpload";
export default class CreateEvent extends Component {
  render() {
    const { closePopup } = this.props;
    return (
      <section className="popup-content show">
        <div className="container">
          <div className="col-md-12">
            <div className="row">
              <div className="offset-md-3 col-md-6">
                <div className="modal-popup create-event">
                  <div className="m-head">
                    <span className="heading">Create a New Event</span>
                    <span className="title">
                      It is a long established fact that a reader will be
                      distracted by the readable
                    </span>
                    <a className="close" onClick={() => closePopup()} />
                  </div>
                  <div className="m-body">
                    <div className="page">
                      <div className="form">
                        <div className="content">
                          <div className="item">
                            <div className="input">
                              <input type="text" required id="eventName" />
                              <label title="Event Name" for="eventName" />
                            </div>
                          </div>
                          <div className="item">
                            <div className="input">
                              <input type="text" required id="eventAddress" />
                              <label title="Event Address" for="eventAddress" />
                            </div>
                          </div>
                          <div className="item">
                            <div className="textarea">
                              <textarea placeholder="Your event description here..." />
                            </div>
                          </div>
                          <div className="item nobottom">
                            <PhotoUpload />
                            {/* <input
                              type="file"
                              className="filepond eventPhoto"
                              name="filepond"
                            /> */}
                          </div>
                          <div className="item">
                            <div className="dropdown">
                              <select
                                className="js-example-basic-multiple"
                                name="interest[]"
                                multiple="multiple"
                              >
                                <option selected>Flirting</option>
                                <option>Cooking</option>
                                <option>Sexting</option>
                                <option selected>Dating</option>
                                <option>Booking</option>
                                <option>Reading</option>
                                <option selected>BDSM</option>
                                <option>Sex</option>
                              </select>
                              <label>For those interested in select:</label>
                            </div>
                          </div>
                          <div className="item">
                            <div className="dropdown">
                              <select
                                className="js-example-basic-single"
                                name="type[]"
                              >
                                <option selected>Public</option>
                                <option>Private</option>
                              </select>
                              <label>Select event type:</label>
                            </div>
                          </div>
                          <div className="item">
                            <div className="button mtop">
                              <button>Create Event</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}
