const League = () => {
  return (
    <div className="min-h-screen bg-[#0a0c10] text-[#e8e4d9]">
      {/* Header */}
      <div className="bg-[#0d1017] border-b border-white/05 px-5 pt-8 pb-6">
        <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-[#c49b32] mb-1">
          2025/26
        </p>
        <h1 className="text-[36px] font-black text-[#f5f0e8] tracking-wide leading-none">
          LEAGUE TABLE
        </h1>
      </div>

      {/* SofaScore standings embed */}
      <div className="px-5 py-6">
        <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-[#c49b32] mb-4">
          Prva opstinska liga Bijeljine - istok
        </p>
        <div className="rounded-xl overflow-hidden border border-white/07">
          <iframe
            src="https://widgets.sofascore.com/embed/tournament/29543/season/82974/standings/1?widgetTheme=dark&backgroundColor=%230d1017"
            style={{ width: "100%", height: "600px", border: "none" }}
            title="Prva Opštinska Liga Bijeljina Istok Standings"
          />
        </div>
      </div>

      {/* SofaScore recent matches embed */}
      <div className="px-5 pb-10">
        <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-[#c49b32] mb-4">
          Recent Matches
        </p>
        <div className="rounded-xl overflow-hidden border border-white/07">
          <iframe
            src="https://widgets.sofascore.com/embed/tournament/29543/matches?widgetTheme=dark"
            style={{ width: "100%", height: "500px", border: "none" }}
            title="Prva Opštinska Liga Bijeljina Istok Matches"
          />
        </div>
      </div>
    </div>
  );
};

export default League;
