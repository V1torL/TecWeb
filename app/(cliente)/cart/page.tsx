import { getUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Product } from "@prisma/client";
import { redirect } from "next/navigation";
import "./cart.css";
import { Button } from "@/lib/elements";
import Client, { Props } from "./client";

async function formSubmit(data: FormData) {
	const obj = Object.fromEntries(data);
	const cartId = obj.cartId as string;
}

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
	if (!cart) {
		throw "No cart";
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
