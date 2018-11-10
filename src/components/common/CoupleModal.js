import React, { Component } from "react";
import { GENERATE_CODE, LINK_PROFILE, UNLINK_PROFILE } from "../../queries";
import { Query, Mutation } from "react-apollo";
import { Modal, Input, Divider, Button, Checkbox, Carousel } from "antd";
import { EmailShareButton, EmailIcon } from "react-share";

class CoupleModal extends Component {
  state = {
    code: "",
    currentSlide: 0,
    title: "Join me on Foxtail",
    shareUrl: ""
  };

  handleTextChange = event => {
    this.setState({ code: event.target.value });
  };

  handleLink = (linkProfile, close) => {
    if (this.state.code !== "") {
      linkProfile().then(({ data }) => {
        close();
        this.props.setPartnerID(data.linkProfile.partnerName);
      });
    }
  };

  next() {
    this.slider.next();
    console.log(this.state.currentSlide);
  }

  prev() {
    this.slider.prev();
    console.log(this.state.currentSlide);
  }

  handleUnLink = async (unlinkProfile, close) => {
    console.log("TEST");
    await unlinkProfile().then(({ data }) => {
      //switch to new screen for do u want to edit?
      close();
      this.props.setPartnerID("Add Partner");
    });
  };

  render() {
    const { visible, close, username } = this.props;
    const { code } = this.state;
    if (username) {
      return this.showDeleteConfirm(visible, close, username);
    }
    return this.showLikeModal(visible, close, code);
  }

  // updateCouple = (cache, { data: { linkProfile } }) => {
  //   console.log(cache);
  //   const { getSettings } = cache.readQuery({ query: GET_SETTINGS });

  //   if (linkProfile) {
  //     getSettings.couplePartner = linkProfile;
  //   } else {
  //     getSettings.couplePartner = null;
  //   }
  //   console.log("send to", getSettings);
  //   cache.writeQuery({
  //     query: GET_SETTINGS,
  //     data: {
  //       getSettings: {
  //         ...getSettings
  //       }
  //     }
  //   });
  // };

  showLikeModal(visible, close, code) {
    const { title } = this.state;
    const settings = {
      dots: false,
      speed: 500,
      afterChange: current => this.setState({ currentSlide: current })
    };
    return (
      <Modal
        title={"Couple Profile Managment"}
        centered
        visible={visible}
        onCancel={close}
        footer={[
          <Button key="submit" type="primary" onClick={close}>
            OK
          </Button>
        ]}
      >
        <Carousel ref={c => (this.slider = c)} {...settings}>
          <Query query={GENERATE_CODE} fetchPolicy="cache-first">
            {({ data, loading, error }) => {
              if (loading) {
                return <div>Loading</div>;
              }
              if (error) {
                return <div>Error: {error.message}</div>;
              }
              return (
                <div>
                  <div>
                    <b>Did you recieve a Couple's Code?</b>
                    <br />
                    Add your Couple's Code here and click Next:
                  </div>
                  <br />
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column"
                    }}
                  >
                    <Input
                      placeholder="Couple's Code"
                      onChange={this.handleTextChange}
                    />

                    <Button
                      disabled={this.state.code !== "" ? false : true}
                      onClick={() => this.next()}
                    >
                      Next
                    </Button>
                  </div>

                  <Divider>OR</Divider>
                  <div>
                    <b>Want to create a Couple Profile?</b> <br />
                    Send this Couple's Code to your partner:
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      flexDirection: "column"
                    }}
                  >
                    <h4>{data.generateCode}</h4>
                    <br />
                    <Checkbox>
                      Include Messages and Events in Couple Profile?
                    </Checkbox>
                    <EmailShareButton
                      url={code}
                      subject={title}
                      body={title + ". Check out more details here:" + code}
                      className="Demo__some-network__share-button"
                    >
                      <EmailIcon size={32} round />
                    </EmailShareButton>
                  </div>
                </div>
              );
            }}
          </Query>
          <div>
            Would you like to include you Messages and Events in this Couple
            Profile?
            <Checkbox>Include Messages and Events in Couple Profile</Checkbox>
            <Button
              disabled={this.state.code !== "" ? false : true}
              onClick={() => this.prev()}
            >
              Back
            </Button>
            <Mutation
              mutation={LINK_PROFILE}
              variables={{
                code
              }}
            >
              {(linkProfile, { dataMut, loading, error }) => (
                <Button
                  disabled={this.state.code !== "" ? false : true}
                  onClick={() => this.handleLink(linkProfile, close)}
                >
                  Link
                </Button>
              )}
            </Mutation>
          </div>
        </Carousel>
      </Modal>
    );
  }

  showDeleteConfirm(visible, close, username, unlinkProfile) {
    return (
      <Mutation mutation={UNLINK_PROFILE}>
        {(unlinkProfile, { dataMut, loading, error }) => {
          if (loading) {
            return <div>Loading</div>;
          }
          if (error) {
            return <div>Error: {error.message}</div>;
          }
          return (
            <Modal
              title={"Want to remove your link to " + username + "?"}
              centered
              visible={visible}
              okType="danger"
              okText="Yes"
              onOk={() => this.handleUnLink(unlinkProfile, close)}
              onCancel={close}
              cancelText="No"
            >
              <div>
                Your couple profile will be deactivated and your profiles will
                revert to single profiles
              </div>
            </Modal>
          );
        }}
      </Mutation>
    );
  }
}

export default CoupleModal;
