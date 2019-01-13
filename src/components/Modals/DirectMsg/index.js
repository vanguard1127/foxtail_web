import React, { Component } from "react";
import { Mutation } from "react-apollo";
import { withNamespaces } from "react-i18next";
import { SEND_MESSAGE } from "queries";

class DirectMsg extends Component {
  state = { text: "" };

  handleTextChange = event => {
    this.setState({ text: event.target.value });
  };

  handleSubmit = sendMessage => {
    sendMessage()
      .then(async ({ data }) => {
        if (data.sendMessage) {
          console.log("sent");
          // message.success("Message Sent");
          this.setState({ text: "" });
          this.props.close();
        } else {
          console.log("Message not sent.");
          //  message.error("Message not sent.");
        }
      })
      .catch(res => {
        console.log(res);
        const errors = res.graphQLErrors.map(error => {
          return error.message;
        });

        //TODO: send errors to analytics from here
        this.setState({ errors });
      });
  };

  render() {
    const { close, profile, t } = this.props;
    const { text } = this.state;
    return (
      <section className="popup-content show">
        <div className="container">
          <div className="col-md-12">
            <div className="row">
              <div className="offset-md-3 col-md-6">
                <div className="modal-popup photo-verification">
                  <div className="m-head">
                    <span className="heading">
                      {profile
                        ? t("Send Message") +
                          " " +
                          profile.users.map((user, index) => {
                            if (index === 0) return user.username;
                            else return +" & " + user.username;
                          }) +
                          "?"
                        : t("Send Message")}
                    </span>
                    <span className="close" onClick={close} />
                  </div>
                  <div className="m-body">
                    <input
                      placeholder={t("Write Message Here...")}
                      value={text}
                      onChange={this.handleTextChange}
                    />
                    {text !== "" ? (
                      <Mutation
                        mutation={SEND_MESSAGE}
                        variables={{
                          text,
                          invitedProfile: profile.id
                        }}
                      >
                        {(sendMessage, { loading, error }) => {
                          return (
                            <button
                              onClick={() => this.handleSubmit(sendMessage)}
                            >
                              {t("Send")}
                            </button>
                          );
                        }}
                      </Mutation>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}
export default withNamespaces()(DirectMsg);
