import React from "react";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-50">
      <header className="bg-white/70 backdrop-blur sticky top-0 shadow-sm">
        <div className="max-w-6xl mx-auto p-4 flex items-center justify-between">
          <div className="text-xl font-bold">SocialVerse</div>
          <nav>
            <a className="mr-4 text-sm text-slate-600" href="/">Home</a>
            <a className="text-sm text-slate-600" href="/auth">Auth</a>
          </nav>
        </div>
      </header>
      <main className="max-w-6xl mx-auto p-4">{children}</main>
      <footer className="max-w-6xl mx-auto p-4 text-xs text-center text-slate-500">
        Built with Django + React + Tailwind
      </footer>
    </div>
  );
}
