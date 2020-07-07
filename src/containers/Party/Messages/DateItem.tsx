import React, { Fragment, useState, useEffect } from "react";
import { Waypoint } from "react-waypoint";

interface IDateItemProps {
  stickZIndex: number,
  onAbove: () => void,
  onInside: () => void,
  hasMoreItems: boolean,
  showDate?: boolean,
}

const DateItem: React.FC<IDateItemProps> = ({
  stickZIndex,
  onAbove,
  onInside,
  showDate,
  hasMoreItems,
  children,
}) => {
  const [position, setPosition] = useState('inside');

  useEffect(() => {
    if (!position) {
      setPosition('above');
      if (onAbove) {
        onAbove();
      }
    }
  }, [])

  const onEnter = ({ previousPosition, currentPosition }) => {
    if (hasMoreItems) {
      if (currentPosition === Waypoint.inside) {
        setPosition('inside');
        if (onInside) {
          onInside();
        }
      }
    }
  };
  const onLeave = ({ previousPosition, currentPosition }) => {
    if (hasMoreItems) {
      if (currentPosition === Waypoint.above) {
        setPosition('above');
        if (onAbove) {
          onAbove();
        }
      }
    }
  };

  const renderDate = ({ style = {}, children }) => {
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
      <Waypoint bottomOffset="100%" onEnter={onEnter} onLeave={onLeave} />
      {renderDate({ style: {}, children })}
      {showDate ? renderDate({ style: stickStyles, children }) : null}
    </Fragment>
  );
}

export default DateItem;
