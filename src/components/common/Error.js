import React from "react";

const Error = ({ error }) => {
  if (~error.message.indexOf("No Messages found")) {
    return <div>No messages found</div>;
  }
  return null;
};
export default Error;
