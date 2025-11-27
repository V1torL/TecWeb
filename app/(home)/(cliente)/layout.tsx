import { notFound, redirect } from "next/navigation";
import { getUser } from "@/lib/auth";

export default async function ClientLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const user = await getUser();
	if (!user) {
		redirect("/login");
	}
	if (user.tipo !== "CLIENT") {
		notFound();
	}
	return <>{children}</>;
}
