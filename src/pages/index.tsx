import { NextPage } from "next";
import Landing from "../components/Landing/Landing";
import Meta from "../components/Meta/Meta";
import { useLang } from "../hooks/LanguageContext";

const HomePage: NextPage = (): JSX.Element => {
  const { translation } = useLang();
  return (
    <>
      <Meta description="NAME is a messenger service to chat allowing you to chat with other people over the internet. NAME provides group and private chats." title={translation.sites.home} />
      <Landing />
    </>
  );
};

export default HomePage;
