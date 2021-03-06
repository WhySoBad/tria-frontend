import { Checkbox as MuiCheckbox, CheckboxProps, IconButton, InputAdornment, InputBase, InputBaseProps, MenuItem, Select as MuiSelect, SelectProps as MuiSelectProps } from "@material-ui/core";
import { Tune as TuneIcon } from "@material-ui/icons";
import React, { forwardRef, useEffect, useState } from "react";
import style from "../styles/modules/Input.module.scss";

export const Input = forwardRef<HTMLInputElement, InputBaseProps>(({ ...rest }, ref): JSX.Element => {
  return <InputBase spellCheck={false} ref={ref} classes={{ root: style["input"], error: style["error"], disabled: style["disabled"], focused: style["focus"] }} {...rest} />;
});

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(({ ...rest }, ref): JSX.Element => {
  return (
    <MuiCheckbox
      ref={ref}
      TouchRippleProps={{ color: "#fff" }}
      classes={{ root: style["checkbox"], disabled: style["disabled"], checked: style["active"], colorSecondary: style["secondary"] }}
      {...rest}
    />
  );
});

interface SearchbarProps extends InputBaseProps {
  onTuneOpen?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  withTune?: boolean;
  withMinWidth?: boolean;
}

export const Searchbar: React.FC<SearchbarProps> = ({ onTuneOpen, withTune = true, withMinWidth = true, ...props }): JSX.Element => {
  return (
    <div className={style["searchbar-container"]} data-minwidth={withMinWidth}>
      <InputBase
        className={style["searchbar"]}
        spellCheck={false}
        {...props}
        endAdornment={
          <>
            {withTune && (
              <InputAdornment position={"end"}>
                <IconButton disableRipple onClick={onTuneOpen} classes={{ root: style["iconbutton"] }}>
                  <TuneIcon className={style["icon"]} />
                </IconButton>
              </InputAdornment>
            )}
          </>
        }
      />
    </div>
  );
};

interface SelectProps extends MuiSelectProps {
  values: Array<{ value: string | number; label: string; disabled?: boolean }>;
}

export const Select: React.FC<SelectProps> = forwardRef(({ values, value, onChange, ...rest }, ref): JSX.Element => {
  const [selected, setSelected] = useState<string | number>(value as any);

  useEffect(() => {
    setSelected(value as any);
  }, [value]);

  return (
    <MuiSelect
      variant={"outlined"}
      classes={{ icon: style["select-icon"] }}
      MenuProps={{ classes: { paper: style["menu-container"], list: style["menu-list"] } }}
      ref={ref}
      value={selected}
      onChange={(event) => {
        setSelected(event.target.value as any);
        onChange && onChange(event, event);
      }}
      input={<Input />}
      {...rest}
    >
      {values.map(({ value, label, disabled = false }, index) => (
        <MenuItem
          disabled={disabled}
          className={style["menu-item"]}
          value={value}
          disableRipple
          children={label && label.length > 0 ? label[0] + label.substr(1).toLocaleLowerCase() : label}
          key={index}
        />
      ))}
    </MuiSelect>
  );
});

export default Input;
