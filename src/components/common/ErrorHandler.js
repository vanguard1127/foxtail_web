import React, { PureComponent } from "react";
import * as Sentry from "@sentry/browser";
import i18n from "i18next";

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DNS
});

const setBreadcrumb = msg => {
  Sentry.addBreadcrumb({
    category: "ui",
    message: msg,
    level: "info",
    type: "user"
  });
};

const catchErrors = errors => {
  Sentry.captureException(errors);
};

class report extends PureComponent {
  render() {
    const { error, calledName, id, type, userID } = this.props;
    if (calledName) {
      Sentry.configureScope(scope => {
        scope.setTag("calledName", calledName);
        scope.setTag("targetID", id);
        scope.setTag("type", type);
        scope.setTag("userID", userID);
      });
    }
    Sentry.captureException(error);
    return (
      <span>
        {i18n.t("common:errMsg")}:
        <span onClick={() => Sentry.showReportDialog()}>
          {i18n.t("common:reportErr")}
        </span>
      </span>
    );
  }
}
class ErrorBoundary extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  componentDidMount() {
    this.mounted = true;
  }
  componentWillUnmount() {
    this.mounted = false;
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { error: true };
  }

  componentDidCatch(error, errorInfo) {
    if (this.mounted) {
      this.setState({ error });
    }
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
          {i18n.t("common:errMsg")}:
          <span onClick={() => Sentry.showReportDialog()}>
            {i18n.t("common:reportErr")}
          </span>
        </span>
      );
    } else {
      //when there's not an error, render children untouched
      return this.props.children;
    }
  }
}
export { ErrorBoundary, report, setBreadcrumb, catchErrors };
