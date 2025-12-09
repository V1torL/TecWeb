"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import prisma from "../prisma";
import { getUser } from "../auth";

export async function completePurchase(formData: FormData) {
    const user = await getUser();
    if (!user || !user.client) {
        redirect("/login");
    }

    const cartId = formData.get("cartId") as string;
    const paymentMethod = formData.get("paymentMethod") as string;
    const manualAddress = formData.get("manualAddress") as string;
    const addressId = formData.get("addressId") as string;

    if (!cartId) {
        throw new Error("Cart ID is required");
    }

    // Get the current cart with products
    const cart = await prisma.cart.findUnique({
        where: { id: cartId },
        include: {
            products: {
                include: {
                    product: true,
                },
            },
        },
    });

    if (!cart || cart.clientId !== user.client.id) {
        throw new Error("Cart not found or access denied");
    }

    if (cart.products.length === 0) {
        throw new Error("Cannot purchase empty cart");
    }

    // Verificar estoque antes de processar
    for (const item of cart.products) {
        if (item.product.stock < item.amount) {
            throw new Error(`Produto ${item.product.name} não tem estoque suficiente`);
        }
    }

    // Calculate total
    const total = cart.products.reduce(
        (sum, item) => sum + item.amount * item.product.price,
        0
    );

    // Criar pagamento com endereço
    const paymentData: any = {
        method: paymentMethod,
        total_paid: total,
    };

    if (addressId) {
        paymentData.addressId = addressId;
    } else if (manualAddress) {
        paymentData.manualAddress = manualAddress;
    }

    const payment = await prisma.payment.create({
        data: paymentData,
    });

    // Create order
    const order = await prisma.order.create({
        data: {
            status: "PENDING",
            paymentId: payment.id,
        },
    });

    // Link cart to order (marks it as inactive)
    await prisma.cart.update({
        where: { id: cartId },
        data: {
            orderId: order.id,
        },
    });

    // Update product stock
    for (const item of cart.products) {
        await prisma.product.update({
            where: { id: item.productId },
            data: {
                stock: {
                    decrement: item.amount,
                },
            },
        });
    }

    // Create a new empty cart for the user
    await prisma.cart.create({
        data: {
            clientId: user.client.id,
        },
    });

    revalidatePath("/cart");
    redirect("/perfil");
}