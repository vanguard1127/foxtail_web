import React from "react";
const withOptions = url => Component =>
  class WithOptions extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        data: null,
        isLoading: false,
        error: null
      };
    }

    componentDidMount() {
      this.setState({ isLoading: true });
      //Check if in list then proceed otherwise use english
      import("../docs/options/tu.js").then(options =>
        this.setState({
          data: options.genderOptions,
          isLoading: false
        })
      );
    }

    render() {
      return <Component {...this.props} options={this.state.data} />;
    }
  };
export default withOptions;
