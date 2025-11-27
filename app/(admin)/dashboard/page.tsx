"use client";

import { logoutAction } from "@/lib/actions";
import AdminWrapper from "@/components/AdminWrapper";
import "./dashboard.css";

export default function DashboardPage() {
  return (
    <AdminWrapper>
      <div className="dashboard-container">
        <div className="card">
          <h1 className="page-title">Bem-vindo, Admin!</h1>
          <p className="dashboard-paragraph">Esta é a área administrativa.</p>
          <p className="dashboard-paragraph">Aqui irão ficar os dados estatísticos.</p>
          <form action={logoutAction}>
            <button type="submit" className="danger">Logout</button>
          </form>
        </div>
      </div>
    </AdminWrapper>
  );
}
