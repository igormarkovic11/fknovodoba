import logo from "../assets/logos/fk-novo-doba.webp";

const AppLoader = () => {
  return (
    <div className="fixed inset-0 bg-[#0a0c10] flex flex-col items-center justify-center z-50">
      <img
        src={logo}
        alt="FK Novo Doba"
        className="w-24 h-24 object-contain mb-6"
        style={{ mixBlendMode: "lighten" }}
      />
      <div className="flex gap-1.5">
        <div
          className="w-1.5 h-1.5 rounded-full bg-[#c49b32] animate-bounce"
          style={{ animationDelay: "0ms" }}
        />
        <div
          className="w-1.5 h-1.5 rounded-full bg-[#c49b32] animate-bounce"
          style={{ animationDelay: "150ms" }}
        />
        <div
          className="w-1.5 h-1.5 rounded-full bg-[#c49b32] animate-bounce"
          style={{ animationDelay: "300ms" }}
        />
      </div>
    </div>
  );
};

export default AppLoader;
