import React from 'react';
import { WithT } from 'i18next';

import * as ErrorHandler from 'components/common/ErrorHandler';

interface IChatErrorProps extends WithT {
    error: any;
    userID: string;
    chatID: string;
}

const ChatError: React.FC<IChatErrorProps> = ({
    error,
    userID,
    chatID,
    t,
}) => {
    return (
        <section className="not-found">
            <div className="container">
                <div className="col-md-12">
                    <div className="icon">
                        <i className="nico x" />
                    </div>
                    <span className="head">
                        {t("Chat No Longer Available")}
                    </span>
                    <span className="description">
                        {t("This chat is no longer available")}
                    </span>
                    <span style={{ display: "none" }}>
                        <ErrorHandler.report
                            error={error}
                            calledName={"getMessages"}
                            userID={userID}
                            targetID={chatID}
                            type="chat"
                        />
                    </span>
                </div>
            </div>
        </section>
    )
}

export default ChatError;
