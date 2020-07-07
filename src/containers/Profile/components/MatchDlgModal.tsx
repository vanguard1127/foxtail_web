import React from 'react';
import { WithT } from 'i18next';
import Modal from "components/common/Modal";

interface IMatchDlgModal extends WithT {
    onConfirm: () => void;
    closeModal: () => void;
    profileName: string;
}

const MatchDlgModal: React.FC<IMatchDlgModal> = ({
    onConfirm,
    closeModal,
    profileName,
    t,
}) => {
    return (
        <Modal
            header={t("common:match")}
            close={closeModal}
            okSpan={
                <span className="color" onClick={onConfirm}                >
                    {t("common:chatnow")}
                </span>
            }
            cancelSpan={
                <span className="border" onClick={closeModal}>
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

export default MatchDlgModal;
