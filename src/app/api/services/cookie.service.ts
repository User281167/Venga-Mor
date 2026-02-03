import { cookies } from "next/headers";

export type CookieName = string;

export interface CookieOptions {
  httpOnly?: boolean;
  secure?: boolean;
  path?: string;
  sameSite?: "strict" | "lax" | "none";
  maxAge?: number;
}

const DEFAULT_OPTIONS: CookieOptions = {
  httpOnly: true,
  path: "/",
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
};

export class CookieService {
  private static async store() {
    return cookies();
  }

  static async set(
    name: CookieName,
    value: string,
    options?: CookieOptions,
  ): Promise<void> {
    const store = await this.store();

    store.set({
      name,
      value,
      ...DEFAULT_OPTIONS,
      ...options,
    });
  }

  static async get(name: CookieName): Promise<string | undefined> {
    const store = await this.store();
    return store.get(name)?.value;
  }

  static async delete(name: CookieName): Promise<void> {
    const store = await this.store();
    store.delete(name);
  }

  static async deleteMany(names: CookieName[]): Promise<void> {
    const store = await this.store();
    names.forEach((name) => store.delete(name));
  }
}
