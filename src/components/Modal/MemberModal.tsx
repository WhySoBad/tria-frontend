import { User, UserPreview } from "client";
import React from "react";
import UserModal from "./UserModal";

interface MemberModalProps {
  user: User | UserPreview;
  open?: boolean;
  withBack?: boolean;
  onClose: () => void;
}

const MemberModal: React.FC<MemberModalProps> = ({ user, open, onClose, withBack }): JSX.Element => {
  return <UserModal user={user} open={open} onClose={onClose} withBack={withBack} />;
};

export default MemberModal;
