import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { SESSION_COOKIE, SESSION_MAX_AGE, createSessionToken, verifySessionToken } from "./session";
import { hashPassword, verifyPassword } from "./password";

export { SESSION_COOKIE, createSessionToken, verifySessionToken, hashPassword, verifyPassword };

export function applySessionCookie(response: NextResponse, token: string) {
	response.cookies.set(SESSION_COOKIE, token, {
		httpOnly: true,
		sameSite: "lax",
		secure: process.env.NODE_ENV === "production",
		path: "/",
		maxAge: SESSION_MAX_AGE,
	});
	return response;
}

export function clearSessionCookie(response: NextResponse) {
	response.cookies.set(SESSION_COOKIE, "", {
		httpOnly: true,
		sameSite: "lax",
		secure: process.env.NODE_ENV === "production",
		path: "/",
		maxAge: 0,
	});
	return response;
}

export async function getAdminEmailFromCookies() {
	const store = await cookies();
	const token = store.get(SESSION_COOKIE)?.value;
	if (!token) return null;
	try {
		const session = await verifySessionToken(token);
		return session.email;
	} catch {
		return null;
	}
}
