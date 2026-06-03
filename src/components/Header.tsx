"use client";

import { useState, useEffect } from "react";
import Logo from "./Logo";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToForm = () => {
    document.getElementById("formulario")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-sm border-b border-border shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-5 md:px-8 h-16 md:h-20 flex items-center justify-between">
        <a href="#" aria-label="M&H Início">
          <Logo
            inverted={!scrolled}
            className="h-10 md:h-12 w-auto"
          />
        </a>

        <div className="flex items-center gap-4 md:gap-6">
          <span
            className={`hidden md:block text-xs font-medium tracking-widest uppercase transition-colors duration-300 ${
              scrolled ? "text-muted" : "text-white/70"
            }`}
          >
            Assistência técnica para importados
          </span>
          <button
            onClick={scrollToForm}
            className={`text-xs font-semibold tracking-widest uppercase px-5 py-2.5 transition-all duration-200 active:scale-95 ${
              scrolled
                ? "bg-ink text-white hover:bg-gold"
                : "bg-white text-ink hover:bg-gold hover:text-white"
            }`}
          >
            Solicitar atendimento
          </button>
        </div>
      </div>
    </header>
  );
}
