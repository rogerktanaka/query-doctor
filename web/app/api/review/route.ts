import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    message: "Query Doctor API is alive!",
  });
}