import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import CheckoutClient from "./client";
import "./checkout.css";

async function getCheckoutData() {
	const user = await getUser();
	if (!user || !user.client) {
		redirect("/login");
	}

	// Buscar carrinho ativo
	const cart = await prisma.cart.findFirst({
		where: {
			clientId: user.client.id,
			orderId: null,
		},
		include: {
			products: {
				include: {
					product: true,
				},
			},
		},
	});

	if (!cart || cart.products.length === 0) {
		redirect("/cart");
	}

	// Buscar endereços do cliente
	const addresses = await prisma.address.findMany({
		where: {
			clientId: user.client.id,
		},
		orderBy: {
			createdAt: "desc",
		},
	});

	return {
		cart,
		addresses,
		client: user.client,
	};
}

export default async function CheckoutPage() {
	const { cart, addresses, client } = await getCheckoutData();
	
	return (
		<div className="checkout-container">
			<h1>Finalizar Compra</h1>
			<CheckoutClient 
				cart={cart} 
				addresses={addresses} 
				client={client} 
			/>
		</div>
	);
}