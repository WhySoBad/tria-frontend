import { Avatar as MuiAvatar, AvatarProps as MuiAvatarProps } from "@material-ui/core";
import React from "react";
import { hexToHsl } from "../../util";

interface AvatarProps extends MuiAvatarProps {
  color?: string;
}

const Avatar: React.FC<AvatarProps> = ({ color, alt, src, style, ...rest }): JSX.Element => {
  if (!color) color = "#333333";
  const hsl: { h: number; s: number; l: number } = hexToHsl(color);
  return (
    <MuiAvatar
      alt={alt || ""}
      src={src}
      {...rest}
      style={{ background: !src && `linear-gradient(204deg, hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%) 22%,  hsl(${hsl.h}, ${hsl.s}%, ${hsl.l - 20}%) 85%)`, ...style }}
    >
      <svg style={{ height: "35%" }} data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96.99 84">
        <polygon style={{ fill: "none", stroke: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l - 30}%)`, strokeMiterlimit: 10, strokeWidth: "6px", zIndex: 1000 }} points="48.5 6 5.2 81 91.8 81 48.5 6" />
      </svg>
    </MuiAvatar>
  );
};

export default Avatar;
