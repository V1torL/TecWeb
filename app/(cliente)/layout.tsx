import HeaderCliente from "@/components/HeaderCliente";
import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";

export default async function ClientLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }
  const user = session.user as { tipo: "ADMIN" | "CLIENT" };
  if (user.tipo !== "CLIENT") {
    notFound();
  }
  return (
    <>
      <HeaderCliente />
      <main>{children}</main>
    </>
  );
}
