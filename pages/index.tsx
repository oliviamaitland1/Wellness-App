import React from "react";
import Link from "next/link";

export default function HomePage() {
  const page = "min-h-screen bg-[var(--bg)] text-[var(--text)] dark:bg-neutral-950 dark:text-neutral-50";
  const container = "max-w-3xl mx-auto px-4 sm:px-6 py-10";
  const card = "bg-[var(--card)]/85 dark:bg-neutral-900/85 backdrop-blur rounded-2xl border border-[var(--border)]/50 dark:border-neutral-800 shadow-lg";
  const titleBadge = "inline-block px-4 py-2 rounded-2xl bg-white/80 dark:bg-white/15";
  const cta = "px-5 py-3 rounded-xl font-medium shadow-sm transition";
  const primary = `${cta} bg-[var(--brand)] text-white hover:brightness-110 hover:shadow-[0_0_12px_var(--brand)]`;
  const secondary = `${cta} border border-[var(--border)]/60 hover:bg-[var(--card)]/60`;

  return (
    <div className={page}>
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-pink-300/30 dark:bg-pink-500/15 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-purple-300/30 dark:bg-purple-500/15 blur-3xl" />
      </div>

      <header className={`${container} pb-4 pt-2 flex items-center justify-between`}>
        <div className="flex items-center gap-2">
          <span className="text-2xl">🌸</span>
        </div>
      </header>

      <main className={container}>
        <section className={`${card} p-6 sm:p-10 text-center`}>
          <h1 className={`${titleBadge} text-3xl sm:text-5xl font-extrabold font-[bungee] tracking-tight`}>
          ✨Welcome to the Wellness App✨
          </h1>
          <p className="mt-4 text-sm sm:text-base opacity-90 font-[tektur]">
          Begin your glow-up with tools to nourish your body, calm your mind, and track your progress — all in one cozy space. 💋
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link href="/login" className={primary}>
              Log in
            </Link>
            <Link href="/register" className={secondary}>
              Register
            </Link>
          </div>
        </section>

        <section className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className={`${card} p-5`}>
            <div className="text-2xl">📖</div>
            <h3 className="mt-2 font-semibold">Journal</h3>
            <p className="mt-1 text-sm opacity-80">Reflect daily!</p>
          </div>
          <div className={`${card} p-5`}>
            <div className="text-2xl">💧</div>
            <h3 className="mt-2 font-semibold">Water & Sleep</h3>
            <p className="mt-1 text-sm opacity-80">Log cups and hours to build healthy habits.</p>
          </div>
          <div className={`${card} p-5`}>
            <div className="text-2xl">🌸</div>
            <h3 className="mt-2 font-semibold">Gratitude</h3>
            <p className="mt-1 text-sm opacity-80">Three wins a day to rewire your mindset.</p>
          </div>
        </section>

        <footer className="mt-10 text-center text-xs opacity-70">
          Created 💖 by Olivia
        </footer>
      </main>
    </div>
  );
}