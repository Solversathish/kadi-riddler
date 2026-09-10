"use client";

import Link from "next/link";
import SearchBar from "./components/SearchBar";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === "/";
    }

    return pathname.startsWith(path);
  };

  const desktopLinkClass = (path: string) =>
    `rounded-xl px-3 py-2 font-bold transition ${
      isActive(path)
        ? "bg-white/10 text-yellow-300"
        : "text-white/80 hover:text-yellow-300"
    }`;

  const mobileLinkClass = (path: string) =>
    `rounded-2xl px-5 py-4 font-bold transition ${
      isActive(path)
        ? "bg-white/10 text-yellow-300"
        : "text-white hover:bg-white/10"
    }`;

  return (
    <header className="relative z-50 border-b border-white/10 bg-[#070b25]">
      
      {/* MAIN HEADER */}
      <div className="mx-auto max-w-7xl px-5 lg:px-8">

        {/* TOP ROW */}
        <div className="flex items-center justify-between py-4">

          {/* LOGO */}
          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            className="flex min-w-0 items-center gap-3"
          >
            {/* Brain Icon */}
            <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-pink-400 text-2xl shadow-lg shadow-pink-500/20 sm:size-12 sm:text-3xl">
              🧠
            </div>

            {/* Logo Text */}
            <div className="min-w-0 leading-none">
              <div className="text-xl font-black tracking-tight sm:text-2xl">
                <span className="text-white">KADI</span>{" "}
                <span className="text-yellow-300">RIDDLER</span>
              </div>

              <div className="mt-1 hidden text-[10px] font-bold uppercase tracking-[0.22em] text-white/60 sm:block">
                Think. Laugh. Get Tricked.
              </div>
            </div>
          </Link>

          {/* DESKTOP NAVIGATION */}
          <nav className="hidden items-center gap-5 md:flex">

            <Link
              href="/"
              className={desktopLinkClass("/")}
            >
              Home
            </Link>

            <Link
              href="/riddles"
              className={desktopLinkClass("/riddles")}
            >
              Riddles
            </Link>

            <Link
              href="/kadi-jokes"
              className={desktopLinkClass("/kadi-jokes")}
            >
              Kadi Jokes
            </Link>

            <Link
              href="/questions"
              className={desktopLinkClass("/questions")}
            >
              Questions
            </Link>

            <Link
              href="/facts"
              className={desktopLinkClass("/facts")}
            >
              Amazing Facts
            </Link>

          </nav>

          {/* DESKTOP SEARCH */}
          <div className="hidden md:block">
            <SearchBar />
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="grid size-11 shrink-0 place-items-center rounded-full bg-white/10 text-xl transition hover:bg-white/15 active:scale-95 md:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? "✕" : "☰"}
          </button>

        </div>

        {/* MOBILE SEARCH */}
        <div className="pb-4 md:hidden">
          <SearchBar />
        </div>

      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="border-t border-white/10 bg-[#070b25] px-5 py-5 md:hidden">

          <nav className="flex flex-col gap-2">

            <Link
              href="/"
              onClick={() => setMenuOpen(false)}
              className={mobileLinkClass("/")}
            >
              🏠 Home
            </Link>

            <Link
              href="/riddles"
              onClick={() => setMenuOpen(false)}
              className={mobileLinkClass("/riddles")}
            >
              🧩 Riddles
            </Link>

            <Link
              href="/kadi-jokes"
              onClick={() => setMenuOpen(false)}
              className={mobileLinkClass("/kadi-jokes")}
            >
              😂 Kadi Jokes
            </Link>

            <Link
              href="/questions"
              onClick={() => setMenuOpen(false)}
              className={mobileLinkClass("/questions")}
            >
              ❓ Questions
            </Link>

            <Link
              href="/facts"
              onClick={() => setMenuOpen(false)}
              className={mobileLinkClass("/facts")}
            >
              🤯 Amazing Facts
            </Link>

          </nav>

        </div>
      )}

    </header>
  );
}