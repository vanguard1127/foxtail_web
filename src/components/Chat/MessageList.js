import React, { Component, Fragment } from "react";
import Waypoint from "react-waypoint";
import Message from "./Message.js";
import { List } from "antd";
import moment from "moment";


// Waypoint needs a component to pass innerRef
const DateInner = ({ style, ...props})=>{
  return (<div style={{ margin: "0 -20px 0 -20px",background: "#ffffff70", padding: '20px 0', textAlign: 'center', ...style }} {...props} />);
}
class DateItem extends Component {
  state = {
    stick: false,
  }
  onEnter = ({previousPosition, currentPosition}) => {
    if(currentPosition === Waypoint.inside) {
      this.setState({
        stick: false,
      })
    }
  }
  onLeave = ({previousPosition, currentPosition}) => {
    console.log('leave', currentPosition)
    if(currentPosition === Waypoint.above) {
      this.setState({
        stick: true,
      })
    }
  }
  render(){
    const { stickZIndex, ...props } = this.props;
    const { stick } = this.state;
    const stickStyles = {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: stickZIndex || 10,
      backgroundColor: '#add8e6',
      padding: "20px 37px 20px 20px",
      margin: 0,
    }
    return (<Fragment>
      <Waypoint bottom="100%" onEnter={this.onEnter} onLeave={this.onLeave} />
      <DateInner {...props}/>
      { stick ? <DateInner style={stickStyles} {...props}/> : null}
    </Fragment>
 )
  }
} 

class MessageList extends Component {
  constructor(props) {
    super(props);
    this.messagesRef = React.createRef();
  }
  state = {
    loading: false,
    restoreScroll: false,
    hasMoreItems: true,
    previousScrollheightMinusTop: null
  };

  componentDidMount() {
    this.scrollToBot();
  }

  componentDidUpdate(prevProps, prevState) {

    if(prevProps.messages !== this.props.messages){
      console.log('New messages')
      if(!this.state.hasScrolledBottomInitial || !this.state.restoreScroll) {
        // ComponentDidMount does not scrolls to bottom on initial mount. Since on
        // initial mount there are only 6 items, not enough to scroll. And since waypoint
        // is on view, because everything is on view, more messages get fetched, 
        // which do need scroll.
        // So, for the scroll to start at the bottom when user firsts sees it, 
        // either this or fetching more items initial mount
        if(!this.state.hasScrolledBottomInitial) {
          console.log("Initial Scroll Bottom")
        } else {
          console.log("New messages from outside")
        }
        this.scrollToBot();
      } else {
        // When loading items, we dont want to have the scroll not move up or down. 
        // We want the user to view the same items, without the scroll moving all over the place
        // So we restore it
        this.restoreScroll();
      }
    }
    
  }
  restoreScroll(){
    console.log('Restoring scroll')
    this.messagesRef.current.scrollTop = this.messagesRef.current.scrollHeight - this.state.previousScrollheightMinusTop
    this.setState({
      previousScrollheightMinusTop: this.messagesRef.current.scrollHeight,
      restoreScroll: false,
    })
  }
  scrollToBot() {
    const { hasScrolledBottomInitial } = this.props;
    console.log('Scrolling to Bottom')
    
    this.messagesRef.current.scrollTop = this.messagesRef.current.scrollHeight;
    // We should get the scrollHeight before adding the items. But for now, this works
    // The problem is that a threshold can be added right now
    this.setState({
      previousScrollheightMinusTop: this.messagesRef.current.scrollHeight
    })
    // So view allways starts at the bottom. Maybe this can be moved to cDM
    if(!hasScrolledBottomInitial && this.messagesRef.current.scrollTop !== 0) {
      this.setState({
        hasScrolledBottomInitial: true
      })
    }
  }

