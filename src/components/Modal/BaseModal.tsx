import { Avatar, Backdrop, Fade, Modal } from "@material-ui/core";
import React from "react";
import style from "../../styles/modules/Modal.module.scss";
import { Group as GroupIcon } from "@material-ui/icons";
import Scrollbar from "../Scrollbar/Scrollbar";
import { usePalette } from "color-thief-react";
import { useState } from "react";
import { useEffect } from "react";

export interface ModalProps {
  open?: boolean;
  withBack?: boolean;
  onClose?: () => void;
}

export const ModalContainer: React.FC<ModalProps> = ({ open = false, withBack = false, onClose, children }): JSX.Element => {
  return (
    <Modal open={open} onClose={onClose} className={style["modal"]} closeAfterTransition BackdropComponent={Backdrop} BackdropProps={{ timeout: 500, invisible: withBack }}>
      <Fade in={open}>
        <section className={style["container"]} onClick={onClose}>
          <div className={style["content-container"]} children={children} onClick={(event: React.MouseEvent<HTMLDivElement, MouseEvent>) => event.stopPropagation()} />
        </section>
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
  const [color, setColor] = useState<string>();

  const { data, loading, error } = usePalette(avatar, 1, "hex", { quality: 15, crossOrigin: "anonymus" });

  useEffect(() => {
    setColor(error ? hex : data);
  }, [loading, error]);

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
};

export interface ModalContentProps {
  noScrollbar?: boolean;
}

export const ModalContent: React.FC<ModalContentProps> = ({ children, noScrollbar = false }): JSX.Element => {
  return <div className={style["content"]}>{!noScrollbar ? <Scrollbar children={children} /> : children}</div>;
};
