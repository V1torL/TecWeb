"use client";

import { createProductAction } from "@/lib/actions/productsActions";
import AdminWrapper from "@/components/AdminWrapper";
import "./new.css";

export default function NewProductPage() {
  async function handleSubmit(formData: FormData) {
    await createProductAction(formData);
    alert("Produto criado com sucesso!");
  }

  return (
    <AdminWrapper>
      <div className="centered-container">
        <form className="form-container" action={handleSubmit}>
          <h1 className="page-title">Novo Produto</h1>
          <input
            name="name"
            placeholder="Nome do produto"
            required
          />
          <textarea
            name="description"
            placeholder="Descrição do produto"
          />
          <input
            name="price"
            type="number"
            step="0.01"
            placeholder="Preço"
            required
          />
          <input
            name="stock"
            type="number"
            placeholder="Estoque"
            required
          />
          <button type="submit">Criar</button>
        </form>
      </div>
    </AdminWrapper>
  );
}
