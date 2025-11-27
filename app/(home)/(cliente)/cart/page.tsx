import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import "./cart.css";
import Client, { type Props } from "./client";

export async function getProps(): Promise<Props> {
	const user = await getUser();
	if (!user || !user.client) {
		redirect("/home");
	}
	var cart = await prisma.cart.findFirst({
		where: {
			clientId: user.client.id,
		},
		include: {
			products: true,
		},
	});
	if (!cart) {
		cart = await prisma.cart.create({
			data: {
				clientId: user.client.id,
			},
			include: {
				products: true,
			},
		});
	}
	const productsInCart = cart?.products || [];

	const products = (
		await Promise.all(
			productsInCart.map(async (p) => {
				const product = await prisma.product.findUnique({
					where: { id: p.productId },
				});
				const pic = { ...p, product };
				return pic;
			}) || [],
		)
	).filter((p) => p.product !== null) as Props["products"];
	return {
		cart,
		products,
	};
}

export default async function Cart() {
	const { cart, products } = await getProps();
	return (
		<form className="flex-list">
			{products.length === 0 ? (
				<p>Sem produtos ainda!</p>
			) : (
				<Client cart={cart} products={products} />
			)}
		</form>
	);
}
