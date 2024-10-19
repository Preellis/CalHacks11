"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function testGemini() {
  const [result, setResult] = useState<string | null>(null);

  useEffect(() => {
    axios.get("/api/gemini")
      .then((response) => {
        setResult(response.data.response);
      })
      .catch((error) => {
        console.error("Error fetching Gemini API result:", error);
        setResult(null);
      });
  }, []);
  

  console.log(result);

  return (
    <div>
      <p>Gemini Tester</p>
    </div>
  );
}
