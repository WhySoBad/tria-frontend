import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";

interface MetaProps {
  description?: string;
  title?: string;
  noindex?: boolean;
  image?: string;
}

const Meta: React.FC<MetaProps> = ({ description, title, noindex, image }) => {
  const router = useRouter();

  const hostname: string = typeof window !== "undefined" ? window.location.origin : router.asPath;

  return (
    <Head>
      {title && <title children={title} />}
      {title && <meta property="og:title" content={title} key="ogtitle" />}
      {description && <meta name="description" content={description} />}
      {description && <meta property="og:description" content={description} key="ogdesc" />}
      <meta property="og:image" content={`${hostname}/banner.png`} />
      <meta property="og:url" content={hostname} key="ogurl" />
      <meta name="robots" content={noindex ? "noindex" : "index"} />
    </Head>
  );
};

export default Meta;
