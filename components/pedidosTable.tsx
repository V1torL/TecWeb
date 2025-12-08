// components/admin/PedidosTable.tsx
"use client";

import { useState } from "react";
import { Order, Payment, Cart, ProductInCart, Product, Client, User } from "@prisma/client";
import { updateOrderStatus } from "@/lib/actions/orderActions";
import { CheckCircle, XCircle, Truck, Package, Clock } from "lucide-react";

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

interface PedidosTableProps {
  pedidos: OrderWithRelations[];
}

const statusOptions = [
  { value: "PENDENTE", label: "Pendente" },
  { value: "PROCESSANDO", label: "Processando" },
  { value: "ENVIADO", label: "Enviado" },
  { value: "ENTREGUE", label: "Entregue" },
  { value: "CANCELADO", label: "Cancelado" }
];

// Mapeamento de ícones separado
const statusIcons = {
  "PENDENTE": Clock,
  "PROCESSANDO": Package,
  "ENVIADO": Truck,
  "ENTREGUE": CheckCircle,
  "CANCELADO": XCircle
};

export default function PedidosTable({ pedidos }: PedidosTableProps) {
  const [orders, setOrders] = useState(pedidos);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const result = await updateOrderStatus(orderId, newStatus);
      
      if (result.success) {
        // Atualizar estado local
        setOrders(orders.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        ));
      }
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
    } finally {
      setUpdatingId(null);
    }
  };

  const calculateTotal = (cart: Cart & { products: (ProductInCart & { product: Product })[] }) => {
    return cart.products.reduce((total, item) => {
      return total + (item.product.price * item.amount);
    }, 0);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "PENDENTE": return "status-badge status-pendente";
      case "PROCESSANDO": return "status-badge status-processando";
      case "ENVIADO": return "status-badge status-enviado";
      case "ENTREGUE": return "status-badge status-entregue";
      case "CANCELADO": return "status-badge status-cancelado";
      default: return "status-badge";
    }
  };

  const getStatusIcon = (status: string) => {
    return statusIcons[status as keyof typeof statusIcons] || Clock;
  };

  return (
    <table className="pedidos-table">
      <thead className="pedidos-table-header">
        <tr>
          <th>ID do Pedido</th>
          <th>Cliente</th>
          <th>Data</th>
          <th>Total</th>
          <th>Status</th>
          <th>Pagamento</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order) => {
          const cart = order.carts[0];
          const total = cart ? calculateTotal(cart) : 0;
          const clientEmail = cart?.client?.user?.email;
          const StatusIcon = getStatusIcon(order.status);

          return (
            <tr key={order.id} className="pedidos-table-row">
              <td className="pedidos-table-cell">
                <span className="order-id">
                  #{order.id.substring(0, 8).toUpperCase()}
                </span>
              </td>
              <td className="pedidos-table-cell">
                {clientEmail || "N/A"}
              </td>
              <td className="pedidos-table-cell">
                {formatDate(order.created_at)}
              </td>
              <td className="pedidos-table-cell">
                <span className="order-total">
                  R$ {total.toFixed(2)}
                </span>
              </td>
              <td className="pedidos-table-cell">
                <div className={getStatusClass(order.status)}>
                  <StatusIcon className="w-3 h-3 mr-1" />
                  {order.status}
                </div>
              </td>
              <td className="pedidos-table-cell">
                {order.payment?.method || "N/A"}
              </td>
              <td className="pedidos-table-cell">
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
                  <span className="ml-2 text-xs text-blue-600">
                    Atualizando...
                  </span>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}