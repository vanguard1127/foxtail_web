import React from "react";
import { Button } from "antd";
import moment from "moment";
import UpdateSubBtn from "./UpdateSubBtn";
import CancelSubBtn from "./CancelSubBtn";

const BlackStatus = ({
  blkMemberInfo,
  ccLast4,
  visible,
  refetchUser,
  close
}) => {
  if (blkMemberInfo.active && ccLast4 === null) {
    return (
      <div>
        Thanks for being a member.
        <br /> Your membership will end:{" "}
        {moment(blkMemberInfo.renewalDate).format("MMMM DD YYYY")}
        <br />
        <UpdateSubBtn refetchUser={refetchUser} close={close} />
        <CancelSubBtn refetchUser={refetchUser} close={close} />
      </div>
    );
  } else if (blkMemberInfo.active) {
    return (
      <div>
        Thanks for being a member.
        <br /> Your credit card ending in {ccLast4} will be charged on your
        renewal date: {moment(blkMemberInfo.renewalDate).format("MMMM DD YYYY")}
        <br />
        <UpdateSubBtn refetchUser={refetchUser} close={close} />
        <CancelSubBtn refetchUser={refetchUser} close={close} />
      </div>
    );
  } else {
    return (
      <Button type="primary" htmlType="submit" onClick={visible}>
        BECOME A BLACK MEMBER
      </Button>
    );
  }
};

export default BlackStatus;
