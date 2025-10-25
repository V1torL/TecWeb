import Header from "@/components/Header";
import "./globals.css";

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
				<Header />
				{children}
			</body>
		</html>
	);
}
