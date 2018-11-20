import React, { Component, Fragment } from "react";
import Waypoint from "react-waypoint";
import Message from "./Message.js";
import { List } from "antd";
import moment from "moment";


class DateItem extends Component {
  state = {
    position: null
  }
  componentDidMount(){
    // When Waypoint mountsit only calls waypoints on screen. But the parent needs
    // to know everyone's position. So we asume position = above if waypoint did called
    if(!this.state.position){
      this.setState({
        position: 'above'
      })
      if(this.props.onAbove)
      this.props.onAbove();
    }
  }
  onEnter = ({previousPosition, currentPosition}) => {
    if(currentPosition === Waypoint.inside) {
      this.setState({
        position: 'inside'
      })
      if(this.props.onInside)
      this.props.onInside();
    }
  }
  onLeave = ({previousPosition, currentPosition}) => {
    if(currentPosition === Waypoint.above) {
      this.setState({
        position: 'above'
      })
      if(this.props.onAbove)
      this.props.onAbove();
    }
  }
  renderDate({style = {},children}){
    return (<div 
      style={{
        margin: "0 -20px 0 -20px",
        background: "#ffffff70",
        padding: '20px 0',
        textAlign: 'center',
        ...style }}
      >
      {children}
      </div>
    );
  }
  render(){
    const { stickZIndex, showDate, children } = this.props;
    const stickStyles = {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: stickZIndex || 10,
      backgroundColor: '#add8e6',
      padding: "20px 37px 20px 20px",
      margin: '0 17px 0 0',
    }
    return (<Fragment>
      <Waypoint bottom="100%" onEnter={this.onEnter} onLeave={this.onLeave} />
      {this.renderDate({style:{},children})}
      { showDate ? this.renderDate({style: stickStyles, children}) : null}
    </Fragment>
 )
  }
} 
class MessageList extends Component {
  constructor(props) {
    super(props);
    this.scrollWrapperRef = React.createRef();
    this.lastMessageRef = React.createRef();
  }
  state = {
    loading: false,
    restoreScroll: false,
    hasMoreItems: true,
    previousClientHeight: null,
    previousScrollHeight: null,
    previousScrollTop: null,
    dateWaypoints: [],
  };

