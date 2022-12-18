import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwtDecode, { JwtPayload } from "jwt-decode";
export function middleware(request: any) {
	const access = request.cookies.get("access_token");
	console.log("middleware");
	console.log(request.cookies);
	console.log("sfdfd", request.cookies.get("access_token"));

	try {
		const decodedAccessToken: any = jwtDecode<JwtPayload>(access);
		console.log("dd", decodedAccessToken);
		const expireTime = decodedAccessToken.exp * 1000;
		const date = Date.now();

		if (
			!access ||
			(expireTime < date && request.nextUrl.pathname.startsWith("/dashboard"))
		) {
			console.log("no token in cookies");
			return NextResponse.redirect(new URL("/auth/login", request.url));
		}
	} catch (error: any) {
		console.log("token error", error.message);
		if (request.nextUrl.pathname.startsWith("/dashboard")) {
			return NextResponse.redirect(new URL("/auth/login", request.url));
		}
	}
}
