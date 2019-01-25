import React, { Component } from "react";
import ReactJoyride, { ACTIONS, EVENTS, STATUS } from "react-joyride";

class Controlled extends Component {
  members;
  profile;
  events;
  inbox;
  myaccount;
  constructor(props) {
    super(props);
    this.state = {
      run: false,
      steps: [],
      stepIndex: 0
    };
  }

  componentDidMount() {
    this.setState({
      run: true,
      steps: [
        {
          target: this.members,
          content: (
            <div>
              You can interact with your own components through the spotlight.
              <br />
              Click the menu above!
            </div>
          ),
          textAlign: "center",
          placement: "bottom",
          disableBeacon: true,
          disableOverlayClose: true,
          hideCloseButton: true,
          hideFooter: true,
          spotlightClicks: true,
          styles: {
            options: {
              zIndex: 10000
            }
          },
          title: "Menu"
        },
        {
          target: this.events,
          content: (
            <div>
              You can interact with your own components through the spotlight.
              <br />
              Click the menu above!
            </div>
          ),
          textAlign: "center",
          placement: "bottom",

          styles: {
            options: {
              zIndex: 10000
            }
          },
          title: "Events"
        }
      ]
    });
  }

  handleNext = e => {
    e.preventDefault();

    this.setState({
      stepIndex: this.state.stepIndex + 1
    });
  };

  handleJoyrideCallback = data => {
    const { action, index, type, status } = data;

    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      // Need to set our running state to false, so we can restart if we click start again.
      this.setState({ run: false, stepIndex: 0 });
    } else if ([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND].includes(type)) {
      const stepIndex = index + (action === ACTIONS.PREV ? -1 : 1);

      // Update state to advance the tour
      this.setState({
        stepIndex
      });
    }
  };

  setRef = el => {
    if (!el) return;
    const { dataset } = el;

    this[dataset.name] = el;
  };

  render() {
    const { run, steps, stepIndex } = this.state;

    return (
      <ReactJoyride
        continuous
        run={run}
        steps={steps}
        stepIndex={stepIndex}
        scrollToFirstStep
        showProgress
        showSkipButton
        callback={this.handleJoyrideCallback}
      />
    );
  }
}

export default Controlled;
