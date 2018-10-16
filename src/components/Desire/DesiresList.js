import React, { Component } from "react";
import { Button } from "antd";
import ReactDOM from "react-dom";

class DesiresList extends Component {
  state = { elWidth: "" };
  componentDidMount() {
    //Get initial width. Obviously, this will trigger a render,
    //but nothing will change, look wise.
    //But, if this is against personal taste then store this property
    //in a different way
    //But it'll complicate your determineWidth logic a bit.
    // console.log(
    //   "out",
    //   ReactDOM.findDOMNode(this.refs.outer).getBoundingClientRect().width
    // );
    // console.log(
    //   "in",
    //   ReactDOM.findDOMNode(this.refs.inner).getBoundingClientRect().width
    // );
    // this.setState({
    //   elWidth: ReactDOM.findDOMNode(this.refs.the_input).getBoundingClientRect()
    //     .width
    // });
  }

  determineWidth() {
    var inwidth = ReactDOM.findDOMNode(this.refs.inner).getBoundingClientRect()
      .width;
    var inheight = ReactDOM.findDOMNode(this.refs.inner).getBoundingClientRect()
      .height;
    var outwidth = ReactDOM.findDOMNode(this.refs.outer).getBoundingClientRect()
      .width;
    var outheight = ReactDOM.findDOMNode(
      this.refs.outer
    ).getBoundingClientRect().height;
    console(
      "inW",
      inwidth,
      "outW",
      outwidth,
      "inH",
      inheight,
      "outH",
      outheight
    );
    // if (this.state.elWidth && this.state.elWidth !== elWidth) {
    //   this.setState({
    //     elWidth: elWidth
    //   });
    // }
  }

  render() {
    const { desires, all, style } = this.props;
    let count = 0;
    return (
      <div ref="inner" style={{ ...style }}>
        {desires.map(desire => {
          if (count < 3 || all) {
            count++;
            return (
              <Button type="dashed" key={desire}>
                {desire}
              </Button>
            );
          } else {
            return null;
          }
        })}

        {desires.length - count > 0 && (
          <Button type="dashed">+{desires.length - count}</Button>
        )}
      </div>
    );
  }
}

export default DesiresList;
