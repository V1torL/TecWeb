"use client";

import { getAllProducts } from "@/lib/actions/products";
import { deleteProductAction } from "@/lib/actions/productsActions";
import Link from "next/link";
import styled from "styled-components";
import { useState, useEffect } from "react";
import AdminWrapper from "@/components/AdminWrapper";

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
}

const Container = styled.div`
  width: 100%;
  padding: 40px 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
`;

const NewButton = styled(Link)`
  padding: 10px 20px;
  background-color: #3b82f6;
  color: white;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s;

  &:hover {
    background-color: #2563eb;
    transform: translateY(-1px);
    box-shadow: 0 4px 10px rgba(0,0,0,0.15);
  }
`;

const TableWrapper = styled.div`
  overflow-x: auto;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  min-width: 600px;

  th, td {
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

const ActionContainer = styled.div`
  display: flex;
  gap: 8px;
`;

const Button = styled.button<{ variant?: "edit" | "delete" }>`
  padding: 6px 12px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  color: white;
  transition: all 0.2s;

  background-color: ${({ variant }) =>
    variant === "delete" ? "#ef4444" : "#facc15"};
  
  &:hover {
    background-color: ${({ variant }) =>
      variant === "delete" ? "#dc2626" : "#ca8a04"};
    transform: translateY(-1px);
    box-shadow: 0 2px 6px rgba(0,0,0,0.15);
  }
`;

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function fetchProducts() {
      const data: Product[] = await getAllProducts();
      setProducts(data);
    }
    fetchProducts();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Tem certeza que deseja excluir este produto?")) return;
    await deleteProductAction(id);
    setProducts(products.filter(p => p.id !== id));
  }

  return (
    <AdminWrapper>
      <Container>
        <Header>
          <Title>Produtos</Title>
          <NewButton href="/produtos/new">Novo Produto</NewButton>
        </Header>

        <TableWrapper>
          <Table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Preço</th>
                <th>Estoque</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>R$ {p.price.toFixed(2)}</td>
                  <td>{p.stock}</td>
                  <td>
                    <ActionContainer>
                      <Link href={`/produtos/${p.id}`}>
                        <Button variant="edit">Editar</Button>
                      </Link>
                      <Button variant="delete" onClick={() => handleDelete(p.id)}>Excluir</Button>
                    </ActionContainer>
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
