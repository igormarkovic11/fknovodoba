import fkKoviljuse from "../assets/logos/fk-koviljuse.png";
import fkObilic2023 from "../assets/logos/fk-obilic-2023.png";
import fkPatkovaca from "../assets/logos/fk-patkovaca.png";
import fkPobjeda from "../assets/logos/fk-pobjeda.png";
import fkSloga from "../assets/logos/fk-sloga.png";
import fkTavna from "../assets/logos/fk-tavna.png";
import ofkCrnjelovo from "../assets/logos/ofk-crnjelovo.png";
import fkNovoDoba from "../assets/logos/fk-novo-doba.png";
import fkBalatun from "../assets/logos/fk-balatun.png";
import fkGlogovac from "../assets/logos/fk-glogovac.png";
import fkKoridor2011 from "../assets/logos/fk-koridor-2011.png";
import fkSindjelic from "../assets/logos/fk-sindjelic.png";

const teamLogos: Record<string, string> = {
  fknovodoba: fkNovoDoba,
  fkkoviljuše: fkKoviljuse,
  fkobilić2023: fkObilic2023,
  fkpatkovača: fkPatkovaca,
  fkpobjeda: fkPobjeda,
  fksinđelić: fkSindjelic,
  fksloga: fkSloga,
  fktavna: fkTavna,
  ofkcrnjelovo: ofkCrnjelovo,
  fkbalatun: fkBalatun,
  fkglogovac: fkGlogovac,
  fkkoridor2011: fkKoridor2011,
};

export const getTeamLogo = (teamName: string): string | undefined => {
  const key = teamName.toLowerCase().replace(/[\s-]/g, "");
  return teamLogos[key];
};

export default teamLogos;
