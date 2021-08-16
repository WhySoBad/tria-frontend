import { Avatar, Backdrop, Fade, Modal, IconButton } from "@material-ui/core";
import React from "react";
import style from "../../styles/modules/Modal.module.scss";
import { Group as GroupIcon, ChevronLeft as BackIcon, Close as CloseIcon } from "@material-ui/icons";
import { usePalette } from "color-thief-react";
import { useState, useEffect } from "react";
import cn from "classnames";

export interface ModalProps {
  open?: boolean;
  withBack?: boolean;
  onClose?: () => void;
  selectedTab?: number;
}

export const ModalContainer: React.FC<ModalProps> = ({ open = false, withBack = false, onClose, children }): JSX.Element => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      className={style["modal"]}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{ timeout: 500, invisible: withBack }}
      onContextMenu={(event) => event.preventDefault()}
    >
      <Fade in={open}>
        <section className={style["container"]} onClick={onClose}>
          <div className={style["content-container"]} children={children} onClick={(event: React.MouseEvent<HTMLDivElement, MouseEvent>) => event.stopPropagation()} />
        </section>
      </Fade>
    </Modal>
  );
};

interface BaseModalProps extends ModalProps {
  avatar: string;
  hex: string;
  name: string;
  tag: string;
  uuid: string;
  group?: boolean;
  icons?: Array<JSX.Element>;
}

export const BaseModal: React.FC<BaseModalProps> = ({ onClose, withBack, name, tag, uuid, children, group = false, avatar, hex, icons = [] }): JSX.Element => {
  const [color, setColor] = useState<string>();

  const { data, loading, error } = usePalette(avatar, 2, "hex", { quality: 15, crossOrigin: "anonymous" });

  useEffect(() => {
    if (error) setColor(hex);
    else setColor(Array.isArray(data) ? data[0] : data);
  }, [loading, error]);

  return (
    <>
      <div className={style["head"]} style={{ background: `linear-gradient(176deg, ${color} 29%, rgba(0,0,0,0.3) 100%)` }}>
        <div className={style["background"]} />
        <Avatar variant={"rounded"} className={style["avatar"]} src={avatar} style={{ backgroundColor: !avatar && color }} />
        <div className={style["text-container"]}>
          <div className={style["name"]}>
            <h3 children={name} />
            {group && <GroupIcon className={style["icon"]} />}
          </div>
          <div className={style["tag"]}>
            <code children={`@${tag}`} />
          </div>
        </div>
        <code children={uuid} className={style["uuid"]} onClick={() => navigator.clipboard.writeText(uuid)} />
        <div className={style["icon-container"]}>
          {withBack && <IconButton className={cn(style["iconbutton"], style["back"])} children={<BackIcon className={style["icon"]} />} onClick={onClose} />}
          {icons.map((value, index) => ({ ...value, key: index }))}
          {!withBack && <IconButton className={style["iconbutton"]} children={<CloseIcon className={style["icon"]} />} onClick={onClose} />}
        </div>
      </div>
      <div className={style["content"]} children={children} />
    </>
  );
};
