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
import fkDrina from "../assets/logos/fk-drina.png";
import fkGorica from "../assets/logos/fk-gorica.png";
import fkKolektiv from "../assets/logos/fk-kolektiv.png";
import fkObarska from "../assets/logos/fk-obarska.png";
import fkPanteri from "../assets/logos/fk-panteri.png";
import fkProleter from "../assets/logos/fk-proleter.png";
import fkSemberija from "../assets/logos/fk-semberija.png";
import fkSlogaDB from "../assets/logos/fk-sloga-DB.png";
import fkSlogaJunajted from "../assets/logos/fk-sloga-junajted.png";
import ofkBatkovic from "../assets/logos/ofk-batković.png";
import ofkJanja from "../assets/logos/ofk-janja-2009.png";

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
  fkdringa: fkDrina,
  fkgorica: fkGorica,
  fkkolektiv: fkKolektiv,
  fkobarska: fkObarska,
  fkpanteri: fkPanteri,
  fkproleter: fkProleter,
  fksemberija: fkSemberija,
  fkslogadb: fkSlogaDB,
  fkslogajunajted: fkSlogaJunajted,
  ofkbatkovic: ofkBatkovic,
  ofkjanja: ofkJanja,
};

export const getTeamLogo = (teamName: string): string | undefined => {
  const key = teamName.toLowerCase().replace(/[\s-]/g, "");
  return teamLogos[key];
};

export default teamLogos;
