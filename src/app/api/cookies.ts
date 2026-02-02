import { cookies } from "next/headers";

export const COOKIE_USER_NAME = "user_name";

export async function setCookieUserName(name: string): Promise<void> {
  (await cookies()).set({
    name: COOKIE_USER_NAME,
    value: name,
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60, // 1 hora
  });
}

export async function getCookieUser(): Promise<string | undefined> {
  const cookieStore = await cookies();
  const name = cookieStore.get(COOKIE_USER_NAME)?.value;
  return name;
}

export async function deleteCookieUser(): Promise<void> {
  (await cookies()).delete(COOKIE_USER_NAME);
}
