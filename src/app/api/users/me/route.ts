import { connectDB } from "@/dbconfig/dbconfig";
import User from "@/models/usermodel";
import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/helper/getdatafromtoken";

connectDB();

export async function POST(request: NextRequest) {
  try {
    // Extract token from request headers (example: from Authorization header)
    const authHeader = request.headers.get("authorization");
    const token = authHeader ? authHeader.replace("Bearer ", "") : "";

    const userId = getDataFromToken(request, NextRequest, String, token);

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "User fetched successfully", user },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
