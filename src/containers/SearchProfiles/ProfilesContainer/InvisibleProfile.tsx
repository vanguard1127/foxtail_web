import React from 'react';
import { WithT } from 'i18next';

const InvisibleProfile: React.FC<WithT> = ({ t }) => {
    return (
        <section className="not-found">
            <div className="container">
                <div className="col-md-12">
                    <div className="icon">
                        <i className="nico blackmember" />
                    </div>
                    <span className="head">{t("cantsee")}</span>
                    <span className="description">{t("cantseeinstr")}</span>
                </div>
            </div>
        </section>
    )
}

export default InvisibleProfile;
