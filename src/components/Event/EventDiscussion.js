import React from "react";
const EventDiscussion = ({ id }) => {
  return (
    <div className="discuss-content">
      <span className="head">Discuss this event</span>
      <div className="send-message">
        <textarea placeholder="Now you can join the discussion by writing a message…" />
        <button>Send Message</button>
      </div>
      <div className="messages">
        <div className="item">
          <span className="avatar">
            <a href="#">
              <img src="/assets/img/usr/avatar/1001@2x.png" alt="" />
            </a>
          </span>
          <div className="info">
            <span className="name">
              <a href="#">Barbara Blair</a>
            </span>
            <span className="date">22 December 2018 - 14:52</span>

            <span className="msg">
              It is a long established fact that a reader will be distracted by
              the readable content of a page when looking at its layout.
            </span>
          </div>
        </div>
        <div className="item">
          <span className="avatar">
            <a href="#">
              <img src="/assets/img/usr/avatar/1002@2x.png" alt="" />
            </a>
          </span>
          <div className="info">
            <span className="name">
              <a href="#">Mariana Anna</a>
            </span>
            <span className="date">22 December 2018 - 14:52</span>

            <span className="msg">
              Lorem Ipsum has been the industry's standard dummy text ever since
              the 1500s, when an unknown printer took a galley of type and
              scrambled it to make a type specimen book.
            </span>
          </div>
        </div>
        <div className="item">
          <span className="avatar">
            <a href="#">
              <img src="/assets/img/usr/avatar/1003@2x.png" alt="" />
            </a>
          </span>
          <div className="info">
            <span className="name">
              <a href="#">Amanda Turner</a>
            </span>
            <span className="date">22 December 2018 - 14:52</span>

            <span className="msg">
              Lorem Ipsum has been the industry's standard dummy text ever since
              the 1500s, when an unknown printer took a galley of type and
              scrambled it to make a type specimen book.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDiscussion;
