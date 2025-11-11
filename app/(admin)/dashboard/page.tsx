"use client";

import { logoutAction } from "@/lib/actions";
import styled from "styled-components";
import AdminWrapper from "@/components/AdminWrapper";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  padding: 40px;
  min-height: calc(100vh - 40px);
`;

const Card = styled.div`
  background-color: #ffffff;
  border-radius: 12px;
  padding: 24px 32px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  max-width: 600px;
  width: 100%;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 2.25rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 12px;
`;

const Paragraph = styled.p`
  color: #6b7280;
  margin-bottom: 12px;
  line-height: 1.6;
`;

const LogoutButton = styled.button`
  padding: 12px 24px;
  background-color: #f87171;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.2s ease;
  margin-top: 16px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);

  &:hover {
    background-color: #ef4444;
    transform: translateY(-1px);
    box-shadow: 0 4px 10px rgba(0,0,0,0.2);
  }
`;

export default function DashboardPage() {
  return (
    <AdminWrapper>
      <Container>
        <Card>
          <Title>Bem-vindo, Admin!</Title>
          <Paragraph>Esta é a área administrativa.</Paragraph>
          <Paragraph>Aqui irão ficar os dados estatísticos.</Paragraph>
          <form action={logoutAction}>
            <LogoutButton type="submit">Logout</LogoutButton>
          </form>
        </Card>
      </Container>
    </AdminWrapper>
  );
}
