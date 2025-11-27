import Link from "next/link";
import { Search, User, ShoppingCart } from "lucide-react";
import { getUser } from "@/lib/auth";
import LogOut from "./HeaderCliente";
import "./header.css";
import SearchBar from "./SearchBar";

// <AuthArea>
// 	<div className="login-links">
// 		<Link href="/login">Entre</Link>
// 		<span>ou</span>
// 		<Link href="/register">Cadastre-se</Link>
// 	</div>
//       <Link href="/login">
// 		<ShoppingCart size={20} />
// 	</Link>
// </AuthArea>
export default async function Header() {
	const user = await getUser();
	return (
		<header>
			<div>
				<Link href="/">
					<h1>Elementx Fitness</h1>
				</Link>

				<SearchBar />

				<div className="auth-area">
					{user ? (
						<>
							<Link href="/perfil">
								<User size={20} />
							</Link>
							<Link href="/cart">
								<ShoppingCart size={20} />
							</Link>
							<LogOut />
						</>
					) : (
						<>
							<div className="login-links">
								<Link href="/login">Entre</Link>
								<span>ou</span>
								<Link href="/register">Cadastre-se</Link>
							</div>
							<Link href="/login">
								<ShoppingCart size={20} />
							</Link>
						</>
					)}
				</div>
			</div>
		</header>
	);
}
