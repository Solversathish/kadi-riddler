"use client";

import Link from "next/link";
import { useState } from "react";

const categories = [
  {
    icon: "🧩",
    title: "Riddles",
    text: "Tricky, funny, logical and mind-bending riddles.",
    href: "/riddles",
    tone: "from-violet-600 to-purple-700",
  },
  {
    icon: "😂",
    title: "Kadi Jokes",
    text: "Tamil kadi jokes, English jokes and terrible one-liners.",
    href: "/kadi-jokes",
    tone: "from-orange-400 to-orange-600",
  },
  {
    icon: "🤯",
    title: "Amazing Facts",
    text: "Interesting, strange, shocking and surprising facts.",
    href: "/facts",
    tone: "from-lime-500 to-green-700",
  },
];

const randomChallenges = [
  {
    type: "Riddle",
    icon: "🧩",
    color: "violet",
    question: "I have hands but cannot clap. What am I?",
    answer: "A clock! ⏰",
  },
  {
    type: "Kadi Joke",
    icon: "😂",
    color: "orange",
    question: "Why did the computer go to the doctor?",
    answer: "Because it had a virus! 💻😂",
  },
  {
    type: "Amazing Fact",
    icon: "🤯",
    color: "green",
    question: "Which sea creature has three hearts?",
    answer: "An octopus! 🐙",
  },
  {
    type: "Riddle",
    icon: "🧠",
    color: "violet",
    question: "What has a face and two hands but no arms or legs?",
    answer: "A clock! ⏰",
  },
  {
    type: "Kadi Joke",
    icon: "🤣",
    color: "orange",
    question: "What do you call cheese that isn't yours?",
    answer: "Nacho cheese! 🧀😂",
  },
];

function RevealCard({
  type,
  question,
  answer,
  icon,
}: {
  type: string;
  question: string;
  answer: string;
  icon: string;
}) {
  const [revealed, setRevealed] = useState(false);

  return (
    <article className="group relative overflow-hidden rounded-[30px] border border-white/10 bg-white/[.96] p-6 text-slate-950 shadow-2xl transition duration-300 hover:-translate-y-2 hover:shadow-violet-950/30">
      {/* Decorative element - cannot block taps */}
      <div
        className="pointer-events-none absolute right-0 top-0 h-32 w-32 rounded-full bg-violet-200/40 blur-3xl transition group-hover:bg-violet-300/60"
        aria-hidden="true"
      />

      <div className="relative z-10">
        <div className="mb-6 flex items-center justify-between gap-3">
          <span className="rounded-full bg-violet-100 px-4 py-2 text-xs font-black uppercase tracking-wider text-violet-700">
            {icon} {type}
          </span>

          <span className="text-2xl transition group-hover:rotate-12">
            {revealed ? "✨" : "❓"}
          </span>
        </div>

        <p className="mb-3 text-xs font-black uppercase tracking-[.2em] text-slate-400">
          Can you solve it?
        </p>

        <h3 className="min-h-24 text-xl font-black leading-snug">
          {question}
        </h3>

        {revealed && (
          <div className="reveal-answer mt-5 rounded-2xl bg-violet-50 p-5 text-violet-800">
            <p className="mb-1 text-xs font-black uppercase tracking-widest text-violet-500">
              Answer
            </p>

            <p className="font-black">{answer}</p>
          </div>
        )}

        <button
          type="button"
          onClick={() => setRevealed((v) => !v)}
          className="mt-6 touch-manipulation rounded-full bg-violet-600 px-6 py-3 text-sm font-black text-white transition hover:scale-105 hover:bg-violet-700 active:scale-95"
        >
          {revealed ? "🙈 Hide Answer" : "💡 Reveal Answer"} →
        </button>
      </div>
    </article>
  );
}

