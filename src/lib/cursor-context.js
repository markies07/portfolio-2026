"use client";

import { createContext, useContext, useMemo, useState, useCallback } from "react";

const CursorContext = createContext(null);

export function CursorProvider({ children }) {
  const [variant, setVariant] = useState("default");
  const [label, setLabel] = useState("");

  const setCursor = useCallback((nextVariant, nextLabel = "") => {
    setVariant(nextVariant);
    setLabel(nextLabel);
  }, []);

  const resetCursor = useCallback(() => {
    setVariant("default");
    setLabel("");
  }, []);

  const value = useMemo(
    () => ({ variant, label, setCursor, resetCursor }),
    [variant, label, setCursor, resetCursor]
  );

  return (
    <CursorContext.Provider value={value}>{children}</CursorContext.Provider>
  );
}

export function useCursor() {
  const ctx = useContext(CursorContext);
  if (!ctx) {
    return { variant: "default", label: "", setCursor: () => {}, resetCursor: () => {} };
  }
  return ctx;
}
