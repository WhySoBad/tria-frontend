import { Backdrop, Fade, IconButton, Modal } from "@material-ui/core";
import { ChevronLeft as BackIcon, Close as CloseIcon, Group as GroupIcon } from "@material-ui/icons";
import cn from "classnames";
import { getPalette } from "color-thief-react";
import React, { useEffect, useState } from "react";
import style from "../../styles/modules/Modal.module.scss";
import { hexToHsl } from "../../util";
import Avatar from "../Avatar";

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

  useEffect(() => {
    let mounted: boolean = true;
    if (!avatar) setColor(hex);
    else {
      getPalette(avatar, 3, "hex", "anonymous", 15).then((colors: Array<string>) => {
        const hsl: { h: number; s: number; l: number } = hexToHsl(colors[0]);
        if (hsl.l < 20 && hsl.s !== 0) mounted && setColor(colors[2]);
        else if (hsl.s === 0 && hsl.l < 30) mounted && setColor("#333333");
        else mounted && setColor(colors[0]);
      });
    }
    return () => {
      mounted = false;
    };
  }, [avatar, hex]);

  return (
    <>
      <div className={style["head"]} style={{ background: `linear-gradient(176deg, ${color} 29%, rgba(0,0,0,0.3) 100%)` }}>
        <div className={style["background"]} />
        <Avatar variant={"rounded"} className={style["avatar"]} src={avatar} color={color} />
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
