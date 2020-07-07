import React from 'react';
import { WithT } from 'i18next';

interface IInviteFriendsProps extends WithT {
    toggleShareModal: () => void;
}

const InviteFriends: React.FC<IInviteFriendsProps> = ({ t, toggleShareModal }) => {
    return (
        <section className="not-found">
            <div className="container">
                <div className="col-md-12">
                    <div className="icon">
                        <i className="nico magnifier" />
                    </div>
                    <span className="head">{t("nomems")}</span>
                    <span className="description">{t("nomemsdes")}</span>
                    <span className="description">- {t("and")} -</span>
                    <span
                        className="greenButton"
                        style={{
                            width: "200px",
                            margin: "auto",
                            display: "table"
                        }}
                        onClick={toggleShareModal}
                    >
                        {t("Invite Your Friends")}
                    </span>
                </div>
            </div>
        </section>
    )
}

export default InviteFriends;
