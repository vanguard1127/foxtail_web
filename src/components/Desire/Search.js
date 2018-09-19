import React, { Component } from "react";
import { ApolloConsumer } from "react-apollo";
import { SEARCH_DESIRES } from "../../queries";
import DesireItem from "../Desire/DesireItem";

class Search extends Component {
  state = {
    searchResults: [],
    selected: []
  };
  handleChange = ({ searchDesires }) => {
    this.setState({
      searchResults: searchDesires
    });
  };

  handleClick = (event, desire) => {
    this.state.selected.includes(desire)
      ? (event.target.style.border = "1px solid blue")
      : (event.target.style.border = "1px solid red");

    this.setState(() => {
      return {
        selected: this.state.selected.includes(desire)
          ? this.state.selected.filter(e => e !== desire)
          : [...this.state.selected, desire]
      };
    });
  };

  render() {
    const { searchResults } = this.state;
    return (
      <ApolloConsumer>
        {client => (
          <div className="App">
            <h1>Desires</h1>
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
                  onClick={event => {
                    this.handleClick(event, desire);
                  }}
                />
              ))}
            </ul>
          </div>
        )}
      </ApolloConsumer>
    );
  }
}

export default Search;