  componentDidMount() {
    this.checkScrollTopToFetch(10);
    this.scrollToBot();
  }
  componentDidUpdate(prevProps, prevState) {
    if(prevProps.messages !== this.props.messages){
      // If the user is on the bottom waiting for new messages, scroll him whenever one gets received
      const isUserOnBottom = this.scrollWrapperRef.current.clientHeight + this.scrollWrapperRef.current.scrollTop > this.scrollWrapperRef.current.scrollHeight - this.lastMessageRef.current.clientHeight - 20;
      if(!this.state.hasScrolledBottomInitial || isUserOnBottom ) {
        // ComponentDidMount does not scrolls to bottom on initial mount. Since on
        // initial mount there are only 6 items, not enough to scroll. And since waypoint
        // is on view, because everything is on view, more messages get fetched, 
        // which do need scroll.
        // So, for the scroll to start at the bottom when user firsts sees it, 
        // either this or fetching more items initial mount
        if(!this.state.hasScrolledBottomInitial) {
          console.log("Initial Scroll Bottom")
        }
        this.scrollToBot();
      } else if(this.state.restoreScroll) {
        // When loading items, we dont want to have the scroll not move up or down. 
        // We want the user to view the same items, without the scroll moving all over the place
        // So we restore it
        this.restoreScroll();
      }
    }
    
  }
  restoreScroll(){
    console.log('restoring');
    this.scrollWrapperRef.current.scrollTop = this.state.previousScrollTop + (this.scrollWrapperRef.current.scrollHeight - this.state.previousScrollHeight)
    
    this.setState({
      previousScrollHeight: this.scrollWrapperRef.current.scrollHeight,
      previousScrollTop: this.scrollWrapperRef.current.scrollTop,
      restoreScroll: false,
    })
  }
  scrollToBot() {
    const { hasScrolledBottomInitial } = this.props;
    console.log('Scrolling to Bottom')
    
    this.scrollWrapperRef.current.scrollTop = this.scrollWrapperRef.current.scrollHeight;
    this.setState({
      previousClientHeight: this.scrollWrapperRef.current.clientHeight,
      previousScrollHeight: this.scrollWrapperRef.current.scrollHeight,
      previousScrollTop: this.scrollWrapperRef.current.scrollTop
    })

    // So view always should start at the bottom. 
    // The idea is to scroll to bottom when the component is rendered with the messages
    // But, in componentDidMount all initial messages are not loaded yet.
    // So we fetch until all intial messages are loaded. Stoping when messages cover all the scrollview
    // or when there are not more messages. Then on componentDidUpdate, this gets 
    // executed to scroll to bottom
    if(!hasScrolledBottomInitial && this.scrollWrapperRef.current.scrollTop !== 0) {
      this.setState({
        hasScrolledBottomInitial: true
      })
    }
  }
    fetchMore = () => {
        const { chatID, limit, messages, fetchMore } = this.props;
        // Doesn't repeat because frist we are setting loading =  true
        // And on updateQuary, when the fetch it done. We set loading = false
        console.log('Can i fetch?', !this.state.loading && this.state.hasMoreItems);
        // Wait for restoreScroll to take place, then do the call.
        // If not,things are going to play over each other.
        if(this.state.loading || !this.state.hasMoreItems || this.state.restoreScroll) return;
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
            
            const noMessagesLeft = fetchMoreResult.getMessages.messages < this.props.limit
            if (noMessagesLeft) {
              this.setState({ hasMoreItems: false });
            }
            console.log('more',fetchMoreResult.getMessages.messages < this.props.limit)
            previousResult.getMessages.messages = [
              ...previousResult.getMessages.messages,
              ...fetchMoreResult.getMessages.messages
            ];
            console.log("Fetch done")
            
            this.setState({
              loading: false,
              // When no more messages don't restore. It is not needed and it caused 
              // the chat to restore on the next componentDidUpdate
              restoreScroll: !noMessagesLeft && this.scrollWrapperRef.current.scrollHeight > this.scrollWrapperRef.current.clientHeight,
              dateWaypoints: []
            });

            return previousResult;
          }
        });

    }
  renderTopMessage = (message)=>{
    return (
      <List.Item style={{color: 'blue'}}>
      {message}
      </List.Item>
    )
  }
  onDateWaypointPostion = (i, position)=>{
    if(this.state.dateWaypoints[i] === position) return;
    // 
    // Perhaps find another way to tell the parent children position
    // parent needs children position to tell the alst above item to render as absolute
    const newDateWaypoints = this.state.dateWaypoints;
    newDateWaypoints[i] = position;
    this.setState({
      dateWaypoints: newDateWaypoints,
    })
  }
  onScroll = (ev)=>{
    // Create scroll event handler here instead of on render for better performance.
    this.checkScrollTopToFetch(100)
  }
  checkScrollTopToFetch(THRESHOLD){
    // Dont allow the user to scroll if loading more messages
    if(this.state.loading){
      this.scrollWrapperRef.current.scrollTop = this.state.previousScrollTop
    }
    // Keep around the scrollTop around to use later on restoreScroll & scrolltoBottom
    this.setState({
        previousScrollTop: this.scrollWrapperRef.current.scrollTop
    })
    // If is close to the top, then fetch 
    if(this.scrollWrapperRef.current.scrollTop < THRESHOLD){
      this.fetchMore();
    }
  }
  render() {
    const { loading } = this.state;
    const { messages, hasMoreItems, children } = this.props;
    let topMessage = "default";
    if(loading){
      topMessage = "loading..."
    } else if(!hasMoreItems) {
      topMessage ="Looks like there is nothing else to see here"
    }
    // Messages already come in order. Just in case.
    const messagesSortedByDate = messages.slice().sort((a,b) => {
      const aDate = moment(a.createdAt);
      const bDate = moment(b.createdAt);
      return aDate.diff(bDate);
    });
    // Every DateItem reports its position and this function
    // finds the last DateItem that is above. Meaning, the one right above the scrollView
    const lastAboveDateWaypointIndex = this.state.dateWaypoints.reduce((res,cur,i)=>{
      if(cur === 'above') return i;
      return res;
    }, 0) // default to first item when none are above.

    // Using Reduce so we can insert DateItem
    // Subject to change, messages could be formated in a better way in the futurue
    const MessageElements = messagesSortedByDate.reduce((res, message, i)=>{
      // This gives a ref to the item on the bottom of the chat
      // With that, we can measure it and determine if we should scroll 
      // to bottom on new message
      let extraProps = {}
      if(i > messagesSortedByDate.length - 2 ) {
        extraProps.ref = this.lastMessageRef;
      }
      let elements = [<Message key={message.id} message={message} {...extraProps} />]   
      // Check if last message's date is different current message's date
      // to figure out if a dateItem sould be inserted
      const messageDate = moment(message.createdAt);
      const dayOfTheMonth = messageDate.date(); 
      const lastDayOfTheMonth = res.lastDate && res.lastDate.date();
      const isSameDay = lastDayOfTheMonth === dayOfTheMonth
      if(!isSameDay) {
        elements = [<DateItem
        stickZIndex={i + 10}
        onAbove={()=>{ this.onDateWaypointPostion(res.nDate, 'above')}}
        onInside={()=>{ this.onDateWaypointPostion(res.nDate, 'inside')}}
        showDate={lastAboveDateWaypointIndex === res.nDate}
        // Keys won't collied because DateItems's dates are days appart from each other 
        key={messageDate.format()}
        
        >{messageDate.format("dddd, MMMM Do YYYY")}</DateItem>].concat(elements);
      }
      // Keep the last date around so we can compare to it on next iteration
      return { lastDate: messageDate, nDate: isSameDay ? res.nDate : res.nDate + 1 ,elements: res.elements.concat(elements)}
    }, { lastDayOfTheMonth: null, nDate: 0, elements: []});
    return (
      <Fragment>
      <div style={{position: 'relative', display: 'flex', flexDirection: "column", height: '100%', overflow: 'hidden'}}>
        <div
          className="chats"
          ref={this.scrollWrapperRef}
          style={{ backgroundColor: "#eee", height: '100%' }}
          onScroll={this.onScroll}
        >
        {this.renderTopMessage(topMessage)}
          {MessageElements.elements}
        </div>
        {children}
        </div>
      </Fragment>
    );
  }
}
export default MessageList;
