import { NextPage } from 'next';
import Landing from '../components/Landing/Landing';

const HomePage: NextPage = (): JSX.Element => {
  return (
    <>
      <title children={'Landing'} />
      <Landing />
    </>
  );
};

export default HomePage;
