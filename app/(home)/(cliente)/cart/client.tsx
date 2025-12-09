"use client";

import QuantitySelector from "@/components/QuantitySelector";
import type { Cart, Product, ProductInCart } from "@prisma/client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { removeItemFromCart } from "@/lib/actions/cart";

export interface Props {
    cart: Cart;
    products: (ProductInCart & { product: Product })[];
}

export default function Client({ products: initialProducts }: Props) {
    const [products, setProducts] = useState(initialProducts);
    const router = useRouter();

    const cartTotal = products.reduce(
        (sum, p) => sum + p.amount * p.product.price,
        0
    );

    const handleContinue = () => {
        router.push("/checkout");
    };

    const handleRemove = async (id: string, index: number) => {
        await removeItemFromCart(id);

        setProducts((prev) => prev.filter((_, i) => i !== index));

        router.refresh();
    };

    return (
        <>
            <table>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Preço</th>
                        <th>Quantia</th>
                        <th>Total</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((p, i) => (
                        <tr key={p.id}>
                            <td>{p.product.name}</td>
                            <td>R$ {p.product.price.toFixed(2)}</td>
                            <td>
                                <QuantitySelector
                                    initialValue={initialProducts[i].amount}
                                    onChange={(val) =>
                                        setProducts((ps) => {
                                            const prods = ps.slice();
                                            prods[i].amount = val;
                                            return prods;
                                        })
                                    }
                                />
                            </td>
                            <td>R$ {(p.amount * p.product.price).toFixed(2)}</td>

                            <td>
                                <button
                                    type="button"
                                    className="remove-btn"
                                    onClick={() => handleRemove(p.id, i)}
                                >
                                    Remover
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="cart-summary">
                <strong data-cart-total>
                    Total: R$ {cartTotal.toFixed(2)}
                </strong>
            </div>

            <button
                type="button"
                onClick={handleContinue}
                className="continue-button"
            >
                Continuar para Finalizar Compra
            </button>
        </>
    );
}
