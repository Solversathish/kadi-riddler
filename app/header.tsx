"use client";

import Link from "next/link";
import SearchBar from "./components/SearchBar";
import { useState } from "react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="relative z-50 border-b border-white/10 bg-[#070b25]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">

        {/* LOGO */}
        <Link
          href="/"
          onClick={() => setMenuOpen(false)}
          className="flex items-center gap-3"
        >
          <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-pink-400 text-3xl shadow-lg shadow-pink-500/20">
            🧠
          </div>

          <div className="leading-none">
            <div className="text-2xl font-black tracking-tight">
              <span className="text-white">KADI</span>{" "}
              <span className="text-yellow-300">RIDDLER</span>
            </div>

            <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.22em] text-white/60">
              Think. Laugh. Get Tricked.
            </div>
          </div>
        </Link>

        {/* DESKTOP NAVIGATION */}
        <nav className="hidden items-center gap-8 md:flex">

          <Link
            href="/"
            className="font-bold text-white/80 transition hover:text-yellow-300"
          >
            Home
          </Link>

          <Link
            href="/riddles"
            className="font-bold text-white/80 transition hover:text-yellow-300"
          >
            Riddles
          </Link>

          <Link
            href="/kadi-jokes"
            className="font-bold text-white/80 transition hover:text-yellow-300"
          >
            Kadi Jokes
          </Link>

          <Link
            href="/facts"
            className="font-bold text-white/80 transition hover:text-yellow-300"
          >
            Amazing Facts
          </Link>

        </nav>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-3">

          {/* SEARCH - DESKTOP */}
          <div className="hidden md:block">
            <SearchBar />
          </div>

          {/* SEARCH - MOBILE */}
          <div className="block md:hidden">
            <SearchBar />
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="grid size-12 place-items-center rounded-full bg-white/10 text-xl transition hover:bg-white/15 active:scale-95 md:hidden"
            aria-label="Open menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? "✕" : "☰"}
          </button>

        </div>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="border-t border-white/10 bg-[#070b25] px-5 py-5 md:hidden">
          <nav className="flex flex-col gap-2">

            <Link
              href="/"
              onClick={() => setMenuOpen(false)}
              className="rounded-2xl px-5 py-4 font-bold text-white hover:bg-white/10"
            >
              🏠 Home
            </Link>

            <Link
              href="/riddles"
              onClick={() => setMenuOpen(false)}
              className="rounded-2xl px-5 py-4 font-bold text-white hover:bg-white/10"
            >
              🧩 Riddles
            </Link>

            <Link
              href="/kadi-jokes"
              onClick={() => setMenuOpen(false)}
              className="rounded-2xl px-5 py-4 font-bold text-white hover:bg-white/10"
            >
              😂 Kadi Jokes
            </Link>

            <Link
              href="/facts"
              onClick={() => setMenuOpen(false)}
              className="rounded-2xl px-5 py-4 font-bold text-white hover:bg-white/10"
            >
              🤯 Amazing Facts
            </Link>

          </nav>
        </div>
      )}

    </header>
  );
}