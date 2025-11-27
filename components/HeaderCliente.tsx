"use client";
import { LogOut as Icon } from "lucide-react";
import { signOut } from "next-auth/react";
import "./header.css";

export default function LogOut() {
	return <Icon size={20} onClick={() => signOut({ redirectTo: "/login" })} />;
}
