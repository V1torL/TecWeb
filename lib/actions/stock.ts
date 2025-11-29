"use server";

import prisma from "@/lib/prisma";

export async function getStockLogs() {
    const logs = await prisma.addStock.findMany({
        include: {
            product: {
                select: {
                    id: true,
                    name: true,
                },
            },
            admin: {
                include: {
                    user: {
                        select: {
                            email: true,
                        },
                    },
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return logs;
}

export async function addStock(productId: string, count: number, adminId: string) {
    // Create stock log
    const stockLog = await prisma.addStock.create({
        data: {
            productId,
            count,
            adminId,
        },
    });

    // Update product stock
    await prisma.product.update({
        where: { id: productId },
        data: {
            stock: {
                increment: count,
            },
        },
    });

    return stockLog;
}
