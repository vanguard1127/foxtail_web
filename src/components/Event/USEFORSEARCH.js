import React, { Component } from "react";
import CardsList from "./CardsList";
import { SEARCH_PROFILES } from "../../queries";
import ReactPaginate from "react-paginate";
import { graphql } from "react-apollo";

const LIMIT = 2;
class ProfileSearch extends Component {
  state = {
    skip: 0,
    loading: false
  };

  fetchData = async () => {
    this.setState({ loading: true });
    this.props.data.fetchMore({
      variables: {
        limit: LIMIT,
        skip: this.state.skip
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        if (!fetchMoreResult) {
          return previousResult;
        }
        return {
          searchProfiles: [...fetchMoreResult.searchProfiles]
        };
      }
    });
    this.setState({
      loading: false
    });
  };

  handleEnd = data => {
    let selected = data.selected;
    let skip = Math.ceil(selected * LIMIT);

    this.setState({ skip: skip }, () => {
      this.fetchData();
    });
  };

  render() {
    console.log(this.props.data);
    const data = this.props.data.searchProfiles || [];
    return (
      <div>
        <h4>ProfileSearch1</h4>
        <select>
          <option>Nearby</option>
        </select>
        <CardsList searchProfiles={data} />
        <ReactPaginate
          previousLabel={"previous"}
          nextLabel={"next"}
          breakLabel={<a href="">...</a>}
          breakClassName={"break-me"}
          pageCount={this.props.history.length}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={this.handleEnd}
          containerClassName={"pagination"}
          subContainerClassName={"pages pagination"}
          activeClassName={"active"}
        />
      </div>
    );
  }
}

export default graphql(SEARCH_PROFILES, {
  options(ownProps) {
    return {
      variables: { long: 170.0, lat: -23.0, limit: LIMIT }
    };
  }
})(ProfileSearch);
