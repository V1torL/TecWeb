"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { addToCart, getAllProducts } from "@/lib/actions/products";
import "./home.css";
import { useAppContext } from "@/lib/app-context";

interface Product {
	id: string;
	name: string;
	price: number;
	stock: number;
}

export default function Home() {
	const { search } = useAppContext();
	const [products, setProducts] = useState<Product[]>([]);
	const [loading, setLoading] = useState(true);
	const router = useRouter();
	const handleAddToCart = useCallback(
		async (i: string) => {
			await addToCart(i, 1);
			router.push("/cart");
		},
		[router],
	);

	useEffect(() => {
		async function fetchProducts() {
			try {
				const data = await getAllProducts(search);
				setProducts(data);
			} catch (error) {
				console.error("Erro ao buscar produtos:", error);
			} finally {
				setLoading(false);
			}
		}
		fetchProducts();
	}, [search]);

	if (loading) return <p>Carregando...</p>;

	return (
		<div className="container">
			{products.map((product) => (
				<div className="card" key={product.id}>
					<div className="product-image">
						<Image
							src="/produto_sem_imagem.jpg"
							alt={product.name}
							fill
							style={{ objectFit: "cover" }}
						/>
					</div>
					<h2 className="product-name">{product.name}</h2>
					<p className="product-price">R$ {product.price.toFixed(2)}</p>
					<button type="button" onClick={() => handleAddToCart(product.id)}>
						Adicionar ao Carrinho
					</button>
				</div>
			))}
		</div>
	);
}
