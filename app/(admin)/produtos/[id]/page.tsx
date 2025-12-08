"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getProductById } from "@/lib/actions/products";
import { updateProductAction } from "@/lib/actions/productsActions";
import AdminWrapper from "@/components/AdminWrapper";
import { Input } from "@/lib/components";
import type { Product } from "@prisma/client";
import Image from "next/image";
import "./edit.css";

type ProductWithImage = Product & {
  image?: string | null;
};

export default function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  const router = useRouter();

  const [product, setProduct] = useState<ProductWithImage | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [removeImage, setRemoveImage] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const p = await getProductById(id);
        if (p) {
          const productWithImage = p as ProductWithImage;
          setProduct(productWithImage);
          if (productWithImage.image) {
            setImagePreview(productWithImage.image);
          }
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
    
    if (selectedFile) {
      formData.append("image", selectedFile);
    }
    
    if (removeImage) {
      formData.append("removeImage", "true");
    }

    try {
      await updateProductAction(product.id, formData);
      
      setSaving(false);
      alert("Produto atualizado com sucesso!");
      router.push("/produtos");
    } catch (error) {
      setSaving(false);
      alert("Erro ao atualizar produto");
      console.error(error);
    }
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setRemoveImage(false);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  function handleRemoveImage() {
    setImagePreview(null);
    setSelectedFile(null);
    setRemoveImage(true);
  }

  if (loading) {
    return (
      <AdminWrapper>
        <div className="centered-container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Carregando produto...</p>
          </div>
        </div>
      </AdminWrapper>
    );
  }

  if (!product) {
    return (
      <AdminWrapper>
        <div className="centered-container">
          <div className="edit-product-not-found">
            <h1 className="page-title">Produto não encontrado</h1>
            <p>O produto que você está tentando editar não existe.</p>
            <div className="button-group">
              <Link href="/produtos/new">
                <button className="create-button">Cadastrar Novo Produto</button>
              </Link>
              <button 
                onClick={() => router.push("/produtos")}
                className="back-button"
              >
                Voltar para Produtos
              </button>
            </div>
          </div>
        </div>
      </AdminWrapper>
    );
  }

  return (
    <AdminWrapper>
      <div className="centered-container">
        <form className="form-container" onSubmit={handleSubmit}>
          <h1 className="page-title">Editar Produto</h1>
          
          <div className="form-group">
            <Input
              name="name"
              defaultValue={product.name}
              required
              placeholder="Nome do produto"
              className="edit-input"
            />
          </div>

          <div className="form-group">
            <textarea
              name="description"
              defaultValue={product.description ?? ""}
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
                defaultValue={product.price}
                required
                placeholder="Preço"
                className="edit-input"
              />
            </div>
            
            <div className="form-group half-width">
              <div className="stock-display">
                <label>Estoque Atual</label>
                <div className="stock-value">{product.stock} unidades</div>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="section-label">Imagem do Produto</label>
            
            {imagePreview && !removeImage ? (
              <div className="image-section">
                <div className="current-image">
                  <div className="image-preview-container">
                    {imagePreview.startsWith('data:') ? (
                      <Image 
                        src={imagePreview} 
                        alt="Preview" 
                        className="preview-image"
                      />
                    ) : (
                      <Image 
                        src={imagePreview} 
                        alt="Preview" 
                        className="preview-image"
                        width={120}
                        height={120}
                        style={{ objectFit: 'cover' }}
                      />
                    )}
                  </div>
                  <div className="image-actions">
                    <button 
                      type="button" 
                      onClick={handleRemoveImage}
                      className="remove-image-button"
                    >
                      Remover Imagem
                    </button>
                    <p className="image-hint">
                      Imagem atual será substituída
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="no-image-section">
                <div className="no-image-placeholder">
                  <svg 
                    className="image-icon" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
                    />
                  </svg>
                  <p>Nenhuma imagem disponível</p>
                </div>
              </div>
            )}
            
            <div className="upload-section">
              <label htmlFor="image-upload" className="upload-label">
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="upload-input"
                />
                <span className="upload-button">
                  {imagePreview && !removeImage ? 'Alterar Imagem' : 'Adicionar Imagem'}
                </span>
              </label>
              <p className="upload-hint">
                Formatos: JPG, PNG, GIF. Tamanho máximo: 5MB
              </p>
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              onClick={() => router.push("/produtos")}
              className="cancel-button"
              disabled={saving}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={saving} 
              className="save-button"
            >
              {saving ? (
                <>
                  <span className="spinner"></span>
                  Salvando...
                </>
              ) : (
                'Salvar Alterações'
              )}
            </button>
          </div>
        </form>
      </div>
    </AdminWrapper>
  );
}