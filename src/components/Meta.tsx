import Head from "next/head";
import React from "react";

interface MetaProps {
  description?: string;
  title?: string;
  noindex?: boolean;
  image?: string;
  keywords?: Array<string> | string;
}

const Meta: React.FC<MetaProps> = ({ description, title, noindex, keywords }) => {
  const hostname: string = "https://tria.chat";
  const allKeywords: Array<string> = ["messenger", "chat", "tria"]; //default keywords
  if (typeof keywords === "string") allKeywords.push(keywords);
  else if (Array.isArray(keywords)) allKeywords.push(...keywords);

  return (
    <Head>
      {title && <title children={title} />}
      {title && <meta property="og:title" content={title} key="ogtitle" />}
      {title && <meta name="twitter:title" content={title} />}
      {description && <meta name="description" content={description} />}
      {description && <meta property="og:description" content={description} key="ogdesc" />}
      {description && <meta name="twitter:description" content={description} />}
      {keywords && <meta name="keywords" content={Array.isArray(keywords) ? keywords.join(", ") : keywords} />}
      <meta property="og:image" content={`${hostname}/banner.png`} />
      <meta property="og:image:secure_url" content={`${hostname}/banner.png`} />
      <meta name="keywords" content={allKeywords.join(", ")} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="627" />
      <meta property="og:url" content={hostname} key="ogurl" />
      <meta name="robots" content={noindex ? "noindex" : "index"} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:image:src" content={hostname} />
    </Head>
  );
};

export default Meta;
