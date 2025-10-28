import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth";

export default async function UserRedirect() {
	const user = await getUser();
	var url = "/";
	console.log("user", user);
	if (user?.tipo === "CLIENT") {
		url = "/client";
	} else if (user?.tipo === "ADMIN") {
		url = "/admin";
	}
	redirect(url);
}
