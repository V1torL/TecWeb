import HeaderAdmin from "@/components/HeaderAdmin";
import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
	const session = await auth();

	if (!session?.user) {
		redirect("/login");
	}

	const user = session.user as { tipo: "ADMIN" | "CLIENT" };

	if (user.tipo !== "ADMIN") {
		notFound();
	}

	return (
		<>
			<HeaderAdmin />
			<main>{children}</main>
		</>
	);
}
