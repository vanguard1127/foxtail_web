import React, { Component } from "react";
import * as Sentry from "@sentry/browser";

Sentry.init({
  dsn: "https://e26c22fc85dc4315bddcad2103c61cee@sentry.io/1380381"
});
// should have been called before using it here
// ideally before even rendering your react app

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { error: true };
  }

  componentDidCatch(error, errorInfo) {
    console.log("ERRORIN MOUNT", error);
    this.setState({ error });
    Sentry.withScope(scope => {
      Object.keys(errorInfo).forEach(key => {
        scope.setExtra(key, errorInfo[key]);
      });
      Sentry.captureException(error);
    });
  }

  render() {
    if (this.state.error) {
      //render fallback UI
      return (
        <span>
          Something went wrong:
          <span onClick={() => Sentry.showReportDialog()}>Report feedback</span>
        </span>
      );
    } else {
      //when there's not an error, render children untouched
      return this.props.children;
    }
  }
}
export default ErrorBoundary;
