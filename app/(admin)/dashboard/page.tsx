"use client";

import { useState, useEffect } from "react";
import AdminWrapper from "@/components/AdminWrapper";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Package, 
  DollarSign, 
  ShoppingCart,
  Download,
  Calendar,
  Filter,
  Activity,
  ArrowUp,
  ArrowDown
} from "lucide-react";
import { 
  getDashboardMetrics,
  getSalesReport,
  getProductsReport,
  getUsersReport,
  exportReportToCSV 
} from "@/lib/actions/dashboardActions";
import "./dashboard.css";

interface DashboardMetrics {
  totalSales: number;
  totalRevenue: number;
  totalProducts: number;
  totalUsers: number;
  recentOrders: number;
  conversionRate: number;
  monthlyGrowth: number;
  topProducts: Array<{
    id: string;
    name: string;
    sales: number;
    revenue: number;
  }>;
}

interface SalesData {
  date: string;
  sales: number;
  revenue: number;
}

interface ProductReport {
  productId: string;
  productName: string;
  stock: number;
  salesCount: number;
  revenue: number;
  stockAlert: boolean;
}

interface UserReport {
  userId: string;
  email: string;
  ordersCount: number;
  totalSpent: number;
  lastOrderDate: string;
}

interface DateRange {
  start: Date;
  end: Date;
}

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [productsReport, setProductsReport] = useState<ProductReport[]>([]);
  const [usersReport, setUsersReport] = useState<UserReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<DateRange>({
    start: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    end: new Date()
  });
  const [activeReport, setActiveReport] = useState<string>("sales");

  useEffect(() => {
    async function loadDashboardData() {
      setLoading(true);
      try {
        // Carregar todos os relatórios em paralelo
        const [
          metricsData,
          salesReport,
          productsReportData,
          usersReportData
        ] = await Promise.all([
          getDashboardMetrics(dateRange),
          getSalesReport(dateRange),
          getProductsReport(dateRange),
          getUsersReport(dateRange)
        ]);

        setMetrics(metricsData);
        setSalesData(salesReport);
        setProductsReport(productsReportData);
        setUsersReport(usersReportData);
      } catch (error) {
        console.error("Erro ao carregar dados do dashboard:", error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, [dateRange]);

  async function handleExportReport(type: string) {
    try {
      const data = await exportReportToCSV(type, dateRange);
      const blob = new Blob([data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${type}_report_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erro ao exportar relatório:", error);
      alert("Erro ao exportar relatório");
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  const formatDateInput = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const handleDateChange = (type: 'start' | 'end', value: string) => {
    const newDate = new Date(value);
    setDateRange(prev => ({
      ...prev,
      [type]: newDate
    }));
  };

  if (loading) {
    return (
      <AdminWrapper>
        <div className="dashboard-container">
          <div className="card loading-card">
            <div className="loading-spinner">Carregando dados...</div>
          </div>
        </div>
      </AdminWrapper>
    );
  }

  return (
    <AdminWrapper>
      <div className="dashboard-container">
        {/* Cabeçalho */}
        <div className="dashboard-header">
          <div>
            <h1 className="page-title">Dashboard Admin</h1>
            <p className="dashboard-subtitle">Relatórios e Estatísticas em Tempo Real</p>
          </div>
          <div className="date-range-selector">
            <Calendar size={20} />
            <input
              type="date"
              value={formatDateInput(dateRange.start)}
              onChange={(e) => handleDateChange('start', e.target.value)}
            />
            <span>até</span>
            <input
              type="date"
              value={formatDateInput(dateRange.end)}
              onChange={(e) => handleDateChange('end', e.target.value)}
            />
            <button 
              className="filter-btn"
              onClick={() => {
                // Forçar recarregamento dos dados
                setLoading(true);
                setTimeout(() => {
                  window.location.reload();
                }, 100);
              }}
            >
              <Filter size={16} />
              Aplicar
            </button>
          </div>
        </div>

        {/* Métricas Principais */}
        <div className="metrics-grid">
          <div className="metric-card revenue">
            <div className="metric-icon">
              <DollarSign size={24} />
            </div>
            <div className="metric-content">
              <h3>Receita Total</h3>
              <p className="metric-value">
                {formatCurrency(metrics?.totalRevenue || 0)}
              </p>
              <div className="metric-trend">
                {metrics?.monthlyGrowth && metrics.monthlyGrowth > 0 ? (
                  <>
                    <ArrowUp size={16} />
                    <span className="trend-up">{metrics.monthlyGrowth}%</span>
                  </>
                ) : (
                  <>
                    <ArrowDown size={16} />
                    <span className="trend-down">{Math.abs(metrics?.monthlyGrowth || 0)}%</span>
                  </>
                )}
                <span> vs último mês</span>
              </div>
            </div>
          </div>

          <div className="metric-card sales">
            <div className="metric-icon">
              <ShoppingCart size={24} />
            </div>
            <div className="metric-content">
              <h3>Total de Vendas</h3>
              <p className="metric-value">{metrics?.totalSales || 0}</p>
              <div className="metric-trend">
                <Activity size={16} />
                <span>{metrics?.recentOrders || 0} pedidos recentes</span>
              </div>
            </div>
          </div>

          <div className="metric-card products">
            <div className="metric-icon">
              <Package size={24} />
            </div>
            <div className="metric-content">
              <h3>Produtos Ativos</h3>
              <p className="metric-value">{metrics?.totalProducts || 0}</p>
              <div className="metric-trend">
                <TrendingUp size={16} />
                <span>Total em estoque</span>
              </div>
            </div>
          </div>

          <div className="metric-card users">
            <div className="metric-icon">
              <Users size={24} />
            </div>
            <div className="metric-content">
              <h3>Usuários Cadastrados</h3>
              <p className="metric-value">{metrics?.totalUsers || 0}</p>
              <div className="metric-trend">
                <span>Taxa de conversão: {metrics?.conversionRate || 0}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Seção de Relatórios */}
        <div className="reports-section">
          <div className="reports-header">
            <h2>Relatórios Detalhados</h2>
            <div className="report-tabs">
              <button
                className={`tab-btn ${activeReport === "sales" ? "active" : ""}`}
                onClick={() => setActiveReport("sales")}
              >
                <BarChart3 size={18} />
                Vendas
              </button>
              <button
                className={`tab-btn ${activeReport === "products" ? "active" : ""}`}
                onClick={() => setActiveReport("products")}
              >
                <Package size={18} />
                Produtos
              </button>
              <button
                className={`tab-btn ${activeReport === "users" ? "active" : ""}`}
                onClick={() => setActiveReport("users")}
              >
                <Users size={18} />
                Usuários
              </button>
              <button
                className="export-btn"
                onClick={() => handleExportReport(activeReport)}
              >
                <Download size={18} />
                Exportar CSV
              </button>
            </div>
          </div>

          {/* Relatório de Vendas */}
          {activeReport === "sales" && (
            <div className="report-card">
              <h3>Relatório de Vendas por Período</h3>
              <div className="sales-chart">
                {salesData.length > 0 ? (
                  <div className="chart-container">
                    <div className="chart-bars">
                      {salesData.map((item, index) => {
                        const maxRevenue = Math.max(...salesData.map(d => d.revenue));
                        const height = maxRevenue > 0 ? (item.revenue / maxRevenue) * 150 : 0;
                        
                        return (
                          <div key={index} className="chart-bar-group">
                            <div className="chart-bar-label">{item.date}</div>
                            <div 
                              className="chart-bar" 
                              style={{ height: `${height}px` }}
                              title={`R$ ${item.revenue.toFixed(2)}`}
                            >
                              <div className="bar-tooltip">
                                <div>Data: {item.date}</div>
                                <div>Vendas: {item.sales}</div>
                                <div>Receita: {formatCurrency(item.revenue)}</div>
                              </div>
                            </div>
                            <div className="chart-bar-value">
                              {formatCurrency(item.revenue)}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="no-data">Sem dados de vendas para o período selecionado</div>
                )}
              </div>
              <div className="sales-summary">
                <div className="summary-item">
                  <span>Total de Vendas:</span>
                  <span>{salesData.reduce((sum, item) => sum + item.sales, 0)}</span>
                </div>
                <div className="summary-item">
                  <span>Receita Total:</span>
                  <span>{formatCurrency(salesData.reduce((sum, item) => sum + item.revenue, 0))}</span>
                </div>
                <div className="summary-item">
                  <span>Média por Venda:</span>
                  <span>{formatCurrency(
                    salesData.reduce((sum, item) => sum + item.revenue, 0) / 
                    (salesData.reduce((sum, item) => sum + item.sales, 0) || 1)
                  )}</span>
                </div>
              </div>
            </div>
          )}

          {/* Relatório de Produtos */}
          {activeReport === "products" && (
            <div className="report-card">
              <h3>Relatório de Produtos</h3>
              <div className="products-table-container">
                <table className="report-table">
                  <thead>
                    <tr>
                      <th>Produto</th>
                      <th>Estoque</th>
                      <th>Vendas</th>
                      <th>Receita</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productsReport.map((product) => (
                      <tr key={product.productId}>
                        <td>
                          <div className="product-info">
                            <span className="product-name">{product.productName}</span>
                          </div>
                        </td>
                        <td>
                          <span className={`stock-badge ${product.stockAlert ? 'low' : 'normal'}`}>
                            {product.stock}
                          </span>
                        </td>
                        <td>{product.salesCount}</td>
                        <td>{formatCurrency(product.revenue)}</td>
                        <td>
                          {product.stockAlert ? (
                            <span className="status-badge alert">Baixo Estoque</span>
                          ) : (
                            <span className="status-badge ok">Normal</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="products-summary">
                <div className="summary-item">
                  <span>Produtos com Baixo Estoque:</span>
                  <span>{productsReport.filter(p => p.stockAlert).length}</span>
                </div>
                <div className="summary-item">
                  <span>Produto Mais Vendido:</span>
                  <span>
                    {productsReport.length > 0 
                      ? productsReport.reduce((prev, current) => 
                          (prev.salesCount > current.salesCount ? prev : current)
                        ).productName
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Relatório de Usuários */}
          {activeReport === "users" && (
            <div className="report-card">
              <h3>Relatório de Usuários</h3>
              <div className="users-table-container">
                <table className="report-table">
                  <thead>
                    <tr>
                      <th>Email</th>
                      <th>Pedidos</th>
                      <th>Total Gasto</th>
                      <th>Última Compra</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersReport.map((user) => (
                      <tr key={user.userId}>
                        <td>{user.email}</td>
                        <td>{user.ordersCount}</td>
                        <td>{formatCurrency(user.totalSpent)}</td>
                        <td>{formatDate(new Date(user.lastOrderDate))}</td>
                        <td>
                          {user.ordersCount > 0 ? (
                            <span className="status-badge active">Ativo</span>
                          ) : (
                            <span className="status-badge inactive">Inativo</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="users-summary">
                <div className="summary-item">
                  <span>Total de Clientes:</span>
                  <span>{usersReport.length}</span>
                </div>
                <div className="summary-item">
                  <span>Cliente Top:</span>
                  <span>
                    {usersReport.length > 0 
                      ? usersReport.reduce((prev, current) => 
                          (prev.totalSpent > current.totalSpent ? prev : current)
                        ).email
                      : "N/A"}
                  </span>
                </div>
                <div className="summary-item">
                  <span>Ticket Médio:</span>
                  <span>
                    {formatCurrency(
                      usersReport.reduce((sum, user) => sum + user.totalSpent, 0) / 
                      (usersReport.filter(u => u.ordersCount > 0).length || 1)
                    )}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Top Produtos */}
        {metrics?.topProducts && metrics.topProducts.length > 0 && (
          <div className="top-products-section">
            <h2>Produtos Mais Vendidos</h2>
            <div className="top-products-grid">
              {metrics.topProducts.slice(0, 4).map((product, index) => (
                <div key={product.id} className="top-product-card">
                  <div className="product-rank">{index + 1}</div>
                  <div className="product-info">
                    <h4>{product.name}</h4>
                    <div className="product-stats">
                      <span>{product.sales} vendas</span>
                      <span className="revenue">{formatCurrency(product.revenue)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AdminWrapper>
  );
}