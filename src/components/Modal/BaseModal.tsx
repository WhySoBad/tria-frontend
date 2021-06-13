import { Avatar, Backdrop, Fade, Modal } from "@material-ui/core";
import React from "react";
import style from "../../styles/modules/Modal.module.scss";
import { Group as GroupIcon } from "@material-ui/icons";
import Scrollbar from "../Scrollbar/Scrollbar";
import Color, { useColor, Palette } from "color-thief-react";

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
  avatar: string;
  hex: string;
  name: string;
  tag: string;
  uuid: string;
  group?: boolean;
}

export const ModalHead: React.FC<ModalHeadProps> = ({ name, tag, uuid, children, group = false, avatar, hex }): JSX.Element => {
  return (
    <Palette colorCount={2} src={avatar} format={"hex"} crossOrigin={"anonymus"}>
      {({ data, loading, error }) => {
        const color = error ? hex : loading ? "" : data[0];
        return (
          <div className={style["head"]} style={{ background: `linear-gradient(176deg, ${color} 29%, rgba(0,0,0,0.3) 100%)` }}>
            <div className={style["background"]} />
            <Avatar variant={"rounded"} className={style["avatar"]} alt={name} src={avatar} style={{ backgroundColor: color }} />
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
      }}
    </Palette>
  );
};

export interface ModalContentProps {
  noScrollbar?: boolean;
}

export const ModalContent: React.FC<ModalContentProps> = ({ children, noScrollbar = false }): JSX.Element => {
  return <div className={style["content"]}>{!noScrollbar ? <Scrollbar children={children} /> : children}</div>;
};
