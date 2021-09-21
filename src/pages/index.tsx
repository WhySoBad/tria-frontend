import { NextPage } from "next";
import Landing from "../components/Landing";
import Meta from "../components/Meta";
import { useLang } from "../hooks";

const HomePage: NextPage = (): JSX.Element => {
  const { translation } = useLang();
  return (
    <>
      <Meta description="Tria is a messenger service allowing you to chat with other people over the internet" title={translation.sites.home} />
      <Landing />
    </>
  );
};

export default HomePage;
