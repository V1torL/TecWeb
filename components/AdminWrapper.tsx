"use client";

import { ReactNode } from "react";
import HeaderAdmin from "./HeaderAdmin";
import "./admin.css";

export default function AdminWrapper({ children }: { children: ReactNode }) {
  return (
    <>
      <HeaderAdmin />
      <main className="admin-content">{children}</main>
    </>
  );
}
