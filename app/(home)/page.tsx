"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { addToCart, getAllProducts } from "@/lib/actions/products";
import "./home.css";
import { useAppContext } from "@/lib/app-context";
import QuantitySelector from "@/components/QuantitySelector";
import type { Product } from "@prisma/client";
type ProductWithImage = Product & {
  image?: string | null;
};

export default function Home() {
  const { search } = useAppContext();
  const [products, setProducts] = useState<ProductWithImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const router = useRouter();
  
  const handleAddToCart = useCallback(
    async (productId: string) => {
      const quantity = quantities[productId] || 1;
      await addToCart(productId, quantity);
      router.push("/cart");
    },
    [router, quantities],
  );

  useEffect(() => {
    async function fetchProducts() {
      try {
        const data = await getAllProducts(search);
        const productsWithImage = data as ProductWithImage[];
        setProducts(productsWithImage);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [search]);

  if (loading) return <p className="loading">Carregando...</p>;

  return (
    <div className="p2 container">
      {products.map((product) => {
        const imageUrl = product.image || "/produto_sem_imagem.jpg";
        
        return (
          <div className="card" key={product.id}>
            <div className="product-image">
              <Image
                src={imageUrl}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                style={{ objectFit: "cover" }}
                className="product-image-content"
              />
              {!product.image && (
                <div className="no-image-indicator">
                  Sem imagem
                </div>
              )}
            </div>
            
            <h2 className="product-name">{product.name}</h2>
            <p className="product-price">R$ {product.price.toFixed(2)}</p>
            
            <QuantitySelector
              max={product.stock}
              onChange={(value) =>
                setQuantities((prev) => ({ ...prev, [product.id]: value }))
              }
            />
            
            <button 
              type="button" 
              onClick={() => handleAddToCart(product.id)}
              disabled={product.stock === 0}
              className={product.stock === 0 ? "disabled-btn" : "add-to-cart-btn"}
            >
              {product.stock === 0 ? "Esgotado" : "Adicionar ao Carrinho"}
            </button>
          </div>
        );
      })}
    </div>
  );
}