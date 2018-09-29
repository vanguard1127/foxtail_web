import React, { Component } from "react";
import ReactPaginate from "react-paginate";

export default class CardsPaginator extends Component {
  render() {
    let commentNodes = this.props.data.map(function(comment, index) {
      return <div key={index}>{comment.comment}</div>;
    });

    return (
      <div id="project-comments" className="commentList">
        <ul>{commentNodes}</ul>
      </div>
    );
  }
}

export class App extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return <div className="commentBox" />;
  }
}
