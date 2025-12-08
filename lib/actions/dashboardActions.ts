"use server";

import prisma from "@/lib/prisma";

interface DateRange {
  start: Date;
  end: Date;
}

function formatDate(date: Date): string {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  return `${day}/${month}`;
}

function subDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() - days);
  return result;
}

function subMonths(date: Date, months: number): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() - months);
  return result;
}

export async function getDashboardMetrics(dateRange: DateRange) {
  try {
    const totalSales = await prisma.order.count({
      where: {
        created_at: {
          gte: dateRange.start,
          lte: dateRange.end
        }
      }
    });

    const orders = await prisma.order.findMany({
      where: {
        created_at: {
          gte: dateRange.start,
          lte: dateRange.end
        }
      },
      include: {
        carts: {
          include: {
            products: {
              include: {
                product: true
              }
            }
          }
        }
      }
    });

    let totalRevenue = 0;
    orders.forEach(order => {
      order.carts.forEach(cart => {
        cart.products.forEach(item => {
          totalRevenue += item.product.price * item.amount;
        });
      });
    });

    const totalProducts = await prisma.product.count();

    const totalUsers = await prisma.user.count({
      where: {
        tipo: "CLIENT"
      }
    });

    const recentOrdersDate = subDays(new Date(), 7);
    const recentOrders = await prisma.order.count({
      where: {
        created_at: {
          gte: recentOrdersDate,
          lte: new Date()
        }
      }
    });

    const usersWithOrders = await prisma.client.count({
      where: {
        carts: {
          some: {
            orderId: {
              not: null
            }
          }
        }
      }
    });

    const conversionRate = totalUsers > 0 
      ? Math.round((usersWithOrders / totalUsers) * 100)
      : 0;

    const lastMonthStart = subMonths(dateRange.start, 1);
    const lastMonthEnd = subMonths(dateRange.end, 1);

    const lastMonthOrders = await prisma.order.findMany({
      where: {
        created_at: {
          gte: lastMonthStart,
          lte: lastMonthEnd
        }
      },
      include: {
        carts: {
          include: {
            products: {
              include: {
                product: true
              }
            }
          }
        }
      }
    });

    let lastMonthRevenue = 0;
    lastMonthOrders.forEach(order => {
      order.carts.forEach(cart => {
        cart.products.forEach(item => {
          lastMonthRevenue += item.product.price * item.amount;
        });
      });
    });

    const monthlyGrowth = lastMonthRevenue > 0
      ? Math.round(((totalRevenue - lastMonthRevenue) / lastMonthRevenue) * 100)
      : totalRevenue > 0 ? 100 : 0;

    const topProducts = await prisma.product.findMany({
      include: {
        productsInCarts: {
          include: {
            cart: {
              include: {
                order: {
                  where: {
                    created_at: {
                      gte: dateRange.start,
                      lte: dateRange.end
                    }
                  }
                }
              }
            }
          }
        }
      },
      take: 5
    });

    const formattedTopProducts = topProducts.map(product => {
      const sales = product.productsInCarts
        .filter(pic => pic.cart.order !== null)
        .reduce((sum, pic) => sum + pic.amount, 0);

      const revenue = product.productsInCarts
        .filter(pic => pic.cart.order !== null)
        .reduce((sum, pic) => sum + (product.price * pic.amount), 0);

      return {
        id: product.id,
        name: product.name,
        sales,
        revenue
      };
    }).filter(p => p.sales > 0)
      .sort((a, b) => b.sales - a.sales);

    return {
      totalSales,
      totalRevenue,
      totalProducts,
      totalUsers,
      recentOrders,
      conversionRate,
      monthlyGrowth,
      topProducts: formattedTopProducts
    };
  } catch (error) {
    console.error("Erro ao buscar métricas do dashboard:", error);
    throw new Error("Erro ao carregar métricas");
  }
}

export async function getSalesReport(dateRange: DateRange) {
  try {
    const orders = await prisma.order.findMany({
      where: {
        created_at: {
          gte: dateRange.start,
          lte: dateRange.end
        }
      },
      include: {
        carts: {
          include: {
            products: {
              include: {
                product: true
              }
            }
          }
        }
      },
      orderBy: {
        created_at: 'asc'
      }
    });

    const salesByDate = new Map<string, { sales: number, revenue: number }>();

    orders.forEach(order => {
      const date = formatDate(new Date(order.created_at));
      
      if (!salesByDate.has(date)) {
        salesByDate.set(date, { sales: 0, revenue: 0 });
      }
      
      const dateData = salesByDate.get(date)!;
      dateData.sales += 1;
      
      order.carts.forEach(cart => {
        cart.products.forEach(item => {
          dateData.revenue += item.product.price * item.amount;
        });
      });
    });

    const salesData = Array.from(salesByDate.entries())
      .map(([date, data]) => ({
        date,
        sales: data.sales,
        revenue: data.revenue
      }))
      .sort((a, b) => {
        const [dayA, monthA] = a.date.split('/').map(Number);
        const [dayB, monthB] = b.date.split('/').map(Number);
        
        if (monthA !== monthB) {
          return monthA - monthB;
        }
        return dayA - dayB;
      });

    return salesData;
  } catch (error) {
    console.error("Erro ao buscar relatório de vendas:", error);
    throw new Error("Erro ao carregar relatório de vendas");
  }
}

