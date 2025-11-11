"use client";

import { useState, useEffect } from "react";
import styled from "styled-components";
import { getAllProducts } from "@/lib/actions/products";
import { addStockAction } from "@/lib/actions/productsActions";
import AdminWrapper from "@/components/AdminWrapper";

const Container = styled.div`
  width: 100%;
  padding: 20px;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 24px;
  color: #111827;
`;

const TableWrapper = styled.div`
  overflow-x: auto;
  border-radius: 12px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  background-color: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  min-width: 600px;

  th,
  td {
    padding: 12px 16px;
    text-align: left;
  }

  th {
    background-color: #f3f4f6;
    font-weight: 600;
    color: #374151;
  }

  td {
    border-top: 1px solid #e5e7eb;
    color: #4b5563;
  }

  tr:hover td {
    background-color: #f9fafb;
  }
`;

const Form = styled.form`
  display: flex;
  gap: 8px;
`;

const Input = styled.input`
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid #d1d5db;
  width: 70px;
  font-size: 0.95rem;
  outline: none;

  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
  }
`;

const AddButton = styled.button<{ loading?: boolean }>`
  padding: 6px 12px;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #2563eb;
    transform: translateY(-1px);
  }

  &:disabled {
    background-color: #93c5fd;
    cursor: not-allowed;
    transform: none;
  }
`;

interface Product {
  id: string;
  name: string;
  stock: number;
}

export default function EstoquePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingIds, setLoadingIds] = useState<string[]>([]);

  useEffect(() => {
    async function fetchProducts() {
      const data = await getAllProducts();
      setProducts(data);
    }
    fetchProducts();
  }, []);

  async function handleAddStock(productId: string, count: number) {
    setLoadingIds((prev) => [...prev, productId]);
    await addStockAction(productId, count);
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, stock: p.stock + count } : p))
    );
    setLoadingIds((prev) => prev.filter((id) => id !== productId));
  }

  return (
    <AdminWrapper>
      <Container>
        <Title>Gerenciamento de Estoque</Title>
        <TableWrapper>
          <Table>
            <thead>
              <tr>
                <th>Produto</th>
                <th>Estoque Atual</th>
                <th>Adicionar</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{p.stock}</td>
                  <td>
                    <Form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        const form = e.target as HTMLFormElement;
                        const formData = new FormData(form);
                        const count = Number(formData.get("count"));
                        if (!count || count <= 0) return;
                        await handleAddStock(p.id, count);
                        form.reset();
                      }}
                    >
                      <Input name="count" type="number" min="1" required />
                      <AddButton type="submit" disabled={loadingIds.includes(p.id)}>
                        {loadingIds.includes(p.id) ? "Adicionando..." : "Adicionar"}
                      </AddButton>
                    </Form>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableWrapper>
      </Container>
    </AdminWrapper>
  );
}
