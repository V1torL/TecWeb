import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { getUser } from "@/lib/auth";
// Filters removed per request
import { Input } from "@/lib/components";

async function getOrdersForClient(
	clientId: string,
	start?: string,
	end?: string,
) {
	const createdFilter: Record<string, Date> = {};
	if (start) createdFilter.gte = new Date(start);
	if (end) {
		const d = new Date(end);
		d.setHours(23, 59, 59, 999);
		createdFilter.lte = d;
	}

	console.log(createdFilter);
	const orders = await prisma.order.findMany({
		where: {
			carts: { some: { clientId } },
			created_at: createdFilter,
		},
		include: {
			carts: {
				include: {
					products: true,
				},
			},
			payment: true,
		},
		orderBy: { created_at: "desc" },
	});
	return orders;
}

export default async function Perfil() {
	const user = await getUser();
	if (!user || !user.client) {
		redirect("/login");
	}

	const orders = await getOrdersForClient(user.client.id);

	return (
		<div className="flex-col gap2">
			<h1 className="page-title">Perfil</h1>

			<div className="flex-col">
				<Input
					placeholder="Nome"
					type="text"
					value={user.client.nome ?? ""}
					readOnly
					disabled
				/>
				<Input
					placeholder="Email"
					type="email"
					value={user.email ?? ""}
					readOnly
					disabled
				/>
				<Input
					placeholder="Cidade"
					type="text"
					value={user.client.cidade ?? ""}
					readOnly
					disabled
				/>
			</div>

			<h2>Compras Anteriores</h2>
			<table className="data-table">
				<thead>
					<tr>
						<th>Pedido</th>
						<th>Status</th>
						<th>Criado em</th>
						<th>Data de Entrega</th>
						<th>Quantidade de Itens</th>
					</tr>
				</thead>
				<tbody>
					{orders.length === 0 ? (
						<tr>
							<td colSpan={5} style={{ textAlign: "center" }}>
								Nenhuma compra realizada
							</td>
						</tr>
					) : (
						orders.map((order) => {
							const items = order.carts.reduce(
								(sum, c) => sum + c.products.length,
								0,
							);
							return (
								<tr key={order.id}>
									<td>{order.id}</td>
									<td>{order.status}</td>
									<td>
										{new Date(order.created_at).toLocaleDateString("pt-BR")}
									</td>
									<td>
										{order.arrive_date
											? new Date(order.arrive_date).toLocaleDateString("pt-BR")
											: "-"}
									</td>
									<td>{items}</td>
								</tr>
							);
						})
					)}
				</tbody>
			</table>
		</div>
	);
}
