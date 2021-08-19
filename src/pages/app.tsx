import { NextPage } from "next";
import Layout from "../components/Layout/Layout";
import Meta from "../components/Meta/Meta";
import { useLang } from "../hooks/LanguageContext";

const AppPage: NextPage = (): JSX.Element => {
  const { translation } = useLang();
  return (
    <Layout>
      <Meta noindex description="Select a chat to start chatting" title={translation.sites.app} />
    </Layout>
  );
};

export default AppPage;
