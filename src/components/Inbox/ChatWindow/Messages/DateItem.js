import React, { Component, Fragment } from "react";
import { Waypoint } from "react-waypoint";
import Message from "./Message.js";
import { NEW_MESSAGE_SUB } from "../../../../queries";
import _ from "lodash";

class DateItem extends Component {
  isUserInside = true;
  state = {
    position: "inside"
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (
      this.props.stickZIndex !== nextProps.stickZIndex ||
      this.props.children !== nextProps.children ||
      this.state.position !== nextState.position
    ) {
      return true;
    }
    return false;
  }

  componentDidMount() {
    this.mounted = true;
    // When Waypoint mountsit only calls waypoints on screen. But the parent needs
    // to know everyone's position. So we asume position = above if waypoint did called
    if (!this.state.position) {
      if (this.mounted) {
        this.setState({
          position: "above"
        });
      }
      if (this.props.onAbove) this.props.onAbove();
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  onEnter = ({ previousPosition, currentPosition }) => {
    if (this.props.hasMoreItems) {
      if (currentPosition === Waypoint.inside) {
        if (this.mounted) {
          this.setState({
            position: "inside"
          });
        }
        if (this.props.onInside) this.props.onInside();
      }
    }
  };
  onLeave = ({ previousPosition, currentPosition }) => {
    if (this.props.hasMoreItems) {
      if (currentPosition === Waypoint.above) {
        if (this.mounted) {
          this.setState({
            position: "above"
          });
        }
        if (this.props.onAbove) this.props.onAbove();
      }
    }
  };
  renderDate({ style = {}, children }) {
    return (
      <div
        style={{
          margin: "0 -20px 0 -20px",
          background: "#ffffff70",
          padding: "20px 0",
          textAlign: "center",
          marginBottom: "10px",
          ...style
        }}
      >
        {children}
      </div>
    );
  }

  render() {
    const { stickZIndex, showDate, children } = this.props;

    const stickStyles = {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      zIndex: stickZIndex || 10,
      backgroundColor: "#add8e6",
      padding: "20px 37px 20px 20px",
      margin: "0 17px 0 0"
    };

    return (
      <Fragment>
        <Waypoint bottom="100%" onEnter={this.onEnter} onLeave={this.onLeave} />
        {this.renderDate({ style: {}, children })}
        {showDate ? this.renderDate({ style: stickStyles, children }) : null}
      </Fragment>
    );
  }
}

export default DateItem;
