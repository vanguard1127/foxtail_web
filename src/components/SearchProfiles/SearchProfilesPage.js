import React, { Component, Fragment } from "react";
import { withNamespaces } from "react-i18next";
import withLocation from "../withLocation";
import withAuth from "../withAuth";
import { withRouter } from "react-router-dom";
import SearchCriteria from "./SearchCriteria";
import ProfilesContainer from "./ProfilesContainer";

class SearchProfilesPage extends Component {
  state = {
    ...this.props.searchCriteria,
    lat: this.props.location.lat,
    long: this.props.location.long
  };

  setValue = ({ name, value }) => {
    console.log(name, value);
    this.setState({ [name]: value });
  };

  setLocation = async ({ lat, long }) => {
    await this.setState({ long, lat });
  };

  render() {
    const { t, ErrorBoundary, loading } = this.props;

    return (
      <Fragment>
        <ErrorBoundary>
          <SearchCriteria
            t={t}
            ErrorBoundary={ErrorBoundary}
            setLocation={this.setLocation}
            setValue={this.setValue}
            loading={loading}
            searchCriteria={this.state}
          />
        </ErrorBoundary>
        <ErrorBoundary>
          <ProfilesContainer
            ErrorBoundary={ErrorBoundary}
            t={t}
            history={this.props.history}
            searchCriteria={this.state}
            loading={loading}
          />
        </ErrorBoundary>
      </Fragment>
    );
  }
}

export default withAuth(session => session && session.currentuser)(
  withRouter(withLocation(withNamespaces("searchprofiles")(SearchProfilesPage)))
);
