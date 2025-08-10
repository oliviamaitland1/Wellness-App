import React from "react";
import Link from "next/link";
import RegisterForm from "./registerform";

export default function RegisterPage() {
  const page = "min-h-screen bg-[var(--bg)] text-[var(--text)] dark:bg-neutral-950 dark:text-neutral-50";
  const shell = "max-w-md mx-auto px-4 sm:px-6 py-10";
  const card = "bg-[var(--card)]/85 dark:bg-neutral-900/85 backdrop-blur rounded-2xl border border-[var(--border)]/50 dark:border-neutral-800 shadow-lg p-6 sm:p-8";
  const titleBadge = "inline-block px-4 py-2 rounded-2xl bg-white/80 dark:bg-white/15";
  const linkBase = "underline underline-offset-4 hover:opacity-100 transition";
  const linkMuted = `${linkBase} opacity-90`;

  return (
    <div className={page}>
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-pink-300/30 dark:bg-pink-500/15 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-purple-300/30 dark:bg-purple-500/15 blur-3xl" />
      </div>

      <main className={shell}>
        <div className={card}>
          <h1 className={`${titleBadge} text-2xl sm:text-3xl font-extrabold tracking-tight`}>
            Join the Wellness Hub 🌸
          </h1>
          <p className="mt-3 text-sm opacity-85">
            Create your account and start your journey to feeling your best.
          </p>

          <div className="mt-6">
            <RegisterForm />
          </div>

          <div className="mt-6 flex items-center justify-between text-sm">
            <Link href="/login" className={linkMuted}>
              Already have an account? Log in
            </Link>
            <Link href="/" className={linkMuted}>
              ← Back to Home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
