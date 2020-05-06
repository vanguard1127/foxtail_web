import React from 'react';
import Modal from "components/common/Modal";
import { WithT } from 'i18next';

interface ILikesMatchModalProps extends WithT {
    onConfirm: () => void;
    onClose: () => void;
    profileName: string;
}

const LikesMatchModal: React.FC<ILikesMatchModalProps> = ({
    onConfirm,
    onClose,
    profileName,
    t
}) => {
    return (
        <Modal
            header={t("common:match")}
            close={onClose}
            okSpan={
                <span className="color" onClick={onConfirm}>
                    {t("common:chatnow")}
                </span>
            }
            cancelSpan={
                <span className="border" onClick={onClose}>
                    {t("common:chatltr")}
                </span>
            }
        >
            <span
                className="description"
                style={{ fontSize: "20px", paddingBottom: "35px" }}
            >
                {`${t("common:youand")} ${profileName} ${t("common:likeach")}`}
            </span>
        </Modal>
    )
}

export default LikesMatchModal;
