import React, { FC, useEffect, useRef, useState } from 'react';
import style from '../../styles/modules/Button.module.scss';
import Link from 'next/link';
import cn from 'classnames';

interface Props
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  to?: string;
  href?: string;
  text: string;
  loading?: boolean;
}

interface LoaderProps {
  dimensions: { width: number; height: number };
}

const Loader: FC<LoaderProps> = ({
  dimensions: { height, width },
}): JSX.Element => {
  return (
    <div
      className={cn(style['btn'], style['loading'])}
      style={height && width && { height: height, width: width }}
      children={'. . .'}
    />
  );
};

const Button = ({
  to,
  href,
  text,
  className,
  loading,
  disabled,
  ...rest
}: Props): JSX.Element => {
  const ref = useRef<HTMLInputElement>(null);
  const [dimensions, setDimensions] = useState<{
    height: number;
    width: number;
  }>(null);

  useEffect(() => {
    if (ref.current && !dimensions && !loading) {
      setDimensions({
        height: ref.current.offsetHeight,
        width: ref.current.offsetWidth,
      });
    }
  }, [ref.current]);

  if (loading) {
    return (
      <span
        className={className}
        children={<Loader dimensions={dimensions} />}
      />
    );
  }

  const Button: JSX.Element = (
    <button
      ref={ref}
      className={style['btn']}
      disabled={loading || disabled}
      {...rest}
      children={text}
    />
  );

  if (href || to) {
    return <span children={<Link href={to || href} children={Button} />} />;
  } else return <span className={className} children={Button} />;
};

export default Button;
