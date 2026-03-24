import novaVet from "../assets/sponsors/novaVet.png";
import lyleAndScott from "../assets/sponsors/lyleAndScott.png";
import stecoCentar from "../assets/sponsors/stecoCentar.png";

const sponsors = [
  {
    image: stecoCentar,
    url: "https://www.stecocentar.com/",
    name: "Steco Centar",
  },
  {
    image: lyleAndScott,
    url: "https://www.lyleandscott.com/",
    name: "Lyle & Scott",
  },
  {
    image: novaVet,
    url: "https://www.akta.ba/registar/158680/nova-vet-radenko-mitrovic-sp-kojcinovac",
    name: "Nova Vet",
  },
];

const Footer = () => {
  return (
    <footer className="bg-[#0d1017] border-t border-white/05 pt-8 pb-6">
      {/* Social icons */}
      <div className="flex justify-center items-center gap-6 mb-10">
        <a
          href="https://www.instagram.com/fk_novo_doba/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#56544e] hover:text-[#c49b32] transition-colors duration-200"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M3 8a5 5 0 0 1 5-5h8a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8Zm5-3a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H8Zm7.597 2.214a1 1 0 0 1 1-1h.01a1 1 0 1 1 0 2h-.01a1 1 0 0 1-1-1ZM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm-5 3a5 5 0 1 1 10 0 5 5 0 0 1-10 0Z"
              clipRule="evenodd"
            />
          </svg>
        </a>
        <a
          href="https://www.facebook.com/fknovodoba"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#56544e] hover:text-[#c49b32] transition-colors duration-200"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M13.135 6H15V3h-1.865a4.147 4.147 0 0 0-4.142 4.142V9H7v3h2v9.938h3V12h2.021l.592-3H12V6.591A.6.6 0 0 1 12.592 6h.543Z"
              clipRule="evenodd"
            />
          </svg>
        </a>
        <a
          href="mailto:fknovodoba@gmail.com"
          className="text-[#56544e] hover:text-[#c49b32] transition-colors duration-200"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="m3.5 5.5 7.893 6.036a1 1 0 0 0 1.214 0L20.5 5.5M4 19h16a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Z" />
          </svg>
        </a>
      </div>

      {/* Sponsors section */}
      <div className="px-5 mb-8">
        <p className="text-center text-[11px] font-bold tracking-[0.2em] uppercase text-[#3a3830] mb-6">
          Oficijalni sponzori
        </p>
        <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
          {sponsors.map((sponsor, i) => (
            <a
              key={i}
              href={sponsor.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-xl p-4 flex items-center justify-center aspect-square hover:scale-105 transition-transform duration-200 opacity-80 hover:opacity-100"
            >
              <img
                src={sponsor.image}
                alt={sponsor.name}
                className="w-full h-full object-contain"
              />
            </a>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="px-5 flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-white/05 pt-5">
        <span className="text-[11px] text-[#3a3830]">
          © 2026{" "}
          <strong className="text-[#56544e]">FK Novo Doba Kojčinovac</strong>
        </span>
        <span className="text-[10px] text-[#c49b32]/50 tracking-widest uppercase">
          Est. 1947
        </span>
      </div>
    </footer>
  );
};

export default Footer;
