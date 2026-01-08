import { NextRequest, NextResponse } from "next/server";
import { serialize } from "cookie";
import { ApiResponse } from "@/lib/api-response";

export async function POST(req: NextRequest) {
  try {
    const token = await req.json().then((data) => data.token as string);

    const cookie = serialize("token", token, {
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60, // 1 hora
      sameSite: "strict",
    });

    return NextResponse.json(ApiResponse.success(token, "Token renovado"), {
      headers: { "Set-Cookie": cookie },
      status: 200,
    });
  } catch (error: any) {
    return NextResponse.json(
      ApiResponse.failure(error.message || "Error renovando token"),
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  const cookie = serialize("token", "", {
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    sameSite: "strict",
  });

  return NextResponse.json(ApiResponse.success(null, "Token eliminado"), {
    headers: { "Set-Cookie": cookie },
    status: 200,
  });
}
