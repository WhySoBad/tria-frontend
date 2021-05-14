import React, { useEffect } from 'react';
import Fade from '../Fade/Fade';
import Footer from './Footer';
import Header from './Header';
import style from '../../styles/modules/Landing.module.scss';
import Authentication from './sections/Authentication';
import Title from './sections/Title';

const Landing = (): JSX.Element => {
  useEffect(() => {}, []);

  return (
    <main className={style['container']}>
      <Header />
      <Fade children={<Title />} />
      <Fade children={<Authentication />} />
      <Footer />
    </main>
  );
};

export default Landing;