  onEnter = (previousPosition, currentPosition) => {
    if (
      this.messagesRef &&
      this.messagesRef.current.scrollTop < 100
    ) {
      if (currentPosition === Waypoint.inside ||
        previousPosition === Waypoint.above
      ) {
        this.fetchMore();
      }
    }
  }
    fetchMore = () => {
        const { chatID, limit, messages, fetchMore } = this.props;
        // Doesn't repeat because frist we are setting loading =  true
        // And on updateQuary, when the fetch it done. We set loading = false
        console.log('Can i fetch?', !this.state.loading && this.state.hasMoreItems);
        if(this.state.loading || !this.state.hasMoreItems) return;
        const cursor = messages[messages.length - 1].createdAt;
        this.setState({ loading: true });
        fetchMore({
          variables: {
            chatID,
            limit,
            cursor
          },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            if (!fetchMoreResult) {
            }

            if (fetchMoreResult.getMessages.messages < this.props.limit) {
              this.setState({ hasMoreItems: false });
            }
            console.log("NEW", fetchMoreResult.getMessages.messages);
            console.log("PREVIOUS", previousResult.getMessages.messages);
            previousResult.getMessages.messages = [
              ...previousResult.getMessages.messages,
              ...fetchMoreResult.getMessages.messages
            ];
            this.setState({
              loading: false,
              restoreScroll: true,
            });

            return previousResult;
          }
        });

    }

  // UNSAFE_componentWillReceiveProps({ messages }) {
  //   if (
  //     this.props.messagesRef &&
  //     this.props.messagesRef.current.scrollTop < 100 &&
  //     this.props.messages &&
  //     messages &&
  //     this.props.messages.length !== messages.length
  //   ) {
  //     // 35 items
  //     const heightBeforeRender = this.props.messagesRef.current.scrollHeight;
  //     // wait for 70 items to render
  //     setTimeout(() => {
  //       this.props.messagesRef.current.scrollTop =
  //         this.props.messagesRef.current.scrollHeight - heightBeforeRender;
  //     }, 120);
  //   }
  // }
  // info = () => {
  //   message.info(
  //     moment(
  //       this.props.messages[this.props.messages.length - 1].createdAt
  //     ).format("dddd, MMMM Do YYYY")
  //   );
  // };
  renderTopMessage = (message)=>{
    return (
      <List.Item style={{color: 'blue'}}>
      {message}
      </List.Item>
    )
  }
  render() {
    //LOADING CAUSED INFINITE LOOP
    const { loading } = this.state;
    const { messages, hasMoreItems, children } = this.props;
    let topMessage = "default";
    if(loading){
      topMessage = "loading..."
    } else if(!hasMoreItems) {
      topMessage ="Looks like there is nothing else to see here"
    }
    const sortedMessages = messages.slice().sort((a,b) => {
      const aDate = moment(a.createdAt);
      const bDate = moment(b.createdAt);
      return aDate.diff(bDate);
    });
    console.log(sortedMessages)
    const MessageElements = sortedMessages.reduce((res, message, i)=>{

      let newElements = [<Message key={message.id} message={message} />]   
      const messageDate = moment(message.createdAt);
      // day of the month
      const dayOfTheMonth = messageDate.date(); 
      if(res.lastDayOfTheMonth !== dayOfTheMonth) {
        newElements = [<DateItem stickZIndex={i + 10}>{messageDate.format("dddd, MMMM Do YYYY")}</DateItem>].concat(newElements);
      }

      return { lastDayOfTheMonth: dayOfTheMonth, elements: res.elements.concat(newElements)}
    }, { lastDayOfTheMonth: null, elements: []});
    console.log('d',MessageElements)
    return (
      <Fragment>
      <div style={{position: 'relative', display: 'flex', flexDirection: "column"}}>
        <div
          className="chats"
          ref={this.messagesRef}
          style={{ backgroundColor: "#eee", height: '100%' }}
          onScroll={this.onScroll}
        >
        {this.renderTopMessage(topMessage)}
          <Waypoint
          topOffset={"-5%"}
            onEnter={({ previousPosition, currentPosition }) =>
              this.onEnter(
                previousPosition,
                currentPosition
              )
            }
          />
          {MessageElements.elements}
        </div>
        {children}
        </div>
      </Fragment>
    );
  }
}
export default MessageList;
