"use client";

import { getAllProducts } from "@/lib/actions/products";
import { deleteProductAction } from "@/lib/actions/productsActions";
import Link from "next/link";
import { useState, useEffect } from "react";
import AdminWrapper from "@/components/AdminWrapper";
import type { Product } from "@prisma/client";
import "./produtos.css";

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
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Produtos</h1>
          <Link href="/produtos/new">
            <button>Novo Produto</button>
          </Link>
        </div>

        <div className="table-wrapper">
          <table className="data-table">
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
                    <div className="action-buttons">
                      <Link href={`/produtos/${p.id}`}>
                        <button className="warning">Editar</button>
                      </Link>
                      <button className="danger" onClick={() => handleDelete(p.id)}>Excluir</button>
                    </div>
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
