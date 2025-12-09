"use server";

import { redirect } from "next/navigation";
import prisma from "../prisma";
import { getUser } from "../auth";

interface AddressData {
  rua: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  numero: string;
  complemento?: string;
}

export async function createAddress(formData: AddressData) {
    const user = await getUser();
    if (!user || !user.client) {
        redirect("/login");
    }

    const address = await prisma.address.create({
        data: {
            clientId: user.client.id,
            rua: formData.rua,
            bairro: formData.bairro,
            cidade: formData.cidade,
            estado: formData.estado,
            cep: formData.cep,
            numero: formData.numero,
            complemento: formData.complemento || null,
        },
    });

    return { success: true, address };
}

export async function getAddresses() {
    const user = await getUser();
    if (!user || !user.client) {
        redirect("/login");
    }

    const addresses = await prisma.address.findMany({
        where: {
            clientId: user.client.id,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return addresses;
}