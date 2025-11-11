"use client";

import Link from "next/link";
import styled from "styled-components";
import { useEffect, useState } from "react";
import { getProductById } from "@/lib/actions/products";
import { updateProductAction } from "@/lib/actions/productsActions";
import AdminWrapper from "@/components/AdminWrapper";

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  stock?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
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

  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59,130,246,0.2);
  }
`;

const Button = styled.button`
  padding: 12px;
  border-radius: 8px;
  border: none;
  background-color: #10b981;
  color: white;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #059669;
    transform: translateY(-1px);
    box-shadow: 0 4px 10px rgba(0,0,0,0.15);
  }
`;

const NotFoundContainer = styled.div`
  text-align: center;
  padding: 60px 20px;
`;

const LinkButton = styled(Link)`
  display: inline-block;
  margin-top: 20px;
  background-color: #3b82f6;
  color: white;
  padding: 12px 20px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.2s;

  &:hover {
    background-color: #2563eb;
    transform: translateY(-1px);
  }
`;

const Loading = styled.p`
  text-align: center;
  margin-top: 60px;
  font-size: 1.2rem;
  color: #6b7280;
`;

export default function EditProductPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const p = await getProductById(id);
        if (p) {
          setProduct({ ...p, description: p.description ?? undefined });
        } else {
          setProduct(null);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  if (loading) {
    return <Loading>Carregando...</Loading>;
  }

  if (!product) {
    return (
      <NotFoundContainer>
        <Title>Produto não encontrado</Title>
        <p>O produto que você está tentando editar não existe. Deseja cadastrar um novo produto?</p>
        <LinkButton href="/produtos/new">Cadastrar Novo Produto</LinkButton>
      </NotFoundContainer>
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!product) return;

    const formData = new FormData(e.currentTarget);
    await updateProductAction(product.id, {
      name: String(formData.get("name")),
      description: (formData.get("description") as string) || undefined,
      price: Number(formData.get("price")),
    });

    alert("Produto atualizado!");
  }

  return (
    <AdminWrapper>
      <PageContainer>
        <Form onSubmit={handleSubmit}>
          <Title>Editar Produto</Title>
          <Input name="name" defaultValue={product.name} required placeholder="Nome do produto" />
          <Textarea name="description" defaultValue={product.description ?? ""} placeholder="Descrição do produto" />
          <Input name="price" type="number" step="0.01" defaultValue={product.price} required placeholder="Preço" />
          <Button type="submit">Salvar</Button>
        </Form>
      </PageContainer>
    </AdminWrapper>
  );
}
