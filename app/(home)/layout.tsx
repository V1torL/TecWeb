import Header from "@/components/Header";
import { AppProvider } from "@/lib/app-context";

export default function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<AppProvider>
			<Header />
			{children}
		</AppProvider>
	);
}
