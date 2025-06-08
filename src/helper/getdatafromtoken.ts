import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { get } from "http";

export function getDataFromToken(request: unknown, NextRequest: unknown, String: StringConstructor, token: string) {
    try {
        // Verify the token and extract data
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        return decoded;
    } catch (error) {
        // Handle token verification errors
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
}
export default getDataFromToken;