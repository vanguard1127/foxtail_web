import React from 'react';
import { WithT } from 'i18next';

import Modal from "components/common/Modal";

interface IChatModalProps extends WithT {
    title: string;
    toggleDialog: () => void;
    msg: string;
    btnText: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const ChatModal: React.FC<IChatModalProps> = ({
    title,
    toggleDialog,
    msg,
    btnText,
    onConfirm,
    onCancel,
    t
}) => {
    return (
        <Modal
            header={title}
            close={toggleDialog}
            description={msg}
            okSpan={
                <span
                    className="color"
                    onClick={onConfirm}
                >
                    {btnText}
                </span>
            }
            cancelSpan={
                <React.Fragment>
                    <span
                        className="color"
                        onClick={onCancel}
                    >
                        {t("leaveBlock")}
                    </span>
                    <span className="description">
                        {t("leaveBlockwarn")}
                    </span>
                </React.Fragment>
            }
        />
    )
}

export default ChatModal;
