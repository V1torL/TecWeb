"use client";

import { useState, useEffect } from "react";
import styled from "styled-components";
import { getAllProducts } from "@/lib/actions/products";

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
}

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); /* máximo ~5 por linha */
  gap: 16px; /* menor espaçamento entre produtos */
  justify-items: center;
  padding: 40px 20px;
  background-color: #f9fafb;
`;

const Card = styled.div`
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.06);
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 240px;
  height: 300px;
  transition: transform 0.2s, box-shadow 0.2s;
  text-align: center;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  }
`;

const ProductName = styled.h2`
  font-size: 1.1rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 8px;
  min-height: 48px; /* Mantém altura uniforme mesmo com nomes diferentes */
`;

const ProductPrice = styled.p`
  font-size: 1.1rem;
  font-weight: 600;
  color: #10b981;
  margin-bottom: 16px;
`;

const AddButton = styled.button`
  margin-top: auto;
  padding: 10px 0;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, transform 0.1s;

  &:hover {
    background-color: #2563eb;
    transform: scale(1.03);
  }

  &:active {
    transform: scale(0.98);
  }
`;

const Loading = styled.p`
  text-align: center;
  font-size: 1.2rem;
  color: #6b7280;
  margin-top: 60px;
`;

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const data = await getAllProducts();
        setProducts(data);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  if (loading) {
    return <Loading>Carregando produtos...</Loading>;
  }

  return (
    <Container>
      {products.map((product) => (
        <Card key={product.id}>
          <ProductName>{product.name}</ProductName>
          <ProductPrice>R$ {product.price.toFixed(2)}</ProductPrice>
          <AddButton>Adicionar ao Carrinho</AddButton>
        </Card>
      ))}
    </Container>
  );
}
