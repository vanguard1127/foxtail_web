import React, { PureComponent } from "react";
import MembersDropdown from "../common/MembersDropdown/MembersDropdown";
class GoingBar extends PureComponent {
  state = { remDropOpen: false };
  closeRemDropdown = () => this.setState({ remDropOpen: false });
  render() {
    const { id, participants, t, isOwner } = this.props;
    const { remDropOpen } = this.state;

    return (
      <div className="goings">
        <span className="stats">
          <div
            className="content"
            onClick={() => this.setState({ remDropOpen: !remDropOpen })}
          >
            <ul>
              {participants.map(el => (
                <li key={el.id}>
                  <img src={el.profilePic} alt="" />
                </li>
              ))}
            </ul>
            <span className="stats">
              <b>
                {participants.length} {t("common:people")}
              </b>{" "}
              {t("common:going")}
            </span>
          </div>
          {remDropOpen && (
            <MembersDropdown
              targetID={id}
              targetType={"event"}
              listType={"participants"}
              isOwner={isOwner}
              t={t}
              close={this.closeRemDropdown}
            />
          )}
        </span>
      </div>
    );
  }
}

export default GoingBar;
