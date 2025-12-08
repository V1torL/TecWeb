"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getAllOrders() {
  try {
    const pedidos = await prisma.order.findMany({
      include: {
        carts: {
          include: {
            client: {
              include: {
                user: {
                  select: { email: true }
                }
              }
            },
            products: {
              include: {
                product: true
              }
            }
          }
        },
        payment: true
      },
      orderBy: {
        created_at: 'desc'
      }
    });

    return pedidos;
  } catch (error) {
    console.error("Erro ao buscar pedidos:", error);
    throw new Error("Erro ao buscar pedidos");
  }
}

export async function updateOrderStatus(orderId: string, status: string) {
  try {
    console.log("Atualizando status do pedido:", orderId, "para:", status);
    
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { 
        status,
        ...(status === "ENTREGUE" && { arrive_date: new Date() })
      }
    });

    revalidatePath("/admin/pedidos");

    return { success: true, order: updatedOrder };
  } catch (error) {
    console.error("Erro ao atualizar status do pedido:", error);
    throw new Error("Erro ao atualizar status do pedido");
  }
}