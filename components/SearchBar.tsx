"use client";
import { Search } from "lucide-react";
import type { ReactElement } from "react";
import { useAppContext } from "@/lib/app-context";

export default function SearchBar(): ReactElement {
	const { search, setSearch } = useAppContext();
	return (
		<div className="search-box">
			<Search size={16} />
			<input
				value={search}
				onChange={(e) => setSearch(e.target.value)}
				type="text"
				placeholder="Busque na Loja"
			/>
		</div>
	);
}
