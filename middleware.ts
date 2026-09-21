import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/session";

const LOGIN_PATH = "/admin/login";

export async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;
	const isLogin = pathname === LOGIN_PATH || pathname === `${LOGIN_PATH}/`;
	const isAdminPage = pathname.startsWith("/admin");
	const isAdminApi = pathname.startsWith("/api/admin");

	if (!isAdminPage && !isAdminApi) {
		return NextResponse.next();
	}

	if (isLogin) {
		return NextResponse.next();
	}

	const token = request.cookies.get(SESSION_COOKIE)?.value;
	if (!token) {
		if (isAdminApi) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}
		const url = request.nextUrl.clone();
		url.pathname = LOGIN_PATH;
		url.search = "";
		return NextResponse.redirect(url);
	}

	try {
		await verifySessionToken(token);
		return NextResponse.next();
	} catch {
		if (isAdminApi) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}
		const url = request.nextUrl.clone();
		url.pathname = LOGIN_PATH;
		url.search = "";
		const response = NextResponse.redirect(url);
		response.cookies.set(SESSION_COOKIE, "", { path: "/", maxAge: 0 });
		return response;
	}
}

export const config = {
	matcher: ["/admin", "/admin/:path*", "/api/admin/:path*"],
};
