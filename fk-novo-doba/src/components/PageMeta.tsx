import { Helmet } from "react-helmet-async";

interface PageMetaProps {
  title?: string;
  description?: string;
  image?: string;
}

const BASE_URL = "https://fknovodoba.vercel.app";
const DEFAULT_IMAGE = `${BASE_URL}/icons/icon-512.png`;
//const SITE_NAME = 'FK Novo Doba Kojčinovac'

const PageMeta = ({ title, description, image }: PageMetaProps) => {
  const fullTitle = title
    ? `${title} | FK Novo Doba`
    : "FK Novo Doba Kojčinovac | Zvanična stranica kluba";
  const metaDesc =
    description ??
    "Zvanična web stranica FK Novo Doba Kojčinovac. Rezultati, raspored utakmica, tim, tabela i najnovije vijesti.";
  const metaImage = image ?? DEFAULT_IMAGE;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={metaDesc} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDesc} />
      <meta property="og:image" content={metaImage} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDesc} />
      <meta name="twitter:image" content={metaImage} />
    </Helmet>
  );
};

export default PageMeta;
