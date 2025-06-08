import { connectDB } from "@/dbconfig/dbconfig";

export async function GET() {
  try {
    await connectDB();
    return new Response("MongoDB Connected Successfully");
  } catch (error) {
    console.error("DB connection error:", error);
    return new Response("MongoDB Connection Failed vro", { status: 500 });
  }
}
