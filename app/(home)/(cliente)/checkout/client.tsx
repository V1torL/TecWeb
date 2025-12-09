"use client";

import { useState } from "react";
import type { Cart, Client, ProductInCart, Product } from "@prisma/client";
import { completePurchase } from "@/lib/actions/checkout";
import { createAddress } from "@/lib/actions/address";

type Address = {
  id: string;
  clientId: string;
  rua: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  numero: string | null;
  complemento: string | null;
  createdAt: Date;
};

interface Props {
	cart: Cart & {
		products: (ProductInCart & {
			product: Product;
		})[];
	};
	addresses: Address[];
	client: Client;
}

interface NewAddressData {
  rua: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  numero: string;
  complemento: string;
}

export default function CheckoutClient({ cart, addresses, client }: Props) {
	const [selectedAddress, setSelectedAddress] = useState<string>("default");
	const [manualAddress, setManualAddress] = useState<string>(client.endereco);
	const [paymentMethod, setPaymentMethod] = useState<string>("credit_card");
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [newAddressData, setNewAddressData] = useState<NewAddressData>({
		rua: "",
		bairro: "",
		cidade: "",
		estado: "",
		cep: "",
		numero: "",
		complemento: "",
	});
	const [isSubmitting, setIsSubmitting] = useState(false);

	const cartTotal = cart.products.reduce(
		(sum, p) => sum + p.amount * p.product.price,
		0
	);

	const handleCheckoutSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		
		const formData = new FormData();
		formData.append("cartId", cart.id);
		formData.append("paymentMethod", paymentMethod);
		
		if (selectedAddress === "default") {
			// Usar endereço padrão do cliente
			formData.append("manualAddress", client.endereco);
		} else if (selectedAddress === "manual") {
			// Usar endereço manual digitado
			formData.append("manualAddress", manualAddress);
		} else {
			// Usar endereço salvo selecionado
			formData.append("addressId", selectedAddress);
		}

		await completePurchase(formData);
	};

	const handleNewAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setNewAddressData({
			...newAddressData,
			[name]: value,
		});
	};

	const handleSaveNewAddress = async () => {
		try {
			setIsSubmitting(true);
			
			// Validação simples
			if (!newAddressData.rua || !newAddressData.bairro || !newAddressData.cidade || 
				!newAddressData.estado || !newAddressData.cep || !newAddressData.numero) {
				alert("Preencha todos os campos obrigatórios!");
				setIsSubmitting(false);
				return;
			}

			// Usando a Server Action diretamente
			const result = await createAddress(newAddressData);
			
			if (result.success) {
				// Fechar modal, resetar dados e recarregar
				setIsModalOpen(false);
				setNewAddressData({
					rua: "",
					bairro: "",
					cidade: "",
					estado: "",
					cep: "",
					numero: "",
					complemento: "",
				});
				// Recarregar a página para mostrar o novo endereço
				window.location.reload();
			} else {
				alert("Erro ao salvar endereço. Tente novamente.");
			}
		} catch (error) {
			console.error("Erro ao criar endereço:", error);
			alert("Erro ao salvar endereço. Tente novamente.");
		} finally {
			setIsSubmitting(false);
		}
	};

	// Renderizar campo para editar endereço manualmente
	const renderManualAddressField = () => {
		if (selectedAddress === "manual") {
			return (
				<div className="manual-address">
					<textarea
						value={manualAddress}
						onChange={(e) => setManualAddress(e.target.value)}
						placeholder="Digite o endereço completo"
						rows={3}
						required
					/>
					<small className="manual-address-hint">
						Digite o endereço completo incluindo rua, número, bairro, cidade, estado e CEP
					</small>
				</div>
			);
		}
		return null;
	};

	return (
		<div className="checkout-wrapper">
			<form onSubmit={handleCheckoutSubmit} className="checkout-form">
				<section className="checkout-section">
					<h2>Resumo do Carrinho</h2>
					<div className="cart-summary">
						{cart.products.map((item) => (
							<div key={item.id} className="cart-item">
								<span>{item.product.name} x {item.amount}</span>
								<span>R$ {(item.amount * item.product.price).toFixed(2)}</span>
							</div>
						))}
						<div className="cart-total">
							<strong>Total: R$ {cartTotal.toFixed(2)}</strong>
						</div>
					</div>
				</section>

				<section className="checkout-section">
					<h2>Endereço de Entrega</h2>
					
					<div className="address-options">
						{/* Opção 1: Endereço padrão do cliente */}
						<label className="address-option">
							<input
								type="radio"
								name="address"
								value="default"
								checked={selectedAddress === "default"}
								onChange={(e) => setSelectedAddress(e.target.value)}
							/>
							<div className="address-info">
								<strong>Usar endereço cadastrado</strong>
								<span>{client.endereco}</span>
								<span>{client.cidade}</span>
							</div>
						</label>
						
						{/* Opção 2: Editar endereço manualmente */}
						<label className="address-option">
							<input
								type="radio"
								name="address"
								value="manual"
								checked={selectedAddress === "manual"}
								onChange={(e) => setSelectedAddress(e.target.value)}
							/>
							<div className="address-info">
								<strong>Editar endereço manualmente</strong>
								<span>Clique para digitar um endereço diferente</span>
							</div>
						</label>
						
						{renderManualAddressField()}

						{/* Opção 3: Endereços salvos */}
						{addresses.map((address) => (
							<label key={address.id} className="address-option">
								<input
									type="radio"
									name="address"
									value={address.id}
									checked={selectedAddress === address.id}
									onChange={(e) => setSelectedAddress(e.target.value)}
								/>
								<div className="address-info">
									<strong>Endereço salvo</strong>
									<span>{address.rua}, {address.numero || "S/N"}</span>
									<span>{address.bairro}, {address.cidade} - {address.estado}</span>
									<span>CEP: {address.cep}</span>
									{address.complemento && <span>Complemento: {address.complemento}</span>}
								</div>
							</label>
						))}
					</div>

					<button 
						type="button" 
						className="add-address-btn"
						onClick={() => setIsModalOpen(true)}
						disabled={isSubmitting}
					>
						+ Adicionar Novo Endereço Salvo
					</button>
				</section>

				<section className="checkout-section">
					<h2>Método de Pagamento</h2>
					<div className="payment-options">
						<label className="payment-option">
							<input
								type="radio"
								name="payment"
								value="credit_card"
								checked={paymentMethod === "credit_card"}
								onChange={(e) => setPaymentMethod(e.target.value)}
							/>
							<span>Cartão de Crédito</span>
						</label>
						
						<label className="payment-option">
							<input
								type="radio"
								name="payment"
								value="debit_card"
								checked={paymentMethod === "debit_card"}
								onChange={(e) => setPaymentMethod(e.target.value)}
							/>
							<span>Cartão de Débito</span>
						</label>
						
						<label className="payment-option">
							<input
								type="radio"
								name="payment"
								value="pix"
								checked={paymentMethod === "pix"}
								onChange={(e) => setPaymentMethod(e.target.value)}
							/>
							<span>PIX</span>
						</label>
						
						<label className="payment-option">
							<input
								type="radio"
								name="payment"
								value="boleto"
								checked={paymentMethod === "boleto"}
								onChange={(e) => setPaymentMethod(e.target.value)}
							/>
							<span>Boleto Bancário</span>
						</label>
					</div>
				</section>

				<div className="checkout-actions">
					<button type="submit" className="finish-purchase-btn">
						Finalizar Compra - R$ {cartTotal.toFixed(2)}
					</button>
				</div>
			</form>

			{isModalOpen && (
				<div className="modal-overlay" onClick={() => !isSubmitting && setIsModalOpen(false)}>
					<div className="modal-content" onClick={(e) => e.stopPropagation()}>
						<div className="modal-header">
							<h3>Adicionar Novo Endereço</h3>
							<button 
								onClick={() => setIsModalOpen(false)} 
								className="close-button"
								disabled={isSubmitting}
							>
								&times;
							</button>
						</div>
						
						<div className="address-form">
							<div className="form-group">
								<label>CEP *</label>
								<input
									type="text"
									name="cep"
									value={newAddressData.cep}
									onChange={handleNewAddressChange}
									required
									disabled={isSubmitting}
									placeholder="00000-000"
								/>
							</div>

							<div className="form-group">
								<label>Rua *</label>
								<input
									type="text"
									name="rua"
									value={newAddressData.rua}
									onChange={handleNewAddressChange}
									required
									disabled={isSubmitting}
									placeholder="Nome da rua"
								/>
							</div>

							<div className="form-row">
								<div className="form-group">
									<label>Número *</label>
									<input
										type="text"
										name="numero"
										value={newAddressData.numero}
										onChange={handleNewAddressChange}
										required
										disabled={isSubmitting}
										placeholder="123"
									/>
								</div>

								<div className="form-group">
									<label>Bairro *</label>
									<input
										type="text"
										name="bairro"
										value={newAddressData.bairro}
										onChange={handleNewAddressChange}
										required
										disabled={isSubmitting}
										placeholder="Nome do bairro"
									/>
								</div>
							</div>

							<div className="form-row">
								<div className="form-group">
									<label>Cidade *</label>
									<input
										type="text"
										name="cidade"
										value={newAddressData.cidade}
										onChange={handleNewAddressChange}
										required
										disabled={isSubmitting}
										placeholder="Nome da cidade"
									/>
								</div>

								<div className="form-group">
									<label>Estado *</label>
									<input
										type="text"
										name="estado"
										value={newAddressData.estado}
										onChange={handleNewAddressChange}
										required
										disabled={isSubmitting}
										placeholder="UF (ex: SP)"
									/>
								</div>
							</div>

							<div className="form-group">
								<label>Complemento</label>
								<input
									type="text"
									name="complemento"
									value={newAddressData.complemento}
									onChange={handleNewAddressChange}
									disabled={isSubmitting}
									placeholder="Apto, bloco, etc."
								/>
							</div>

							<div className="modal-actions">
								<button 
									type="button" 
									onClick={() => setIsModalOpen(false)} 
									className="cancel-btn"
									disabled={isSubmitting}
								>
									Cancelar
								</button>
								<button 
									type="button" 
									onClick={handleSaveNewAddress} 
									className="save-btn"
									disabled={isSubmitting}
								>
									{isSubmitting ? "Salvando..." : "Salvar Endereço"}
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}