import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import { Query } from 'react-apollo';
import { GET_MY_EVENTS } from '../../queries';
import EventCard from './EventCard';

const LIMIT = 3;

//TODO: Test paginate
class MyEvents extends PureComponent {
  state = { skip: 0, current: 1 };

  fetchData = fetchMore => {
    this.setState({ loading: true });
    fetchMore({
      variables: {
        skip: this.state.skip
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        if (!fetchMoreResult || fetchMoreResult.getMyEvents.docs.length === 0) {
          return previousResult;
        }

        return {
          getMyEvents: { ...fetchMoreResult.getMyEvents }
        };
      }
    });
  };

  handlePaginate = (page, fetchMore) => {
    this.props.ErrorHandler.setBreadcrumb('Page my events');
    this.setState(
      state => ({
        skip: (page - 1) * LIMIT,
        current: page
      }),
      () => this.fetchData(fetchMore)
    );
  };

  render() {
    const { skip, current } = this.state;
    const { t, ErrorHandler } = this.props;
    return (
      <Query
        query={GET_MY_EVENTS}
        variables={{ skip }}
        fetchPolicy="cache-and-network"
      >
        {({ data, loading, error, fetchMore }) => {
          if (loading) {
            return null;
          }
          if (error) {
            return (
              <ErrorHandler.report error={error} calledName={'getMyEvents'} />
            );
          }
          if (!data.getMyEvents || data.getMyEvents.docs.length === 0) {
            return null;
          }
          const myEvents = data.getMyEvents.docs;
          return (
            <div className="events-card-content my-events">
              <div className="container">
                <div className="col-md-12">
                  <div className="row">
                    <div className="col-md-12">
                      <span className="head">{t('myevents')}</span>
                    </div>

                    {myEvents.map(event => (
                      <EventCard key={event.id} event={event} t={t} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        }}
      </Query>
    );
  }
}
export default withRouter(MyEvents);
