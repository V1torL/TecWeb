"use client";

import QuantitySelector from "@/components/QuantitySelector";
import type { Cart, Product, ProductInCart } from "@prisma/client";
import { useState } from "react";
import { useFormStatus } from "react-dom";

export interface Props {
	cart: Cart;
	products: (ProductInCart & { product: Product })[];
}

function PurchaseButton() {
	const { pending } = useFormStatus();

	const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		if (!pending) {
			const total = document.querySelector('[data-cart-total]')?.textContent;
			const confirmed = confirm(`Confirma a compra de ${total}?`);
			if (!confirmed) {
				e.preventDefault();
			}
		}
	};

	return (
		<button type="submit" onClick={handleClick} disabled={pending}>
			{pending ? "Processando..." : "Comprar"}
		</button>
	);
}

export default function Client({ cart, products: initialProducts }: Props) {
	const [products, setProducts] = useState(initialProducts);

	const cartTotal = products.reduce(
		(sum, p) => sum + p.amount * p.product.price,
		0
	);

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
							<td>R$ {p.product.price.toFixed(2)}</td>
							<td>
								<QuantitySelector
									initialValue={initialProducts[i].amount}
									onChange={(val) =>
										setProducts((ps) => {
											const prods = ps.slice();
											prods[i].amount = val;
											return prods;
										})
									}
								/>
							</td>
							<td>R$ {(p.amount * p.product.price).toFixed(2)}</td>
						</tr>
					))}
				</tbody>
			</table>
			<div className="cart-summary">
				<strong data-cart-total>
					Total: R$ {cartTotal.toFixed(2)}
				</strong>
			</div>
			<PurchaseButton />
		</>
	);
}
