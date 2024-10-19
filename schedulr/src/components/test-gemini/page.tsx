"use client";
import React, { useState } from "react";
import axios from "axios";

export default function testGemini() {
  const [result, setResult] = useState<string | null>(null);

  const testGemini = async () => {
    try {
      const res = await axios.get("/api/gemini")
      setResult(res.data.response);
    }
    catch (error) {
      console.error("Error fetching Gemini API result:", error);
      setResult(null);
    }
  };

  return (
    <div>
      <button onClick={testGemini}>Test Gemini</button>
    </div>
  );
}
