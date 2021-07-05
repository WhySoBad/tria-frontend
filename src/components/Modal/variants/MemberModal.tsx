import { Member } from "client";
import React from "react";
import { ModalProps } from "../Modal";
import UserModal from "./UserModal";

interface MemberModalProps extends ModalProps {
  member: Member;
}

const MemberModal: React.FC<MemberModalProps> = ({ member, ...rest }): JSX.Element => {
  return <UserModal user={member.user} {...rest} />;
};

export default MemberModal;
