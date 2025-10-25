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
			<body>{children}</body>
		</html>
	);
}
