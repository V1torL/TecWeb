"use client";

import { ReactNode } from "react";
import styled from "styled-components";
import HeaderAdmin from "./HeaderAdmin";

const Content = styled.main`
  margin-left: 240px; /* mesmo tamanho do Sidebar */
  padding: 24px;
  min-height: 100vh;
  background-color: #f9f9f9;
`;

export default function AdminWrapper({ children }: { children: ReactNode }) {
  return (
    <>
      <HeaderAdmin />
      <Content>{children}</Content>
    </>
  );
}
