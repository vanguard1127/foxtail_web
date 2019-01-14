import React from "react";
import moment from "moment";
import UpdateSubBtn from "./UpdateSubBtn";
import CancelSubBtn from "./CancelSubBtn";

const BlackStatus = ({
  blkMemberInfo,
  ccLast4,
  visible,
  refetchUser,
  close,
  t
}) => {
  if (blkMemberInfo.active && ccLast4 === null) {
    return (
      <div>
        {t("Thanks for being a member")}.
        <br /> {t("Your membership will end")}:{" "}
        {moment(blkMemberInfo.renewalDate).format("MMMM DD YYYY")}
        <br />
        <UpdateSubBtn refetchUser={refetchUser} close={close} />
        <CancelSubBtn refetchUser={refetchUser} close={close} />
      </div>
    );
  } else if (blkMemberInfo.active) {
    return (
      <div>
        {t("Thanks for being a member")}.
        <br /> {t("Your credit card ending in")} {ccLast4}{" "}
        {t("will be charged on your renewal date")}:{" "}
        {moment(blkMemberInfo.renewalDate).format("MMMM DD YYYY")}
        <br />
        <UpdateSubBtn refetchUser={refetchUser} close={close} />
        <CancelSubBtn refetchUser={refetchUser} close={close} />
      </div>
    );
  } else {
    return (
      <button type="primary" htmlType="submit" onClick={visible}>
        {t("BECOME A BLACK MEMBER")}
      </button>
    );
  }
};

export default BlackStatus;
