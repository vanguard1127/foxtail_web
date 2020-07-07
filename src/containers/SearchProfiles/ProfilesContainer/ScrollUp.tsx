import React from 'react';
import { WithT } from 'i18next';
import ScrollUpButton from "react-scroll-up-button";

interface IScrollUpProps extends WithT {
    loading: boolean;
}
const ScrollUp: React.FC<IScrollUpProps> = ({ loading, t }) => {
    return (
        <div className="container mobile-margin-clr">
            <ScrollUpButton />
            <div className="col-md-12" style={{ flex: 1 }}>
                <div className="more-content-btn">
                    {loading ? (
                        <span>{t("common:Loading")}</span>
                    ) : (
                            <span>{t("nopros")}</span>
                        )}
                </div>
            </div>
        </div>
    )
}

export default ScrollUp;
