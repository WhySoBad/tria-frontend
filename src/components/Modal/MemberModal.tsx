import { Member } from "client";
import React from "react";
import { ModalProps } from "./BaseModal";
import UserModal from "./UserModal";

interface MemberModalProps extends ModalProps {
  member: Member;
}

const MemberModal: React.FC<MemberModalProps> = ({ member, onClose, withBack }): JSX.Element => {
  return <UserModal user={member?.user} onClose={onClose} withBack={withBack} />;
};

export default MemberModal;
