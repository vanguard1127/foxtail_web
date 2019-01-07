import React, { Component } from "react";
import { desireOptions } from "../../../docs/data";
export default class Desires extends Component {
  render() {
    const { closePopup, toggleDesires, desires, updateSettings } = this.props;

    return (
      <section className="desires-popup show">
        <div className="container">
          <div className="col-md-12">
            <div className="row">
              <div className="offset-md-3 col-md-6">
                <div className="modal-popup desires-select">
                  <div className="m-head">
                    <span className="heading">Desires Select</span>
                    <span className="title">
                      It is a long established fact that a reader will be
                      distracted by the readable
                    </span>
                    <a className="close" onClick={closePopup} />
                  </div>
                  <div className="m-body desires">
                    <div className="desires-list-con">
                      <ul>
                        {desireOptions.map(option => (
                          <li key={option.value}>
                            <div className="select-checkbox">
                              <input
                                type="checkbox"
                                id={option.value}
                                checked={
                                  desires.indexOf(option.value) > -1
                                    ? true
                                    : false
                                }
                                onChange={e =>
                                  toggleDesires({
                                    checked: e.target.checked,
                                    value: option.value,
                                    updateSettings
                                  })
                                }
                              />
                              <label htmlFor={option.value}>
                                <span />
                                <b>{option.label}</b>
                              </label>
                            </div>
                          </li>
                        ))}
                      </ul>
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
