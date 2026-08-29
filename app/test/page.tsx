"use client";

import { useState } from "react";

export default function TestPage() {
  const [count, setCount] = useState(0);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#070b25",
        color: "white",
        padding: "40px 20px",
        textAlign: "center",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1 style={{ fontSize: "32px", fontWeight: "bold" }}>
        Mobile Button Test
      </h1>

      <p style={{ marginTop: "20px", fontSize: "20px" }}>
        Button clicked:
        <strong> {count}</strong> times
      </p>

      <button
        type="button"
        onClick={() => setCount((value) => value + 1)}
        style={{
          marginTop: "30px",
          padding: "18px 30px",
          border: "none",
          borderRadius: "50px",
          background: "#7c3aed",
          color: "white",
          fontSize: "18px",
          fontWeight: "bold",
          cursor: "pointer",
          touchAction: "manipulation",
        }}
      >
        TAP ME
      </button>

      <button
        type="button"
        onClick={() => alert("JavaScript is working on this phone!")}
        style={{
          display: "block",
          margin: "20px auto",
          padding: "18px 30px",
          border: "none",
          borderRadius: "50px",
          background: "#ff8a00",
          color: "white",
          fontSize: "18px",
          fontWeight: "bold",
          cursor: "pointer",
          touchAction: "manipulation",
        }}
      >
        TEST ALERT
      </button>
    </main>
  );
}