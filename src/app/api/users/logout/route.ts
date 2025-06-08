import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const response = NextResponse.json({
            message: "Logout successful"
        });

        // Clear the token cookie
        response.cookies.set("token", "", {
            httpOnly: true,
            expires: new Date(0),
            path: "/"
        });

        return response;
    } catch (error: any) {
        return NextResponse.json(
            { error: "Logout failed", details: error.message },
            { status: 500 }
        );
    }
}