export async function getProductsReport(dateRange: DateRange) {
  try {
    const products = await prisma.product.findMany({
      include: {
        productsInCarts: {
          include: {
            cart: {
              include: {
                order: {
                  where: {
                    created_at: {
                      gte: dateRange.start,
                      lte: dateRange.end
                    }
                  }
                }
              }
            }
          }
        }
      }
    });

    const productsReport = products.map(product => {
      const salesCount = product.productsInCarts
        .filter(pic => pic.cart.order !== null)
        .reduce((sum, pic) => sum + pic.amount, 0);

      const revenue = product.productsInCarts
        .filter(pic => pic.cart.order !== null)
        .reduce((sum, pic) => sum + (product.price * pic.amount), 0);

      return {
        productId: product.id,
        productName: product.name,
        stock: product.stock,
        salesCount,
        revenue,
        stockAlert: product.stock < 10
      };
    }).sort((a, b) => b.salesCount - a.salesCount);

    return productsReport;
  } catch (error) {
    console.error("Erro ao buscar relatório de produtos:", error);
    throw new Error("Erro ao carregar relatório de produtos");
  }
}

export async function getUsersReport(dateRange: DateRange) {
  try {
    const clients = await prisma.client.findMany({
      include: {
        user: {
          select: {
            email: true
          }
        },
        carts: {
          include: {
            order: {
              where: {
                created_at: {
                  gte: dateRange.start,
                  lte: dateRange.end
                }
              }
            },
            products: {
              include: {
                product: true
              }
            }
          }
        }
      }
    });

    const usersReport = clients.map(client => {
      const orders = client.carts.filter(cart => cart.order !== null);
      const ordersCount = orders.length;
      
      let totalSpent = 0;
      let lastOrderDate = "";
      
      orders.forEach(cart => {
        cart.products.forEach(item => {
          totalSpent += item.product.price * item.amount;
        });
        
        if (cart.order) {
          const orderDate = new Date(cart.order.created_at);
          if (!lastOrderDate || orderDate > new Date(lastOrderDate)) {
            lastOrderDate = cart.order.created_at.toISOString();
          }
        }
      });

      return {
        userId: client.id,
        email: client.user.email,
        ordersCount,
        totalSpent,
        lastOrderDate: lastOrderDate || "Nunca comprou"
      };
    }).sort((a, b) => b.totalSpent - a.totalSpent);

    return usersReport;
  } catch (error) {
    console.error("Erro ao buscar relatório de usuários:", error);
    throw new Error("Erro ao carregar relatório de usuários");
  }
}

export async function exportReportToCSV(type: string, dateRange: DateRange) {
  try {
    switch (type) {
      case "sales":
        const salesData = await getSalesReport(dateRange);
        if (salesData.length === 0) {
          return "Data,Vendas,Receita";
        }
        
        const salesCSV = [
          "Data,Vendas,Receita",
          ...salesData.map(item => 
            `${item.date},${item.sales},${item.revenue.toFixed(2)}`
          )
        ].join("\n");
        
        return salesCSV;

      case "products":
        const productsData = await getProductsReport(dateRange);
        if (productsData.length === 0) {
          return "Produto,Estoque,Vendas,Receita,Status";
        }
        
        const productsCSV = [
          "Produto,Estoque,Vendas,Receita,Status",
          ...productsData.map(item => 
            `${item.productName},${item.stock},${item.salesCount},${item.revenue.toFixed(2)},${item.stockAlert ? "Baixo Estoque" : "Normal"}`
          )
        ].join("\n");
        
        return productsCSV;

      case "users":
        const usersData = await getUsersReport(dateRange);
        if (usersData.length === 0) {
          return "Email,Pedidos,Total Gasto,Última Compra";
        }
        
        const usersCSV = [
          "Email,Pedidos,Total Gasto,Última Compra",
          ...usersData.map(item => {
            const lastOrder = item.lastOrderDate === "Nunca comprou" 
              ? "Nunca comprou"
              : new Date(item.lastOrderDate).toLocaleDateString('pt-BR');
            
            return `${item.email},${item.ordersCount},${item.totalSpent.toFixed(2)},${lastOrder}`;
          })
        ].join("\n");
        
        return usersCSV;

      default:
        throw new Error("Tipo de relatório inválido");
    }
  } catch (error) {
    console.error("Erro ao exportar relatório:", error);

    switch(type) {
      case "sales":
        return "Data,Vendas,Receita";
      case "products":
        return "Produto,Estoque,Vendas,Receita,Status";
      case "users":
        return "Email,Pedidos,Total Gasto,Última Compra";
      default:
        return "";
    }
  }
}