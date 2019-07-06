import React, { PureComponent } from "react";
import MembersDropdown from "../../common/MembersDropdown/MembersDropdown";
class EventShare extends PureComponent {
  state = { invDropOpen: false };
  closeInvDropdown = () => this.setState({ invDropOpen: false });
  render() {
    const {
      id,
      t,
      showShareModal,
      showBlockModal,
      ErrorHandler,
      ReactGA
    } = this.props;
    const { invDropOpen } = this.state;
    return (
      <>
        <div className="share-event">
          <span className="title">{t("share")}:</span>
          <ul>
            <li className="share">
              <span onClick={() => showShareModal()} />
            </li>
            <li className="add">
              <span
                onClick={() => this.setState({ invDropOpen: !invDropOpen })}
              />
            </li>
          </ul>
          {invDropOpen && (
            <MembersDropdown
              targetID={id}
              targetType={"event"}
              listType={"friends"}
              t={t}
              close={this.closeInvDropdown}
              ErrorHandler={ErrorHandler}
              ReactGA={ReactGA}
            />
          )}
        </div>
        <div className="report-con">
          <span className="rep-text">{t("reportlbl")}</span>
          <span className="report" onClick={showBlockModal} />
        </div>
      </>
    );
  }
}

export default EventShare;
