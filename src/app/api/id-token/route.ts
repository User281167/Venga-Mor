import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ApiResponse } from "@/lib/api-response";

export async function POST(req: NextRequest) {
  try {
    const token = await req.json().then((data) => data.token as string);

    (await cookies()).set({
      name: "token",
      value: token,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60, // 1 hora
    });

    return NextResponse.json(ApiResponse.success(token, "Token renovado"), {
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
  (await cookies()).delete("token");

  return NextResponse.json(ApiResponse.success(null, "Token eliminado"), {
    status: 200,
  });
}
