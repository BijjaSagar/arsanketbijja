import { NextResponse } from "next/server";
import { applySessionCookie, createSessionToken, verifyPassword } from "@/lib/auth";
import { findAdminByEmail } from "@/lib/cms";

export const runtime = "nodejs";

export async function POST(request: Request) {
	let email = "";
	let password = "";
	try {
		const body = (await request.json()) as { email?: string; password?: string };
		email = body.email?.trim().toLowerCase() ?? "";
		password = body.password ?? "";
	} catch {
		return NextResponse.json({ error: "Invalid request." }, { status: 400 });
	}

	if (!email || !password) {
		return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
	}

	const user = await findAdminByEmail(email);
	if (!user) {
		return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
	}

	const ok = await verifyPassword(password, user.passwordHash);
	if (!ok) {
		return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
	}

	const token = await createSessionToken(user.email);
	const response = NextResponse.json({ ok: true });
	return applySessionCookie(response, token);
}
