"use client";

import Link from "next/link";
import styled from "styled-components";
import { PackagePlus, Boxes, ClipboardList, AlignEndHorizontal, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

const SidebarContainer = styled.aside`
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 240px;
  background-color: #0a0a0a;
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.3);
  z-index: 100;
`;

const SidebarHeader = styled.div`
  padding: 24px 16px;
  border-bottom: 1px solid #1f1f1f;
  text-align: center;
  font-weight: 700;
  font-size: 1.1rem;
  color: #e5e5e5;
  letter-spacing: 0.5px;
`;

const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  flex-grow: 1;
`;

const NavLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  color: #d1d5db;
  text-decoration: none;
  transition: background 0.2s, color 0.2s;
  font-size: 0.95rem;

  &:hover {
    background-color: #1a1a1a;
    color: #fff;
  }

  svg {
    flex-shrink: 0;
  }
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 20px;
  color: #f87171;
  background: none;
  border: none;
  outline: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
  font-size: 0.95rem;
  transition: background 0.2s, color 0.2s;

  &:hover {
    background-color: #1a1a1a;
    color: #fff;
  }

  svg {
    flex-shrink: 0;
  }
`;

export default function HeaderAdmin() {
  return (
    <SidebarContainer>
      <SidebarHeader>
        <Link href="/dashboard">
          Elementx Fitness
        </Link>
      </SidebarHeader>

      <Nav>
        <NavLink href="/dashboard">
          <AlignEndHorizontal size={20} />
          Dashboard
        </NavLink>

        <NavLink href="/produtos/new">
          <PackagePlus size={20} />
          Cadastrar Produtos
        </NavLink>

        <NavLink href="/produtos">
          <ClipboardList size={20} />
          Gerenciar Produtos
        </NavLink>

        <NavLink href="/estoque">
          <Boxes size={20} />
          Gerenciar Estoque
        </NavLink>
      </Nav>

      <LogoutButton onClick={() => signOut({ callbackUrl: "/login" })}>
        <LogOut size={20} />
        Sair
      </LogoutButton>
    </SidebarContainer>
  );
}
