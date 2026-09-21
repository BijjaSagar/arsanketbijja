import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "admin_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

function getSecret() {
	const secret = process.env.SESSION_SECRET;
	if (!secret || secret.length < 16) {
		throw new Error("SESSION_SECRET must be set to a long random string.");
	}
	return new TextEncoder().encode(secret);
}

export async function createSessionToken(email: string) {
	return new SignJWT({ email })
		.setProtectedHeader({ alg: "HS256" })
		.setIssuedAt()
		.setExpirationTime("7d")
		.sign(getSecret());
}

export async function verifySessionToken(token: string) {
	const { payload } = await jwtVerify(token, getSecret());
	const email = typeof payload.email === "string" ? payload.email : null;
	if (!email) throw new Error("Invalid session");
	return { email };
}
