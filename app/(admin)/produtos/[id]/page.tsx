"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getProductById } from "@/lib/actions/products";
import { updateProductAction } from "@/lib/actions/productsActions";
import AdminWrapper from "@/components/AdminWrapper";
import { Input } from "@/lib/components";
import type { Product } from "@prisma/client";
import "./edit.css";

export default function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const p = await getProductById(id);
        if (p) {
          setProduct(p);
        } else {
          setProduct(null);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!product) return;

    setSaving(true);
    const formData = new FormData(e.currentTarget);
    await updateProductAction(product.id, {
      name: String(formData.get("name")),
      description: (formData.get("description") as string) || undefined,
      price: Number(formData.get("price")),
    });

    setSaving(false);
    router.push("/produtos");
  }

  if (loading) {
    return <p className="edit-product-loading">Carregando...</p>;
  }

  if (!product) {
    return (
      <div className="edit-product-not-found">
        <h1 className="page-title">Produto não encontrado</h1>
        <p>O produto que você está tentando editar não existe.</p>
        <a href="/produtos/new">
          <button>Cadastrar Novo Produto</button>
        </a>
      </div>
    );
  }

  return (
    <AdminWrapper>
      <div className="centered-container">
        <form className="form-container" onSubmit={handleSubmit}>
          <h1 className="page-title">Editar Produto</h1>
          <Input
            name="name"
            defaultValue={product.name}
            required
            placeholder="Nome do produto"
          />
          <textarea
            name="description"
            defaultValue={product.description ?? ""}
            placeholder="Descrição do produto"
          />
          <Input
            name="price"
            type="number"
            step="0.01"
            defaultValue={product.price}
            required
            placeholder="Preço"
          />
          <button type="submit" disabled={saving} className="success">
            {saving ? "Salvando..." : "Salvar"}
          </button>
        </form>
      </div>
    </AdminWrapper>
  );
}
