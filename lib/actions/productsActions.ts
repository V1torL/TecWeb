"use server";

import { createProduct, deleteProduct, updateProduct, addStock } from "./products";

interface ProductData {
  name: string;
  description?: string;
  price: number;
  stock: number;
}

export async function createProductAction(formData: FormData) {
  const name = String(formData.get("name") ?? "");
  const description = String(formData.get("description") ?? "");
  const price = Number(formData.get("price") ?? 0);
  const stock = Number(formData.get("stock") ?? 0);

  if (!name) throw new Error("O nome do produto é obrigatório");
  if (price <= 0) throw new Error("O preço deve ser maior que zero");
  if (stock < 0) throw new Error("O estoque não pode ser negativo");

  const productData: ProductData = { name, description, price, stock };
  await createProduct(productData);
}

export async function deleteProductAction(id: string) {
  if (!id) throw new Error("ID do produto é obrigatório");
  await deleteProduct(id);
}

export async function updateProductAction(
  id: string,
  data: { name: string; description?: string; price: number }
) {
  await updateProduct(id, data);
}

export async function addStockAction(productId: string, count: number) {
  await addStock(productId, count);
}