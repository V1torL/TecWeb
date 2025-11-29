"use client";

import Link from "next/link";
import { PackagePlus, Boxes, ClipboardList, ScrollText, AlignEndHorizontal, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import "./admin.css";

export default function HeaderAdmin() {
  return (
    <aside className="sidebar-container">
      <div className="sidebar-header">
        <Link href="/dashboard">
          Elementx Fitness
        </Link>
      </div>

      <nav className="sidebar-nav">
        <Link href="/dashboard" className="sidebar-nav-link">
          <AlignEndHorizontal size={20} />
          Dashboard
        </Link>

        <Link href="/produtos/new" className="sidebar-nav-link">
          <PackagePlus size={20} />
          Cadastrar Produtos
        </Link>

        <Link href="/produtos" className="sidebar-nav-link">
          <ClipboardList size={20} />
          Gerenciar Produtos
        </Link>

        <Link href="/estoque" className="sidebar-nav-link">
          <Boxes size={20} />
          Gerenciar Estoque
        </Link>

        <Link href="/logs" className="sidebar-nav-link">
          <ScrollText size={20} />
          Histórico de Logs
        </Link>
      </nav>

      <button className="sidebar-logout-button" onClick={() => signOut({ callbackUrl: "/login" })}>
        <LogOut size={20} />
        Sair
      </button>
    </aside>
  );
}
