"use client";

import { useState, useEffect } from "react";
import { getAllProducts } from "@/lib/actions/products";
import { addStockAction } from "@/lib/actions/productsActions";
import AdminWrapper from "@/components/AdminWrapper";
import type { Product } from "@prisma/client";
import "./estoque.css";

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
      <div className="page-container">
        <h1 className="page-title">Gerenciamento de Estoque</h1>
        <div className="table-wrapper">
          <table className="data-table">
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
                    <form
                      className="estoque-form"
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
                      <input name="count" type="number" min="1" required className="estoque-input" />
                      <button type="submit" disabled={loadingIds.includes(p.id)}>
                        {loadingIds.includes(p.id) ? "Adicionando..." : "Adicionar"}
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminWrapper>
  );
}
