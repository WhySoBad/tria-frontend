import { NextPage } from "next";
import Layout from "../components/Layout";
import Meta from "../components/Meta";
import { useLang } from "../hooks";

const AppPage: NextPage = (): JSX.Element => {
  const { translation } = useLang();
  return (
    <Layout>
      <Meta noindex description="Select a chat to start chatting" title={translation.sites.app} />
    </Layout>
  );
};

export default AppPage;
