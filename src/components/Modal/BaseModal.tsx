import { Avatar, Backdrop, Fade, Modal } from "@material-ui/core";
import React from "react";
import style from "../../styles/modules/Modal.module.scss";
import { Group as GroupIcon } from "@material-ui/icons";

export interface ModalProps {
  open?: boolean;
  withBack?: boolean;
  onClose?: () => void;
}

export const ModalContainer: React.FC<ModalProps> = ({ open = false, withBack = false, onClose, children }): JSX.Element => {
  return (
    <Modal open={open} onClose={onClose} className={style["modal"]} closeAfterTransition BackdropComponent={Backdrop} BackdropProps={{ timeout: 500, invisible: withBack }}>
      <Fade in={open}>
        <section className={style["container"]} children={children} />
      </Fade>
    </Modal>
  );
};

export interface ModalHeadProps {
  hex: string;
  name: string;
  tag: string;
  uuid: string;
  group?: boolean;
}

export const ModalHead: React.FC<ModalHeadProps> = ({ hex, name, tag, uuid, children, group = false }): JSX.Element => {
  return (
    <div className={style["head"]}>
      <div className={style["background"]} style={{ background: `linear-gradient(176deg, #${hex} 29%, rgba(0,0,0,1) 100%)` }} />
      <Avatar variant={"rounded"} className={style["avatar"]} />
      <div className={style["text-container"]}>
        <div className={style["name"]}>
          <h3 children={name} />
          {group && <GroupIcon className={style["icon"]} />}
        </div>
        <div className={style["tag"]}>
          <code children={`${tag}`} />
        </div>
      </div>
      <code children={uuid} className={style["uuid"]} />
      <div className={style["icon-container"]}>{children}</div>
    </div>
  );
};

export interface ModalContentProps {}

export const ModalContent: React.FC<ModalContentProps> = ({ children }): JSX.Element => {
  return <div className={style["content"]} children={children} />;
};
