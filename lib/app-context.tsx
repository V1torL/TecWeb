"use client";
import type React from "react";
import { createContext, useContext, useState } from "react";

const AppContext = createContext<App | null>(null);

export interface App {
	search: string;
	setSearch: React.Dispatch<React.SetStateAction<string>>;
}

export function useAppContext(): App {
	const ctx = useContext(AppContext);
	if (ctx === null) throw "Missing app context!";
	return ctx;
}

export function AppProvider({ children }) {
	const [search, setSearch] = useState("");
	const app = { search, setSearch };
	return <AppContext.Provider value={app}>{children}</AppContext.Provider>;
}
