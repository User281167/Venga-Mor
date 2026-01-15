"use client";
import { Button, Flex, Heading, TextField } from "@radix-ui/themes";
import { EyeClosedIcon, EyeIcon } from "lucide-react";
import { toast } from "sonner";
import { Form } from "radix-ui";
import HeaderGif from "@/components/header-gif";
import Link from "next/link";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";

import { useUser } from "@/context/user-context";
import { useRouter } from "next/navigation";
import { onSubmitLoginGmailUser, onSubmitLoginUser } from "./handler";
import { loginFormSchema } from "./schema";

export default function SignInPage() {
  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loadingForm, setLoadingForm] = useState(true);
  const { user, setUser, loading } = useUser();

  const router = useRouter();

  useEffect(() => {
    if (!loading && !!user) {
      router.push("/perfil");
    }
  }, [user, loading]);

  useEffect(() => {
    if (!loading) {
      setLoadingForm(false);
    }
  }, [loading]);

  async function onSubmit(values: z.infer<typeof loginFormSchema>) {
    setLoadingForm(true);
    toast.message("Iniciando sesión...");

    const res = await onSubmitLoginUser(values);

    if (res.success && res.data) {
      toast.success(res.message);
      setUser(res.data);
    } else {
      toast.error(res.message);
    }

    setLoadingForm(false);
  }

  async function handleGoogleSignIn() {
    setLoadingForm(true);
    toast.message("Iniciando sesión con Google...");
    const res = await onSubmitLoginGmailUser();

    if (res.success && res.data) {
      toast.success(res.message);
      setUser(res.data);
    } else {
      toast.error(res.message);
    }

    setLoadingForm(false);
  }

  return (
    <HeaderGif>
      <Flex direction="column" align="center" gap="5" className="w-full">
        <Heading
          className="text-4xl md:text-6xl font-headline text-primary"
          style={{ fontFamily: "'Playball', cursive" }}
        >
          <Link href="/">Venga Mor</Link>
        </Heading>

        <Heading
          as="h2"
          className="text-xl md:text-2xl font-bold"
          style={{ fontFamily: "'Playball', cursive" }}
        >
          Bienvenido a Venga Mor
        </Heading>

        <Form.Root
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full max-w-md bg-white/40 p-6 rounded-lg shadow-md flex flex-col gap-4"
          noValidate
        >
          <Form.Field name="email">
            <Flex direction="column" align="start">
              <Form.Label>Email</Form.Label>

              <Form.Control asChild className="w-full">
                <TextField.Root
                  disabled={loadingForm}
                  {...form.register("email")}
                  type="email"
                />
              </Form.Control>

              {form.formState.errors.email && (
                <Form.Message className="text-red-500 text-sm">
                  {form.formState.errors.email.message}
                </Form.Message>
              )}
            </Flex>
          </Form.Field>

          <Form.Field name="password">
            <Flex direction="column" align="start">
              <Form.Label>Contraseña</Form.Label>

              <Form.Control asChild className="w-full">
                <TextField.Root
                  disabled={loadingForm}
                  {...form.register("password")}
                  type={showPassword ? "text" : "password"}
                >
                  <TextField.Slot side="right">
                    <button>
                      {showPassword ? (
                        <EyeClosedIcon
                          onClick={() => setShowPassword(false)}
                          className="h-6 w-6"
                        />
                      ) : (
                        <EyeIcon
                          onClick={() => setShowPassword(true)}
                          className="h-6 w-6"
                        />
                      )}
                    </button>
                  </TextField.Slot>
                </TextField.Root>
              </Form.Control>

              {form.formState.errors.password && (
                <Form.Message className="text-red-500 text-sm">
                  {form.formState.errors.password.message}
                </Form.Message>
              )}
            </Flex>
          </Form.Field>

          <Button
            disabled={loadingForm}
            type="submit"
            className="bg-primary hover:bg-primary/80"
            size="3"
          >
            Iniciar Sesión
          </Button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300" />
            </div>

            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">
                O continuar con
              </span>
            </div>
          </div>

          <Button
            disabled={loadingForm}
            type="button"
            onClick={handleGoogleSignIn}
            size="3"
            className="bg-red-600 hover:bg-red-700 flex items-center justify-center gap-2"
          >
            <img src="/google-icon.png" alt="Google Icon" className="w-6 h-6" />
            Iniciar Sesión con Google
          </Button>

          <p className="text-sm text-gray-500 bg-white p-3 rounded-md">
            ¿No tienes una cuenta?{" "}
            <Link href="/registrarse" className="text-primary hover:underline">
              Regístrate aquí
            </Link>
          </p>

          <Link href="/restablecer-cuenta" className="hover:underline">
            Restablecer contraseña
          </Link>
        </Form.Root>
      </Flex>
    </HeaderGif>
  );
}
