"use client";

import type { Cart, Product, ProductInCart } from "@prisma/client";
import { useState } from "react";

export interface Props {
	cart: Cart;
	products: (ProductInCart & { product: Product })[];
}
export default function Client({ cart, products: initialProducts }: Props) {
	const [products, setProducts] = useState(initialProducts);
	const [inputValues, setInputValues] = useState<Record<string, string>>(
		Object.fromEntries(initialProducts.map(p => [p.id, String(p.amount)]))
	);

	const handleInputChange = (productId: string, index: number, rawValue: string) => {
		setInputValues(prev => ({ ...prev, [productId]: rawValue }));

		const val = parseFloat(rawValue);
		if (!Number.isNaN(val) && val > 0) {
			setProducts((products) => {
				const newProducts = [...products];
				newProducts[index] = { ...newProducts[index], amount: val };
				return newProducts;
			});
		}
	};

	const handleBlur = (productId: string, index: number) => {
		const val = parseFloat(inputValues[productId]);
		if (Number.isNaN(val) || val <= 0) {
			// Reset to the current product amount
			setInputValues(prev => ({ ...prev, [productId]: String(products[index].amount) }));
		}
	};

	return (
		<>
			<input type="hidden" name="cartId" value={cart.id} />
			<table>
				<thead>
					<tr>
						<th>Nome</th>
						<th>Preço</th>
						<th>Quantia</th>
						<th>Total</th>
					</tr>
				</thead>
				<tbody>
					{products.map((p, i) => (
						<tr key={p.id}>
							<td>{p.product.name}</td>
							<td>R$ {p.product.price}</td>
							<td>
								<input
									type="number"
									value={inputValues[p.id]}
									onChange={(ev) => handleInputChange(p.id, i, ev.target.value)}
									onBlur={() => handleBlur(p.id, i)}
									min="1"
								/>
							</td>
							<td>R$ {p.amount * p.product.price}</td>
						</tr>
					))}
				</tbody>
			</table>
			<button type="submit">Comprar</button>
		</>
	);
}
