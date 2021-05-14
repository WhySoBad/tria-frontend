import React, { FC, useEffect, useRef, useState } from 'react';
import style from '../../styles/modules/Fade.module.scss';

const Fade: FC = ({ children }): JSX.Element => {
  const ref = useRef<HTMLInputElement>(null);
  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        if (entries[0].isIntersecting) {
          setVisible(true);
          observer.unobserve(ref.current);
        }
      },
    );

    observer.observe(ref.current);
  }, []);

  return (
    <div
      className={style['fade']}
      data-visible={visible}
      ref={ref}
      children={children}
    />
  );
};

export default Fade;
