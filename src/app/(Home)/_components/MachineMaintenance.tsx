"use client";

import React, { useState } from "react";
import { Settings } from "lucide-react";

export default function MachineMaintenance() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    // TODO: wire up to your newsletter provider
    setSubmitted(true);
  };

  return (
    <section
      className="w-full flex items-center justify-center px-6 py-20 sm:py-28 md:py-36"
      style={{
        background: "#F4F4ED",
        fontFamily: "'Barlow Condensed', 'Arial Narrow', sans-serif",
      }}
    >
      <div className="flex flex-col items-center text-center max-w-2xl mx-auto gap-5">
        {/* ── Icon ── */}
        <Settings size={36} strokeWidth={1.25} style={{ color: "#6b6b62" }} />

        {/* ── Headline ── */}
        <h2
          className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight"
          style={{
            color: "#1a1a1a",
            fontFamily: "'Playfair Display', Georgia, serif",
            letterSpacing: "-0.02em",
          }}
        >
          The Green Wire
        </h2>

        {/* ── Sub-copy ── */}
        <p
          className="text-sm sm:text-base leading-relaxed max-w-md"
          style={{ color: "#6b6b62" }}
        >
          Monthly reflections on sustainable design, circular technology, and
          quiet living.
          <br />
          No spam, just substance.
        </p>

        {/* ── Email form ── */}
        {/* {submitted ? (
          <p
            className="text-sm font-semibold tracking-widest uppercase mt-2"
            style={{ color: "#3d5a4c" }}
          >
            You&apos;re in. Welcome to the wire.
          </p>
        ) : 
        ( */}
        <form
          onSubmit={handleSubmit}
          className="w-full flex flex-col sm:flex-row items-stretch gap-0 mt-2"
          style={{ maxWidth: "520px" }}
        >
          {/* Email input */}
          <input
            type="email"
            required
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 px-5 py-4 text-sm outline-none bg-transparent"
            style={{
              border: "none",
              borderBottom: "1px solid #a0a09a",
              color: "#1a1a1a",
              fontFamily: "'Barlow Condensed', 'Arial Narrow', sans-serif",
            }}
          />

          {/* Subscribe button */}
          <button
            type="submit"
            className="px-8 py-4 text-xs font-semibold tracking-[0.2em] uppercase transition-opacity duration-200 hover:opacity-80 shrink-0"
            style={{
              background: "#5D5F5B",
              color: "#ffffff",
              fontFamily: "inherit",
            }}
          >
            Subscribe
          </button>
        </form>
        {/* )} */}

        {/* ── Social proof ── */}
        <p
          className="text-[10px] tracking-[0.2em] uppercase"
          style={{ color: "#a0a09a" }}
        >
          Join 12,000+ conscious tech enthusiasts.
        </p>
      </div>
    </section>
  );
}
