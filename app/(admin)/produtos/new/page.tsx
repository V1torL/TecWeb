"use client";

import styled from "styled-components";
import { createProductAction } from "@/lib/actions/productsActions";
import AdminWrapper from "@/components/AdminWrapper";

const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 40px 20px;
`;

const Form = styled.form`
  width: 100%;
  max-width: 600px;
  background-color: #ffffff;
  border-radius: 12px;
  padding: 32px 24px;
  box-shadow: 0 6px 20px rgba(0,0,0,0.08);
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
  color: #111827;
`;

const Input = styled.input`
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  font-size: 1rem;
  outline: none;
  transition: all 0.2s;

  &::placeholder {
    color: #9ca3af;
  }

  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59,130,246,0.2);
  }
`;

const Textarea = styled.textarea`
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  font-size: 1rem;
  outline: none;
  transition: all 0.2s;
  min-height: 100px;

  &::placeholder {
    color: #9ca3af;
  }

  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59,130,246,0.2);
  }
`;

const Button = styled.button`
  padding: 12px;
  border-radius: 8px;
  border: none;
  background-color: #3b82f6;
  color: white;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #2563eb;
    transform: translateY(-1px);
    box-shadow: 0 4px 10px rgba(0,0,0,0.15);
  }
`;

export default function NewProductPage() {
  async function handleSubmit(formData: FormData) {
    await createProductAction(formData);
    alert("Produto criado com sucesso!");
  }

  return (
    <AdminWrapper>
      <PageContainer>
        <Form action={handleSubmit}>
          <Title>Novo Produto</Title>
          <Input name="name" placeholder="Nome do produto" required />
          <Textarea name="description" placeholder="Descrição do produto" />
          <Input name="price" type="number" step="0.01" placeholder="Preço" required />
          <Input name="stock" type="number" placeholder="Estoque" required />
          <Button type="submit">Criar</Button>
        </Form>
      </PageContainer>
    </AdminWrapper>
  );
}
