"use server";

import { createProduct, deleteProduct, updateProduct, addStock } from "./products";

export async function createProductAction(formData: FormData) {
  const name = String(formData.get("name") ?? "");
  const description = String(formData.get("description") ?? "");
  const price = Number(formData.get("price") ?? 0);
  const stock = Number(formData.get("stock") ?? 0);
  const imageFile = formData.get("image") as File | null;

  if (!name) throw new Error("O nome do produto é obrigatório");
  if (price <= 0) throw new Error("O preço deve ser maior que zero");
  if (stock < 0) throw new Error("O estoque não pode ser negativo");

  await createProduct({ 
    name, 
    description, 
    price, 
    stock, 
    image: imageFile 
  });
}

export async function updateProductAction(
  id: string,
  formData: FormData
) {
  const name = String(formData.get("name") ?? "");
  const description = String(formData.get("description") ?? "");
  const price = Number(formData.get("price") ?? 0);
  const imageFile = formData.get("image") as File | null;
  const removeImage = formData.get("removeImage") === "true";

  if (!name) throw new Error("O nome do produto é obrigatório");
  if (price <= 0) throw new Error("O preço deve ser maior que zero");

  const imageValue = removeImage ? "" : (imageFile || undefined);

  await updateProduct(id, { 
    name, 
    description, 
    price, 
    image: imageValue 
  });
}

export async function deleteProductAction(id: string) {
  if (!id) throw new Error("ID do produto é obrigatório");
  await deleteProduct(id);
}

export async function addStockAction(productId: string, count: number) {
  await addStock(productId, count);
}
export async function updateProductImageAction(id: string, formData: FormData) {
  const imageFile = formData.get("image") as File | null;
  
  if (!imageFile || imageFile.size === 0) {
    throw new Error("Selecione uma imagem válida");
  }

  await updateProduct(id, { image: imageFile });
}