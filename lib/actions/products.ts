"use server";

import prisma from "../prisma";
import { revalidatePath } from "next/cache";
import { auth, getUser } from "../auth";
import { writeFile } from "fs/promises";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";

interface CreateProductData {
  name: string;
  description?: string;
  price: number;
  stock: number;
  image?: File | string | null;
}

interface UpdateProductData {
  name?: string;
  description?: string;
  price?: number;
  image?: File | string | null;
}

export async function createProduct(data: CreateProductData) {
  const session = await auth();
  const user = session?.user as
    | { id: string; tipo: "ADMIN" | "CLIENT" }
    | undefined;

  if (!user || user.tipo !== "ADMIN") throw new Error("Acesso negado");

  let imageUrl: string | null = null;

  if (data.image instanceof File && data.image.size > 0) {
    const bytes = await data.image.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uniqueFileName = `${uuidv4()}-${data.image.name.replace(/\s+/g, '-')}`;
    const publicDir = join(process.cwd(), "public", "uploads", "products");
    
    await writeFile(join(publicDir, uniqueFileName), buffer);

    imageUrl = `/uploads/products/${uniqueFileName}`;
  } else if (typeof data.image === 'string' && data.image.trim() !== '') {
    imageUrl = data.image;
  }

  const productData: {
    name: string;
    description?: string;
    price: number;
    stock: number;
    image?: string | null;
  } = {
    name: data.name,
    description: data.description,
    price: data.price,
    stock: data.stock ?? 0,
  };

  if (imageUrl) {
    productData.image = imageUrl;
  }

  await prisma.product.create({
    data: productData,
  });

  revalidatePath("/admin/dashboard/products");
}

export async function getAllProducts(name: string | undefined = undefined) {
  return await prisma.product.findMany({
    where: { name: { contains: name || "" } },
    orderBy: { createdAt: "desc" },
  });
}

export async function getProductById(id: string) {
  return await prisma.product.findUnique({
    where: { id },
  });
}

export async function updateProduct(id: string, data: UpdateProductData) {
  const session = await auth();
  const user = session?.user as
    | { id: string; tipo: "ADMIN" | "CLIENT" }
    | undefined;

  if (!user || user.tipo !== "ADMIN") throw new Error("Acesso negado");

  let imageUrl: string | undefined | null = undefined;

  if (data.image instanceof File && data.image.size > 0) {
    const bytes = await data.image.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uniqueFileName = `${uuidv4()}-${data.image.name.replace(/\s+/g, '-')}`;
    const publicDir = join(process.cwd(), "public", "uploads", "products");
    
    await writeFile(join(publicDir, uniqueFileName), buffer);

    imageUrl = `/uploads/products/${uniqueFileName}`;
  } else if (typeof data.image === 'string') {
    if (data.image.trim() === '') {
      imageUrl = null;
    } else {
      imageUrl = data.image;
    }
  }

  const updateData: {
    name?: string;
    description?: string;
    price?: number;
    image?: string | null;
  } = {};

  if (data.name !== undefined) updateData.name = data.name;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.price !== undefined) updateData.price = data.price;
  
  if (imageUrl !== undefined) {
    updateData.image = imageUrl;
  }

  await prisma.product.update({
    where: { id },
    data: updateData,
  });

  revalidatePath("/admin/dashboard/products");
}

export async function deleteProduct(id: string) {
  const session = await auth();
  const user = session?.user as
    | { id: string; tipo: "ADMIN" | "CLIENT" }
    | undefined;

  if (!user || user.tipo !== "ADMIN") throw new Error("Acesso negado");

  await prisma.product.delete({ where: { id } });

  revalidatePath("/admin/dashboard/products");
}

export async function addToCart(productId: string, amount: number) {
  const user = await getUser();
  if (!user || !user.client) {
    console.log("Usuário não logado");
    return;
  }
  
  let currentCart = await prisma.cart.findFirst({
    where: {
      clientId: user.client.id,
      orderId: null,
    },
  });
  
  if (!currentCart) {
    currentCart = await prisma.cart.create({
      data: {
        clientId: user.client.id,
      },
    });
  }
  
  await prisma.productInCart.create({
    data: {
      amount,
      cartId: currentCart.id,
      productId,
    },
  });
}

export async function addStock(productId: string, count: number) {
  const session = await auth();
  const user = session?.user as
    | { id: string; tipo: "ADMIN" | "CLIENT" }
    | undefined;

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