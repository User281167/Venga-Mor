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

import { registerFormSchema } from "./schema";
import { useUser } from "@/context/user-context";
import { useRouter } from "next/navigation";
import { onSubmitRegisterGmailUser, onSubmitRegisterUser } from "./handler";

export default function LoginPage() {
  const form = useForm<z.infer<typeof registerFormSchema>>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      email: "neres36395@24faw.com",
      password: "asdasdasdA1!",
      nombre: "Juan",
      apellido: "Sanchez",
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const { user, setUser, loading } = useUser();

  const router = useRouter();

  useEffect(() => {
    if (!!user) {
      router.push("/perfil");
    }
  }, [user]);

  async function onSubmit(values: z.infer<typeof registerFormSchema>) {
    toast.message("Creando tu cuenta...");

    const res = await onSubmitRegisterUser(values);

    if (res.success && res.data) {
      toast.success(res.message);
      setUser(res.data);
    } else {
      toast.error(res.message);
    }
  }

  async function handleGoogleSignIn() {
    toast.message("Iniciando sesión con Google...");
    const res = await onSubmitRegisterGmailUser();

    if (res.success && res.data) {
      toast.success(res.message);
      setUser(res.data);
    } else {
      toast.error(res.message);
    }
  }

  return (
    <HeaderGif>
      <Flex direction="column" align="center" gap="5" className="w-full">
        <Heading
          className="text-4xl md:text-6xl font-headline text-primary"
          style={{ fontFamily: "'Playball', cursive" }}
        >
          Venga Mor
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
          <Form.Field name="nombre">
            <Flex direction="column" align="start">
              <Form.Label>Nombre</Form.Label>

              <Form.Control asChild className="w-full">
                <TextField.Root
                  disabled={loading}
                  {...form.register("nombre")}
                />
              </Form.Control>

              {form.formState.errors.nombre && (
                <Form.Message className="text-red-500 text-sm">
                  {form.formState.errors.nombre.message}
                </Form.Message>
              )}
            </Flex>
          </Form.Field>

          <Form.Field name="apellido">
            <Flex direction="column" align="start">
              <Form.Label>Apellido</Form.Label>

              <Form.Control asChild className="w-full">
                <TextField.Root
                  disabled={loading}
                  {...form.register("apellido")}
                />
              </Form.Control>

              {form.formState.errors.apellido && (
                <Form.Message className="text-red-500 text-sm">
                  {form.formState.errors.apellido.message}
                </Form.Message>
              )}
            </Flex>
          </Form.Field>

          <Form.Field name="email">
            <Flex direction="column" align="start">
              <Form.Label>Email</Form.Label>

              <Form.Control asChild className="w-full">
                <TextField.Root
                  disabled={loading}
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
                  disabled={loading}
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
            disabled={loading}
            type="submit"
            className="bg-primary hover:bg-primary/80"
            size="3"
          >
            Registrarse
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
            disabled={loading}
            type="button"
            onClick={handleGoogleSignIn}
            size="3"
            className="bg-red-600 hover:bg-red-700 flex items-center justify-center gap-2"
          >
            <img src="/google-icon.png" alt="Google Icon" className="w-6 h-6" />
            Iniciar Sesión con Google
          </Button>

          <p className="text-sm text-gray-500 bg-white p-3 rounded-md">
            ¿Ya tienes una cuenta?{" "}
            <Link
              href="/iniciar-sesion"
              className="text-primary hover:underline"
            >
              Iniciar Sesión
            </Link>
          </p>
        </Form.Root>
      </Flex>
    </HeaderGif>
  );
}