export default function Home() {
  const [randomIndex, setRandomIndex] = useState(0);
  const [randomRevealed, setRandomRevealed] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  const randomChallenge = randomChallenges[randomIndex];

  const getRandomChallenge = () => {
    let nextIndex = Math.floor(Math.random() * randomChallenges.length);

    if (
      randomChallenges.length > 1 &&
      nextIndex === randomIndex
    ) {
      nextIndex = (nextIndex + 1) % randomChallenges.length;
    }

    setRandomIndex(nextIndex);
    setRandomRevealed(false);
  };

  const closeMobileMenu = () => {
    setMobileMenu(false);
  };

  return (
    <main className="site-bg min-h-screen overflow-hidden text-white">
      

      {/* ========================================================= */}
      {/* HEADER */}
      {/* ========================================================= */}

      <header className="relative z-50 border-b border-white/10 bg-[#070b25]/95">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">

          {/* Logo */}
          <Link
            href="/"
            onClick={closeMobileMenu}
            className="touch-manipulation flex items-center gap-3"
          >
            <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-pink-400 text-3xl shadow-lg shadow-pink-500/20">
              🧠
            </div>

            <div className="leading-none">
              <div className="text-2xl font-black tracking-tight">
                <span className="text-white">KADI</span>{" "}
                <span className="text-yellow-300">RIDDLER</span>
              </div>

              <div className="mt-1 text-[10px] font-bold uppercase tracking-[.22em] text-white/60">
                Think. Laugh. Get Tricked.
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-8 md:flex">
            <Link
              href="/"
              className="font-bold text-yellow-300 transition hover:text-yellow-200"
            >
              Home
            </Link>

            <Link
              href="/riddles"
              className="font-bold text-white/80 transition hover:text-white"
            >
              Riddles
            </Link>

            <Link
              href="/kadi-jokes"
              className="font-bold text-white/80 transition hover:text-white"
            >
              Kadi Jokes
            </Link>

            <Link
              href="/facts"
              className="font-bold text-white/80 transition hover:text-white"
            >
              Amazing Facts
            </Link>
          </nav>

          {/* Right Side - Search + Mobile Menu */}
          <div className="flex items-center gap-3">

            {/* Search - visible on desktop AND mobile */}
            <a
  href="/search"
  aria-label="Search"
  className="grid size-12 touch-manipulation place-items-center rounded-full bg-white/10 text-xl transition hover:bg-white/15 active:scale-95"
>
  🔍
</a>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setMobileMenu((v) => !v)}
              aria-label={mobileMenu ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenu}
              className="grid size-12 touch-manipulation place-items-center rounded-full bg-white/10 text-xl transition hover:bg-white/15 active:scale-95 md:hidden"
            >
              {mobileMenu ? "✕" : "☰"}
            </button>

          </div>
        </div>

        {/* ===================================================== */}
        {/* MOBILE NAVIGATION */}
        {/* ===================================================== */}

        {mobileMenu && (
          <div className="border-t border-white/10 bg-[#070b25] px-5 py-5 md:hidden">
            <nav className="flex flex-col gap-2">

              <Link
                href="/"
                onClick={closeMobileMenu}
                className="touch-manipulation rounded-2xl bg-white/10 px-5 py-4 font-bold text-yellow-300 active:bg-white/15"
              >
                🏠 Home
              </Link>

              <Link
                href="/riddles"
                onClick={closeMobileMenu}
                className="touch-manipulation rounded-2xl px-5 py-4 font-bold text-white/80 hover:bg-white/10 active:bg-white/15"
              >
                🧩 Riddles
              </Link>

              <Link
                href="/kadi-jokes"
                onClick={closeMobileMenu}
                className="touch-manipulation rounded-2xl px-5 py-4 font-bold text-white/80 hover:bg-white/10 active:bg-white/15"
              >
                😂 Kadi Jokes
              </Link>

              <Link
                href="/facts"
                onClick={closeMobileMenu}
                className="touch-manipulation rounded-2xl px-5 py-4 font-bold text-white/80 hover:bg-white/10 active:bg-white/15"
              >
                🤯 Amazing Facts
              </Link>

            </nav>
          </div>
        )}
      </header>

      {/* ========================================================= */}
      {/* HERO */}
      {/* ========================================================= */}

      <section className="doodle-bg hero-glow relative border-b border-white/5">
        {/* Decorative overlay - MUST NOT BLOCK BUTTONS */}

        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_75%_30%,rgba(139,92,246,.25),transparent_35%)]"
          aria-hidden="true"
        />

        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 lg:grid-cols-2 lg:px-8 lg:py-24">
          {/* Hero Text */}

          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-yellow-300/30 bg-yellow-300/10 px-4 py-2 text-sm font-black text-yellow-200">
              ✨ YOUR DAILY DOSE OF FUN
            </div>

            <h1 className="max-w-3xl text-6xl font-black leading-[.9] tracking-tight sm:text-7xl lg:text-8xl">
              <span className="block text-white">THINK.</span>
              <span className="block text-yellow-300">LAUGH.</span>
              <span className="block text-white">GET TRICKED.</span>
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-8 text-white/70">
              Welcome to{" "}
              <b className="text-white">Kadi Riddler</b> — your home for
              clever riddles, terrible kadi jokes and amazing facts that make
              you say...
            </p>

            <div className="mt-4 text-xl font-black text-yellow-300">
              “Wait... WHAT?!” 🤯
            </div>

            {/* Hero Buttons */}

            <div className="relative z-20 mt-9 flex flex-wrap gap-3">
              <Link
                href="/riddles"
                className="touch-manipulation rounded-full bg-violet-600 px-6 py-4 font-black text-white shadow-lg shadow-violet-900/30 transition hover:-translate-y-1 hover:bg-violet-500 active:translate-y-0 active:scale-95"
              >
                🧩 Explore Riddles
              </Link>

              <Link
                href="/kadi-jokes"
                className="touch-manipulation rounded-full bg-orange-500 px-6 py-4 font-black text-white shadow-lg shadow-orange-900/20 transition hover:-translate-y-1 hover:bg-orange-400 active:translate-y-0 active:scale-95"
              >
                😂 Kadi Corner
              </Link>
            </div>

            <div className="mt-7 flex flex-wrap gap-5 text-sm font-bold text-white/50">
              <span>✓ No account needed</span>
              <span>✓ Free to explore</span>
              <span>✓ New content coming</span>
            </div>
          </div>

          {/* Hero Brain */}

          <div className="relative mx-auto grid max-w-lg place-items-center">
            {/* Decorative glow */}

            <div
              className="pointer-events-none absolute inset-8 rounded-full bg-violet-500/20 blur-3xl"
              aria-hidden="true"
            />

            {/* Decorative cards */}

            <div
              className="pointer-events-none absolute -left-2 top-14 rotate-[-8deg] rounded-3xl border border-white/10 bg-white/10 px-5 py-4 text-3xl shadow-xl backdrop-blur"
              aria-hidden="true"
            >
              🧩
            </div>

            <div
              className="pointer-events-none absolute -right-2 top-8 rotate-[8deg] rounded-3xl border border-white/10 bg-white/10 px-5 py-4 text-3xl shadow-xl backdrop-blur"
              aria-hidden="true"
            >
              💡
            </div>

            <div
              className="pointer-events-none relative text-[12rem] drop-shadow-[0_25px_30px_rgba(0,0,0,.35)] sm:text-[15rem]"
              aria-hidden="true"
            >
              🧠
            </div>

            <div
              className="pointer-events-none absolute bottom-8 left-2 rotate-[-6deg] rounded-3xl border border-white/10 bg-white/10 px-5 py-4 text-3xl shadow-xl backdrop-blur"
              aria-hidden="true"
            >
              ❓
            </div>

            <div
              className="pointer-events-none absolute bottom-2 right-3 rotate-[7deg] rounded-3xl border border-white/10 bg-white/10 px-5 py-4 text-3xl shadow-xl backdrop-blur"
              aria-hidden="true"
            >
              😂
            </div>

            <div className="pointer-events-none absolute bottom-20 right-0 rounded-full bg-yellow-300 px-5 py-3 text-sm font-black text-slate-950 shadow-xl">
              THINK SMART! ⚡
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* CATEGORY CARDS */}
      {/* ========================================================= */}

      <section className="relative z-10 mx-auto grid max-w-7xl gap-5 px-5 py-12 md:grid-cols-3 lg:px-8">
        {categories.map((category) => (
          <Link
            key={category.title}
            href={category.href}
            className={`group relative overflow-hidden rounded-[30px] bg-gradient-to-br ${category.tone} p-7 shadow-xl transition duration-300 hover:-translate-y-2 hover:shadow-2xl active:scale-[.98]`}
          >
            <div
              className="pointer-events-none absolute -right-10 -top-10 size-36 rounded-full bg-white/10 blur-2xl transition group-hover:scale-150"
              aria-hidden="true"
            />

            <div className="relative z-10">
              <div className="flex items-center gap-5">
                <div className="grid size-16 shrink-0 place-items-center rounded-2xl bg-white/20 text-4xl backdrop-blur">
                  {category.icon}
                </div>

                <div>
                  <p className="text-xs font-black uppercase tracking-wider text-white/70">
                    Explore
                  </p>

                  <h2 className="text-2xl font-black text-white">
                    {category.title}
                  </h2>
                </div>
              </div>

              <p className="mt-5 max-w-sm font-semibold leading-6 text-white/85">
                {category.text}
              </p>

              <div className="mt-6 font-black text-white transition group-hover:translate-x-2">
                Explore Now →
              </div>
            </div>
          </Link>
        ))}
      </section>

      {/* ========================================================= */}
      {/* RANDOM CHALLENGE */}
      {/* ========================================================= */}

      <section className="relative z-10 mx-auto max-w-7xl px-5 py-10 lg:px-8">
        <div className="relative overflow-hidden rounded-[36px] border border-white/10 bg-gradient-to-br from-white/[.09] to-white/[.03] p-6 shadow-2xl sm:p-10">
          {/* Decorative glow */}

          <div
            className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-violet-600/20 blur-3xl"
            aria-hidden="true"
          />

          <div className="relative z-10 grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-center">
            <div>
              <p className="text-sm font-black uppercase tracking-[.25em] text-yellow-300">
                🎲 Can't decide?
              </p>

              <h2 className="mt-3 text-4xl font-black sm:text-5xl">
                GIVE ME
                <br />
                SOMETHING RANDOM!
              </h2>

              <p className="mt-5 max-w-md leading-7 text-white/60">
                Let Kadi Riddler choose something for you. It could be a
                riddle, a kadi joke or a crazy fact.
              </p>

              <button
                type="button"
                onClick={getRandomChallenge}
                className="mt-7 touch-manipulation rounded-full bg-yellow-300 px-7 py-4 font-black text-slate-950 shadow-xl transition hover:-translate-y-1 hover:bg-yellow-200 active:translate-y-0 active:scale-95"
              >
                🎲 Surprise Me!
              </button>
            </div>

            {/* Random challenge card */}

            <div className="relative z-10 rounded-[30px] border border-white/10 bg-black/20 p-6 sm:p-8">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-widest text-white/70">
                  {randomChallenge.icon} {randomChallenge.type}
                </span>

                <span className="text-3xl">✨</span>
              </div>

              <div className="mt-7">
                <p className="text-xs font-black uppercase tracking-widest text-white/40">
                  Your challenge
                </p>

                <h3 className="mt-3 text-2xl font-black leading-relaxed sm:text-3xl">
                  {randomChallenge.question}
                </h3>
              </div>

              {randomRevealed && (
                <div className="mt-6 rounded-2xl bg-white/10 p-5">
                  <p className="text-xs font-black uppercase tracking-widest text-yellow-300">
                    💡 Answer
                  </p>

                  <p className="mt-2 text-xl font-black">
                    {randomChallenge.answer}
                  </p>
                </div>
              )}

              <button
                type="button"
                onClick={() => setRandomRevealed((v) => !v)}
                className="mt-6 touch-manipulation rounded-full bg-violet-600 px-6 py-3 font-black transition hover:bg-violet-500 active:scale-95"
              >
                {randomRevealed ? "🙈 Hide" : "💡 Reveal"} Answer
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* DAILY CONTENT */}
      {/* ========================================================= */}

      <section className="relative z-10 mx-auto max-w-7xl px-5 py-12 lg:px-8">
        <div className="mb-9 text-center">
          <p className="text-sm font-black uppercase tracking-[.25em] text-yellow-300">
            Today's picks
          </p>

          <h2 className="mt-2 text-4xl font-black sm:text-5xl">
            CAN YOU HANDLE THESE?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-white/50">
            One riddle, one kadi joke and one amazing fact to kick-start your
            brain.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {/* Riddle */}

          <div id="riddles">
            <RevealCard
              type="Riddle of the Day"
              icon="🧩"
              question="I have hands but cannot clap. What am I?"
              answer="A clock. ⏰"
            />
          </div>

          {/* Kadi Joke */}

          <div id="kadi">
            <RevealCard
              type="Kadi of the Day"
              icon="😂"
              question="Why did the computer go to the doctor?"
              answer="Because it had a virus! 💻😂"
            />
          </div>

          {/* Fact */}

          <div id="facts">
            <RevealCard
              type="Amazing Fact of the Day"
              icon="🤯"
              question="Which sea creature has three hearts?"
              answer="An octopus. 🐙"
            />
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* EXPLORE SECTION */}
      {/* ========================================================= */}

      <section className="relative z-10 mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <div className="mb-9 text-center">
          <p className="text-sm font-black uppercase tracking-[.25em] text-yellow-300">
            Pick your mood
          </p>

          <h2 className="mt-2 text-4xl font-black sm:text-5xl">
            WHAT ARE YOU IN THE MOOD FOR?
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {/* Riddles */}

          <Link
            href="/riddles"
            className="group touch-manipulation rounded-[30px] border border-violet-400/20 bg-violet-600/20 p-7 transition hover:-translate-y-2 hover:bg-violet-600/30 active:scale-[.98]"
          >
            <div className="text-5xl transition group-hover:scale-110">
              🧩
            </div>

            <h3 className="mt-5 text-2xl font-black">
              Riddles
            </h3>

            <p className="mt-2 text-white/60">
              English, Tamil, funny, logic and tricky riddles.
            </p>

            <div className="mt-5 font-black text-violet-300">
              Challenge Yourself →
            </div>
          </Link>

          {/* Kadi Jokes */}

          <Link
            href="/kadi-jokes"
            className="group touch-manipulation rounded-[30px] border border-orange-400/20 bg-orange-500/20 p-7 transition hover:-translate-y-2 hover:bg-orange-500/30 active:scale-[.98]"
          >
            <div className="text-5xl transition group-hover:scale-110">
              😂
            </div>

            <h3 className="mt-5 text-2xl font-black">
              Kadi Jokes
            </h3>

            <p className="mt-2 text-white/60">
              Tamil kadi jokes, English jokes and silly one-liners.
            </p>

            <div className="mt-5 font-black text-orange-300">
              Make Me Laugh →
            </div>
          </Link>

          {/* Amazing Facts */}

          <Link
            href="/facts"
            className="group touch-manipulation rounded-[30px] border border-green-400/20 bg-green-500/20 p-7 transition hover:-translate-y-2 hover:bg-green-500/30 active:scale-[.98]"
          >
            <div className="text-5xl transition group-hover:scale-110">
              🌍
            </div>

            <h3 className="mt-5 text-2xl font-black">
              Amazing Facts
            </h3>

            <p className="mt-2 text-white/60">
              Animals, space, science, India, history and weird facts.
            </p>

            <div className="mt-5 font-black text-green-300">
              Feed My Curiosity →
            </div>
          </Link>
        </div>
      </section>

      {/* ========================================================= */}
      {/* FINAL CTA */}
      {/* ========================================================= */}

      <section className="relative z-10 mx-auto max-w-5xl px-5 pb-20">
        <div className="relative overflow-hidden rounded-[36px] border border-yellow-300/20 bg-gradient-to-br from-yellow-300/10 via-violet-600/10 to-orange-500/10 p-8 text-center sm:p-12">
          {/* Decorative glow */}

          <div
            className="pointer-events-none absolute left-1/2 top-0 size-48 -translate-x-1/2 rounded-full bg-yellow-300/10 blur-3xl"
            aria-hidden="true"
          />

          <div className="relative z-10">
            <div className="text-5xl">🧠</div>

            <h2 className="mt-5 text-3xl font-black sm:text-4xl">
              READY TO TEST YOUR BRAIN?
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-white/60">
              Find a riddle. Laugh at a terrible joke. Discover something
              amazing. There's always something new to explore.
            </p>

            <Link
              href="/riddles"
              className="mt-7 inline-flex touch-manipulation rounded-full bg-yellow-300 px-7 py-4 font-black text-slate-950 shadow-xl transition hover:-translate-y-1 hover:bg-yellow-200 active:translate-y-0 active:scale-95"
            >
              🧩 Start With a Riddle →
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* FOOTER */}
      {/* ========================================================= */}

      <footer className="border-t border-white/10 bg-black/15">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-10 text-sm text-white/50 md:flex-row md:items-center md:justify-between lg:px-8">
          <div>
            <b className="text-white">KADI RIDDLER</b>

            <p className="mt-1">
              Think. Laugh. Get Tricked.
            </p>
          </div>

          <div className="flex flex-wrap gap-5">
            <Link
              href="/riddles"
              className="touch-manipulation transition hover:text-white"
            >
              Riddles
            </Link>

            <Link
              href="/kadi-jokes"
              className="touch-manipulation transition hover:text-white"
            >
              Kadi Jokes
            </Link>

            <Link
              href="/facts"
              className="touch-manipulation transition hover:text-white"
            >
              Amazing Facts
            </Link>
          </div>

          <p>© 2026 Kadi Riddler</p>
        </div>
      </footer>
    </main>
  );
}