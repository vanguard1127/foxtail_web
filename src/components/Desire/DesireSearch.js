import React, { Component } from "react";
import { ApolloConsumer } from "react-apollo";
import { SEARCH_DESIRES } from "../../queries";
import DesireItem from "./DesireItem";

class DesireSearch extends Component {
  state = {
    searchResults: [],
    selected: []
  };
  handleChange = ({ searchDesires }) => {
    this.setState({
      searchResults: searchDesires
    });
  };

  render() {
    const { searchResults } = this.state;
    return (
      <ApolloConsumer>
        {client => (
          <div>
            <input
              type="search"
              placeholder="Search Desires..."
              onChange={async event => {
                event.persist();
                const { data } = await client.query({
                  query: SEARCH_DESIRES,
                  variables: { searchTerm: event.target.value }
                });
                this.handleChange(data);
              }}
            />
            <ul>
              {searchResults.map(desire => (
                <DesireItem
                  key={desire}
                  desire={desire}
                  style={
                    this.props.desires.includes(desire)
                      ? { border: "1px solid red" }
                      : { border: "1px solid blue" }
                  }
                  onClick={event => {
                    this.props.onClick(event, desire);
                  }}
                />
              ))}
            </ul>
            <div>
              Desires:
              {this.props.desires.map((desire, i) => {
                if (this.props.desires.length === i + 1) {
                  return desire;
                } else {
                  return desire + ", ";
                }
              })}
            </div>
          </div>
        )}
      </ApolloConsumer>
    );
  }
}

export default DesireSearch;
