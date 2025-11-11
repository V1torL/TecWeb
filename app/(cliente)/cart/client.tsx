"use client";

import type { Cart, Product, ProductInCart } from "@prisma/client";
import { useState } from "react";

export interface Props {
	cart: Cart;
	products: (ProductInCart & { product: Product })[];
}

export default function Client({ cart, products: initialProducts }: Props) {
	const [products, setProducts] = useState(initialProducts);
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
									value={p.amount}
									onInput={(ev) => {
										var val = parseFloat(ev.currentTarget.value);
										if (Number.isNaN(val)) val = 0;
										setProducts((products) => {
											products = products.slice(0, -1);
											p.amount = val;
											products[i] = p;
											return products;
										});
									}}
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
