"use client";

import { createProductAction } from "@/lib/actions/productsActions";
import AdminWrapper from "@/components/AdminWrapper";
import { Input } from "@/lib/components";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import "./new.css";

export default function NewProductPage() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    try {
      await createProductAction(formData);
      alert("Produto criado com sucesso!");
      // Limpar preview após envio
      setImagePreview(null);

      const form = document.querySelector('form') as HTMLFormElement;
      if (form) form.reset();
    } catch (error) {
      alert("Erro ao criar produto: " + (error as Error).message);
    }
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  return (
    <AdminWrapper>
      <div className="centered-container">
        <form className="form-container" action={handleSubmit}>
          <h1 className="page-title">Novo Produto</h1>
          
          <div className="form-group">
            <Input
              name="name"
              placeholder="Nome do produto"
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <textarea
              name="description"
              placeholder="Descrição do produto"
              className="description-textarea"
              rows={4}
            />
          </div>

          <div className="form-row">
            <div className="form-group half-width">
              <Input
                name="price"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="Preço"
                required
                className="form-input"
              />
            </div>
            
            <div className="form-group half-width">
              <Input
                name="stock"
                type="number"
                min="0"
                placeholder="Estoque inicial"
                required
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="image" className="file-label">
              Imagem do Produto (opcional)
              <input
                id="image"
                name="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="file-input"
              />
              <span className="file-button">Escolher arquivo</span>
            </label>
            
            {imagePreview && (
              <div className="image-preview">
                <div className="preview-container">
                  <Image 
                    src={imagePreview} 
                    alt="Preview" 
                    width={150}
                    height={150}
                    style={{ objectFit: 'cover' }}
                    className="preview-image"
                  />
                </div>
                <button 
                  type="button" 
                  className="remove-image"
                  onClick={() => setImagePreview(null)}
                >
                  Remover
                </button>
              </div>
            )}
            
            <p className="file-hint">
              Formatos aceitos: JPG, PNG, GIF. Tamanho máximo: 5MB
            </p>
          </div>

          <div className="form-actions">
            <Link href="/produtos">
              <button type="button" className="cancel-button">
                Cancelar
              </button>
            </Link>
            <button type="submit" className="submit-button">
              Criar Produto
            </button>
          </div>
        </form>
      </div>
    </AdminWrapper>
  );
}