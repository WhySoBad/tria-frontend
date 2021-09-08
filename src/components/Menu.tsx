import React, { forwardRef } from "react";
import style from "../../styles/modules/Menu.module.scss";
import { FormControlLabel, Menu as BaseMenu, MenuProps as BaseMenuProps } from "@material-ui/core";
import { useState } from "react";
import { useRef } from "react";
import { debounce } from "../util";
import { Checkbox } from "./Input";

interface MenuProps extends BaseMenuProps {}

const Menu: React.FC<MenuProps> = forwardRef(({ ...props }, ref): JSX.Element => {
  return (
    <BaseMenu
      classes={{ paper: style["container"], list: style["list"] }}
      getContentAnchorEl={null}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      ref={ref}
      {...props}
    />
  );
});

interface MenuItemProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  autoClose?: boolean;
  onClose?: (open: false) => void;
  nested?: NestedMenuProps;
  critical?: boolean;
}

export const MenuItem: React.FC<MenuItemProps> = forwardRef(({ children, critical = false, autoClose = true, onClick, onClose, nested, onMouseOver, ...props }, ref): JSX.Element => {
  const [nestedOpen, setNestedOpen] = useState<boolean>(false);
  const anchorRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <div
        ref={anchorRef}
        className={style["item-container"]}
        data-critical={critical}
        onClick={(event) => {
          if (autoClose) onClose && onClose(false);
          onClick && onClick(event);
        }}
        onMouseOver={(event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
          onMouseOver && onMouseOver(event);
          nested && debounce(() => setNestedOpen(true), 250);
        }}
        onMouseLeave={() => nested && debounce(() => setNestedOpen(false), 250)}
        {...props}
      >
        {children}
      </div>
      {nested && (
        <NestedMenu
          anchorEl={anchorRef.current}
          onClose={(...props) => {
            nested.onClose && nested.onClose(...props);
            setNestedOpen(false);
          }}
          onMouseEnter={() => debounce(() => setNestedOpen(true), 250)}
          onMouseLeave={() => debounce(() => setNestedOpen(false), 250)}
          {...nested}
          open={nestedOpen}
        />
      )}
    </>
  );
});

interface CheckboxMenuItemProps extends MenuItemProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheck?: (checked: boolean) => void;
}

export const CheckboxMenuItem: React.FC<CheckboxMenuItemProps> = forwardRef(
  ({ onCheck, defaultChecked, children, critical = false, autoClose = true, onClick, onClose, nested, onMouseOver, checked = false, ...props }, ref): JSX.Element => {
    const [nestedOpen, setNestedOpen] = useState<boolean>(false);
    const anchorRef = useRef<HTMLDivElement>(null);

    return (
      <>
        <div
          ref={anchorRef}
          className={style["checkbox-item-container"]}
          data-critical={critical}
          onClick={(event) => {
            if (autoClose) onClose && onClose(false);
            onClick && onClick(event);
          }}
          onMouseOver={(event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            onMouseOver && onMouseOver(event);
            nested && debounce(() => setNestedOpen(true), 250);
          }}
          onMouseLeave={() => nested && debounce(() => setNestedOpen(false), 250)}
          {...props}
        >
          <FormControlLabel classes={{ label: style["text"] }} label={children} control={<Checkbox checked={checked} onChange={() => onCheck && onCheck(!checked)} />} />
        </div>
        {nested && (
          <NestedMenu
            anchorEl={anchorRef.current}
            onClose={(...props) => {
              nested.onClose && nested.onClose(...props);
              setNestedOpen(false);
            }}
            onMouseEnter={() => debounce(() => setNestedOpen(true), 250)}
            onMouseLeave={() => debounce(() => setNestedOpen(false), 250)}
            {...nested}
            open={nestedOpen}
          />
        )}
      </>
    );
  }
);

interface NestedMenuProps extends MenuProps {}

export const NestedMenu: React.FC<NestedMenuProps> = forwardRef(({ children, onClose, ...props }, ref): JSX.Element => {
  return (
    <Menu
      ref={ref}
      style={{ pointerEvents: "none", marginLeft: "0.5rem" }}
      elevation={0}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      onMouseLeave={() => {
        onClose && onClose({}, "escapeKeyDown");
      }}
      onClose={onClose}
      {...props}
      children={<div style={{ pointerEvents: "auto" }} children={children} />}
    />
  );
});

export default Menu;
