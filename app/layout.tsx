import Header from "@/components/Header";
import "./globals.css";
import { SessionProvider } from "next-auth/react";

export const metadata = {
	title: "Ecommerce",
	description: "Sistema simples de ecommerce",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="pt-BR">
			<body>
				<SessionProvider>
				<Header />
				{children}
				</SessionProvider>
			</body>
		</html>
	);
}
