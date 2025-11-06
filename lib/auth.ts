import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authenticateAction } from "./actions";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";
import type { Admin, Client, User as SimpleUser } from "@prisma/client";
import { useSession } from "next-auth/react";

export const { handlers, signIn, signOut, auth } = NextAuth({
	adapter: PrismaAdapter(prisma),
	callbacks: {
		jwt: async ({ token, user }) => {
			if (user) {
				token.user = user;
			}
			return token;
		},
		session: async ({ session, token }) => {
			if (session.user && token.user) {
				session.user = { ...session.user, ...token.user };
			}
			return session;
		},
	},
	session: {
		strategy: "jwt",
	},
	providers: [
		Credentials({
			authorize: async (creds) => {
				return await authenticateAction(creds);
			},
			credentials: {
				email: {
					type: "email",
					label: "Email",
					placeholder: "fulano@email.com",
				},
				password: {
					type: "password",
					label: "Senha",
					placeholder: "*****",
				},
			},
		}),
	],
});

type User = SimpleUser & {
	admin: Admin | undefined;
	client: Client | undefined;
};
export async function getUser(): Promise<User | undefined> {
	const session = await auth();
	return session?.user as User;
}

export function useUser(): {
	user: User | undefined;
	status: "loading" | "authenticated" | "unauthenticated";
} {
	const { data, status } = useSession();
	return { user: data?.user as User, status };
}
