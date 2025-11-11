import { getUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Product } from "@prisma/client";
import { redirect } from "next/navigation";
import "./cart.css";
import { Button } from "@/lib/elements";

export default async function Cart() {
	const user = await getUser();
	if (!user || !user.client) {
		redirect("/home");
	}
	const cart = await prisma.cart.findFirst({
		where: {
			clientId: user.client.id,
		},
		include: {
			products: true,
		},
	});
	console.log(cart);
	const productsInCart = cart?.products || [];

	const products: [number, Product][] = (
		await Promise.all(
			productsInCart.map(async (p, i) => {
				const product = await prisma.product.findUnique({
					where: { id: p.productId },
				});
				return [i, product];
			}) || [],
		)
	).filter(([_, p]) => p !== null);

	return (
		<div className="flex-list">
			{products.length === 0 ? (
				<p>Sem produtos ainda!</p>
			) : (
				<>
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
							{products.map(([pid, p]) => (
								<tr key={pid}>
									<td>{p.name}</td>
									<td>R$ {p.price}</td>
									<td>{productsInCart[pid].amount}</td>
									<td>R$ {productsInCart[pid].amount * p.price}</td>
								</tr>
							))}
						</tbody>
					</table>
					<button type="button">Comprar</button>
				</>
			)}
		</div>
	);
}
