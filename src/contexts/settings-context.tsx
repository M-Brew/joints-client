"use client";

import { createContext, useState } from "react";

export const SettingsContext = createContext<ISettingsContext>(
  {} as ISettingsContext
);

export default function SettingsContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [slug, setSlug] = useState("meal-types");

  const handleSetSlug = (slug: string) => {
    setSlug(slug);
  };

  return (
    <SettingsContext.Provider value={{ slug, handleSetSlug }}>
      {children}
    </SettingsContext.Provider>
  );
}

interface ISettingsContext {
  slug: string;
  handleSetSlug: (slug: string) => void;
}
