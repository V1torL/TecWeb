"use client";

import { useState, useEffect, useMemo } from "react";
import AdminWrapper from "@/components/AdminWrapper";
import { getAllProducts } from "@/lib/actions/products";
import { getStockLogs } from "@/lib/actions/stock";
import type { Product, AddStock, Admin } from "@prisma/client";
import "./logs.css";

type StockLog = AddStock & {
    product: {
        id: string;
        name: string;
    };
    admin: Admin & {
        user: {
            email: string;
        };
    };
};

export default function StockLogsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [logs, setLogs] = useState<StockLog[]>([]);
    const [loading, setLoading] = useState(true);

    // Filters
    const [selectedProductId, setSelectedProductId] = useState<string>("");
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");

    useEffect(() => {
        async function fetchData() {
            try {
                const [productsData, logsData] = await Promise.all([
                    getAllProducts(),
                    getStockLogs()
                ]);
                setProducts(productsData);
                setLogs(logsData);
            } catch (error) {
                console.error("Erro ao carregar dados:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const filteredLogs = useMemo(() => {
        let filtered = logs;

        // Filter by product
        if (selectedProductId) {
            filtered = filtered.filter(log => log.product.id === selectedProductId);
        }

        // Filter by date range
        if (startDate) {
            const start = new Date(startDate);
            filtered = filtered.filter(log => new Date(log.createdAt) >= start);
        }
        if (endDate) {
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999); // Include the entire end date
            filtered = filtered.filter(log => new Date(log.createdAt) <= end);
        }

        return filtered;
    }, [logs, selectedProductId, startDate, endDate]);

    // Calculate running totals for each log entry
    const logsWithTotals = useMemo(() => {
        // Get initial stock for each product
        const productStocks = new Map<string, number>();
        products.forEach(p => productStocks.set(p.id, p.stock));

        // Calculate what the stock was before all logs
        const allLogsByProduct = new Map<string, StockLog[]>();
        logs.forEach(log => {
            if (!allLogsByProduct.has(log.product.id)) {
                allLogsByProduct.set(log.product.id, []);
            }
            allLogsByProduct.get(log.product.id)!.push(log);
        });

        // For each product, subtract all changes from current stock to get initial
        allLogsByProduct.forEach((productLogs, productId) => {
            const currentStock = productStocks.get(productId) || 0;
            const totalChanges = productLogs.reduce((sum, log) => sum + log.count, 0);
            const initialStock = currentStock - totalChanges;
            productStocks.set(productId, initialStock);
        });

        // Now calculate running total for filtered logs
        const runningTotals = new Map<string, number>();
        
        // Sort all logs by date to calculate proper running totals
        const sortedLogs = [...logs].sort((a, b) => 
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );

        // Calculate running totals up to each log
        const logTotals = new Map<string, number>();
        sortedLogs.forEach(log => {
            if (!runningTotals.has(log.product.id)) {
                runningTotals.set(log.product.id, productStocks.get(log.product.id) || 0);
            }
            const newTotal = runningTotals.get(log.product.id)! + log.count;
            runningTotals.set(log.product.id, newTotal);
            logTotals.set(log.id, newTotal);
        });

        return filteredLogs.map(log => ({
            ...log,
            totalAfter: logTotals.get(log.id) || 0
        }));
    }, [logs, filteredLogs, products]);

    const clearFilters = () => {
        setSelectedProductId("");
        setStartDate("");
        setEndDate("");
    };

    if (loading) return <AdminWrapper><p>Carregando...</p></AdminWrapper>;

    return (
        <AdminWrapper>
            <div className="page-container">
                <div className="page-header">
                    <h1 className="page-title">Logs de Estoque</h1>
                </div>

                <div className="logs-filters">
                    <div className="filter-group">
                        <label htmlFor="product-filter">Produto:</label>
                        <select
                            id="product-filter"
                            value={selectedProductId}
                            onChange={(e) => setSelectedProductId(e.target.value)}
                            className="filter-select"
                        >
                            <option value="">Todos os produtos</option>
                            {products.map((product) => (
                                <option key={product.id} value={product.id}>
                                    {product.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="filter-group">
                        <label htmlFor="start-date">Data Inicial:</label>
                        <input
                            id="start-date"
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="filter-input"
                        />
                    </div>

                    <div className="filter-group">
                        <label htmlFor="end-date">Data Final:</label>
                        <input
                            id="end-date"
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="filter-input"
                        />
                    </div>

                    <button onClick={clearFilters} className="clear-filters-btn">
                        Limpar Filtros
                    </button>
                </div>

                <div className="logs-summary">
                    <p>
                        Mostrando <strong>{filteredLogs.length}</strong> de <strong>{logs.length}</strong> registros
                    </p>
                </div>

                <div className="table-wrapper">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Data/Hora</th>
                                <th>Produto</th>
                                <th>Quantidade</th>
                                <th>Total</th>
                                <th>Administrador</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logsWithTotals.length === 0 ? (
                                <tr>
                                    <td colSpan={5} style={{ textAlign: "center" }}>
                                        Nenhum registro encontrado
                                    </td>
                                </tr>
                            ) : (
                                logsWithTotals.map((log) => (
                                    <tr key={log.id}>
                                        <td>
                                            {new Date(log.createdAt).toLocaleString("pt-BR", {
                                                day: "2-digit",
                                                month: "2-digit",
                                                year: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </td>
                                        <td>{log.product.name}</td>
                                        <td className={log.count >= 0 ? "positive" : "negative"}>
                                            {log.count >= 0 ? `+${log.count}` : log.count}
                                        </td>
                                        <td><strong>{log.totalAfter}</strong></td>
                                        <td>{log.admin.user.email}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminWrapper>
    );
}
