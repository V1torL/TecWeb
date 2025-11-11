"use server";

import prisma from "../prisma";
import { revalidatePath } from "next/cache";
import { auth } from "../auth";

export async function createProduct(data: {
  name: string;
  description?: string;
  price: number;
  stock: number;
}) {
  const session = await auth();
  const user = session?.user as { id: string; tipo: "ADMIN" | "CLIENT" } | undefined;

  if (!user || user.tipo !== "ADMIN") throw new Error("Acesso negado");

  await prisma.product.create({
    data: {
      name: data.name,
      description: data.description,
      price: data.price,
      stock: data.stock ?? 0,
    },
  });

  revalidatePath("/admin/dashboard/products");
}

export async function getAllProducts() {
  return await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function getProductById(id: string) {
  return await prisma.product.findUnique({
    where: { id },
  });
}

export async function updateProduct(
  id: string,
  data: Partial<{ name: string; description: string; price: number }>
) {
  const session = await auth();
  const user = session?.user as { id: string; tipo: "ADMIN" | "CLIENT" } | undefined;

  if (!user || user.tipo !== "ADMIN") throw new Error("Acesso negado");

  await prisma.product.update({
    where: { id },
    data,
  });

  revalidatePath("/admin/dashboard/products");
}

export async function deleteProduct(id: string) {
  const session = await auth();
  const user = session?.user as { id: string; tipo: "ADMIN" | "CLIENT" } | undefined;

  if (!user || user.tipo !== "ADMIN") throw new Error("Acesso negado");

  await prisma.product.delete({ where: { id } });

  revalidatePath("/admin/dashboard/products");
}

export async function addStock(productId: string, count: number) {
  const session = await auth();
  const user = session?.user as { id: string; tipo: "ADMIN" | "CLIENT" } | undefined;

  if (!user || user.tipo !== "ADMIN") throw new Error("Acesso negado");

  const admin = await prisma.admin.findUnique({
    where: { userId: user.id },
  });

  if (!admin) throw new Error("Administrador não encontrado");

  await prisma.$transaction([
    prisma.addStock.create({
      data: {
        count,
        productId,
        adminId: admin.id,
      },
    }),
    prisma.product.update({
      where: { id: productId },
      data: { stock: { increment: count } },
    }),
  ]);

  revalidatePath("/admin/estoque");
}
