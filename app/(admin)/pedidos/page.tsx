// app/(admin)/pedidos/page.tsx
"use client";

import { useState, useEffect } from "react";
import { getAllOrders, updateOrderStatus, updateOrderArriveDate } from "@/lib/actions/orderActions";
import AdminWrapper from "@/components/AdminWrapper";
import type { Order, Payment, Cart, ProductInCart, Product, Client, User } from "@prisma/client";
import { Eye, Package, User as UserIcon, Calendar, DollarSign, CreditCard, Truck, Clock } from "lucide-react";
import "./pedidos.css";

type OrderWithRelations = Order & {
  carts: (Cart & {
    client: Client & {
      user: Pick<User, "email">;
    };
    products: (ProductInCart & {
      product: Product;
    })[];
  })[];
  payment: Payment | null;
};

const statusOptions = [
  { value: "PENDENTE", label: "Pendente" },
  { value: "PROCESSANDO", label: "Processando" },
  { value: "ENVIADO", label: "Enviado" },
  { value: "ENTREGUE", label: "Entregue" },
  { value: "CANCELADO", label: "Cancelado" }
];

export default function PedidosPage() {
  const [orders, setOrders] = useState<OrderWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<OrderWithRelations | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArriveDate, setEditingArriveDate] = useState(false);
  const [newArriveDate, setNewArriveDate] = useState("");

  useEffect(() => {
    async function fetchOrders() {
      try {
        const data = await getAllOrders();
        setOrders(data);
      } catch (error) {
        console.error("Erro ao carregar pedidos:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  async function handleStatusChange(orderId: string, newStatus: string) {
    setUpdatingId(orderId);
    try {
      const result = await updateOrderStatus(orderId, newStatus);
      if (result.success) {
        setOrders(prev =>
          prev.map(order =>
            order.id === orderId ? { ...order, status: newStatus } : order
          )
        );
        // Atualizar também no modal se estiver aberto
        if (selectedOrder?.id === orderId) {
          setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
        }
      }
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleArriveDateChange(orderId: string) {
    if (!newArriveDate) return;
    
    setUpdatingId(orderId);
    try {
      const result = await updateOrderArriveDate(orderId, newArriveDate);
      if (result.success) {
        setOrders(prev =>
          prev.map(order =>
            order.id === orderId ? { ...order, arrive_date: new Date(newArriveDate) } : order
          )
        );
        // Atualizar também no modal se estiver aberto
        if (selectedOrder?.id === orderId) {
          setSelectedOrder(prev => prev ? { ...prev, arrive_date: new Date(newArriveDate) } : null);
        }
        setEditingArriveDate(false);
        setNewArriveDate("");
      }
    } catch (error) {
      console.error("Erro ao atualizar data de entrega:", error);
    } finally {
      setUpdatingId(null);
    }
  }

  function openOrderDetails(order: OrderWithRelations) {
    setSelectedOrder(order);
    setIsModalOpen(true);
    setEditingArriveDate(false);
    setNewArriveDate("");
  }

  function closeModal() {
    setIsModalOpen(false);
    setSelectedOrder(null);
    setEditingArriveDate(false);
    setNewArriveDate("");
  }

  const calculateTotal = (cart: Cart & { products: (ProductInCart & { product: Product })[] }) => {
    return cart.products.reduce((total, item) => {
      return total + (item.product.price * item.amount);
    }, 0);
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "Não definida";
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDateInput = (date: Date | null) => {
    if (!date) return "";
    const d = new Date(date);
    const offset = d.getTimezoneOffset() * 60000; // offset in milliseconds
    const localDate = new Date(d.getTime() - offset);
    return localDate.toISOString().slice(0, 16);
  };

  if (loading) {
    return (
      <AdminWrapper>
        <div className="page-container">
          <div className="loading-spinner">
            Carregando pedidos...
          </div>
        </div>
      </AdminWrapper>
    );
  }

  return (
    <AdminWrapper>
      <div className="page-container">
        <h1 className="page-title">Gerenciamento de Pedidos</h1>
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Data do Pedido</th>
                <th>Data de Entrega</th>
                <th>Total</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="empty-cell">
                    Nenhum pedido encontrado
                  </td>
                </tr>
              ) : (
                orders.map((order) => {
                  const cart = order.carts[0];
                  const total = cart ? calculateTotal(cart) : 0;
                  const clientNome = cart?.client?.nome || "N/A";

                  return (
                    <tr key={order.id}>
                      <td className="order-id">
                        #{order.id.substring(0, 8).toUpperCase()}
                      </td>
                      <td>{clientNome}</td>
                      <td>
                        <div className="date-with-icon">
                          <Calendar size={14} />
                          {formatDate(order.created_at)}
                        </div>
                      </td>
                      <td>
                        {order.arrive_date ? (
                          <div className="date-with-icon">
                            <Truck size={14} />
                            {formatDate(order.arrive_date)}
                          </div>
                        ) : (
                          <div className="date-with-icon">
                            <Clock size={14} />
                            <span className="no-date">Não definida</span>
                          </div>
                        )}
                      </td>
                      <td className="order-total">
                        R$ {total.toFixed(2)}
                      </td>
                      <td>
                        <span className={`status-badge status-${order.status.toLowerCase()}`}>
                          {order.status}
                        </span>
                      </td>
                      <td>
                        <div className="actions-cell">
                          <button
                            onClick={() => openOrderDetails(order)}
                            className="view-details-btn"
                            title="Ver detalhes da compra"
                          >
                            <Eye size={16} />
                            <span>Detalhes</span>
                          </button>
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            disabled={updatingId === order.id}
                            className="status-select"
                          >
                            {statusOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                          {updatingId === order.id && (
                            <span className="updating-text">
                              Atualizando...
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && selectedOrder && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h2 className="modal-title">Detalhes do Pedido</h2>
              <button onClick={closeModal} className="modal-close-btn">
                &times;
              </button>
            </div>

            <div className="modal-content">
              <div className="order-info-section">
                <div className="info-grid">
                  <div className="info-item">
                    <div className="info-label">
                      <Package size={16} />
                      <span>ID do Pedido</span>
                    </div>
                    <div className="info-value">{selectedOrder.id}</div>
                  </div>

                  <div className="info-item">
                    <div className="info-label">
                      <Calendar size={16} />
                      <span>Data do Pedido</span>
                    </div>
                    <div className="info-value">{formatDate(selectedOrder.created_at)}</div>
                  </div>

                  <div className="info-item">
                    <div className="info-label">
                      <Truck size={16} />
                      <span>Data de Entrega</span>
                    </div>
                    <div className="info-value">
                      {editingArriveDate ? (
                        <div className="date-edit-container">
                          <input
                            type="datetime-local"
                            value={newArriveDate || formatDateInput(selectedOrder.arrive_date)}
                            onChange={(e) => setNewArriveDate(e.target.value)}
                            className="date-input"
                            min={formatDateInput(new Date())}
                          />
                          <div className="date-edit-buttons">
                            <button
                              onClick={() => handleArriveDateChange(selectedOrder.id)}
                              disabled={updatingId === selectedOrder.id}
                              className="date-save-btn"
                            >
                              {updatingId === selectedOrder.id ? "Salvando..." : "Salvar"}
                            </button>
                            <button
                              onClick={() => {
                                setEditingArriveDate(false);
                                setNewArriveDate("");
                              }}
                              className="date-cancel-btn"
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="date-display">
                          <span>{formatDate(selectedOrder.arrive_date)}</span>
                          <button
                            onClick={() => setEditingArriveDate(true)}
                            className="date-edit-btn"
                            title="Editar data de entrega"
                          >
                            Editar
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="info-item">
                    <div className="info-label">
                      <div className={`status-badge status-${selectedOrder.status.toLowerCase()}`}>
                        {selectedOrder.status}
                      </div>
                    </div>
                    <div className="info-value">
                      <select
                        value={selectedOrder.status}
                        onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value)}
                        disabled={updatingId === selectedOrder.id}
                        className="status-select"
                      >
                        {statusOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Resto do código permanece igual... */}
              {selectedOrder.carts[0]?.client && (
                <div className="customer-info-section">
                  <h3 className="section-title">
                    <UserIcon size={20} />
                    Informações do Cliente
                  </h3>
                  <div className="info-grid">
                    <div className="info-item">
                      <div className="info-label">Nome</div>
                      <div className="info-value">{selectedOrder.carts[0].client.nome}</div>
                    </div>
                    <div className="info-item">
                      <div className="info-label">Email</div>
                      <div className="info-value">{selectedOrder.carts[0].client.user?.email}</div>
                    </div>
                    <div className="info-item">
                      <div className="info-label">CPF</div>
                      <div className="info-value">{selectedOrder.carts[0].client.cpf}</div>
                    </div>
                    <div className="info-item">
                      <div className="info-label">Telefone</div>
                      <div className="info-value">{selectedOrder.carts[0].client.telefone}</div>
                    </div>
                    <div className="info-item">
                      <div className="info-label">Endereço</div>
                      <div className="info-value">{selectedOrder.carts[0].client.endereco}</div>
                    </div>
                    <div className="info-item">
                      <div className="info-label">Cidade</div>
                      <div className="info-value">{selectedOrder.carts[0].client.cidade}</div>
                    </div>
                  </div>
                </div>
              )}

              <div className="products-section">
                <h3 className="section-title">
                  <Package size={20} />
                  Produtos Comprados
                </h3>
                <div className="products-table-wrapper">
                  <table className="products-table">
                    <thead>
                      <tr>
                        <th>Produto</th>
                        <th>Quantidade</th>
                        <th>Preço Unitário</th>
                        <th>Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.carts[0]?.products.map((item) => (
                        <tr key={item.id}>
                          <td>{item.product.name}</td>
                          <td>{item.amount}</td>
                          <td>R$ {item.product.price.toFixed(2)}</td>
                          <td>R$ {(item.product.price * item.amount).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {selectedOrder.payment && (
                <div className="payment-info-section">
                  <h3 className="section-title">
                    <CreditCard size={20} />
                    Informações de Pagamento
                  </h3>
                  <div className="info-grid">
                    <div className="info-item">
                      <div className="info-label">Método</div>
                      <div className="info-value">{selectedOrder.payment.method}</div>
                    </div>
                    <div className="info-item">
                      <div className="info-label">Total Pago</div>
                      <div className="info-value">
                        <DollarSign size={16} />
                        R$ {selectedOrder.payment.total_paid.toFixed(2)}
                      </div>
                    </div>
                    <div className="info-item">
                      <div className="info-label">Endereço de Cobrança</div>
                      <div className="info-value">{selectedOrder.payment.address}</div>
                    </div>
                  </div>
                </div>
              )}

              <div className="order-summary">
                <h3 className="section-title">Resumo do Pedido</h3>
                <div className="summary-grid">
                  <div className="summary-item">
                    <span className="summary-label">Subtotal:</span>
                    <span className="summary-value">
                      R$ {calculateTotal(selectedOrder.carts[0]).toFixed(2)}
                    </span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Frete:</span>
                    <span className="summary-value">R$ 0.00</span>
                  </div>
                  <div className="summary-item total">
                    <span className="summary-label">Total:</span>
                    <span className="summary-value">
                      R$ {calculateTotal(selectedOrder.carts[0]).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button onClick={closeModal} className="modal-btn-close">
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminWrapper>
  );
}