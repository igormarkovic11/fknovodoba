import { Component, type ReactNode } from "react";
import logo from "../assets/logos/fk-novo-doba.webp";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    console.error("Error boundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0a0c10] flex flex-col items-center justify-center px-5 text-center">
          <img
            src={logo}
            alt="FK Novo Doba"
            className="w-16 h-16 object-contain mb-6 opacity-30"
            style={{ mixBlendMode: "lighten" }}
          />
          <h1 className="text-[24px] font-black text-[#f0ead8] mb-2">
            Nešto je pošlo po krivu
          </h1>
          <p className="text-[14px] text-[#56544e] mb-8 max-w-sm">
            Došlo je do neočekivane greške. Pokušajte ponovo.
          </p>
          <button
            onClick={() => (window.location.href = "/")}
            className="px-6 py-3 rounded-xl bg-[#c49b32] text-[#0a0c10] text-[13px] font-black tracking-widests uppercase hover:bg-[#d4aa3f] transition-colors cursor-pointer border-none"
          >
            Idi na početnu
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
