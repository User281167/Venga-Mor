"use client";
import { Button, Flex, Heading, Text, TextField } from "@radix-ui/themes";
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
import { onSubmitResetPassword } from "./handler";
import { ResetPasswordFormSchema } from "./schema";

export default function SignInPage() {
  const form = useForm<z.infer<typeof ResetPasswordFormSchema>>({
    resolver: zodResolver(ResetPasswordFormSchema),
    defaultValues: {
      email: "",
    },
  });

  const [emailSent, setEmailSent] = useState(false);
  const [loadingForm, setLoadingForm] = useState(true);
  const { user, loading } = useUser();

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

  async function onSubmit(values: z.infer<typeof ResetPasswordFormSchema>) {
    setLoadingForm(true);
    toast.message("Enviando correo...");

    const res = await onSubmitResetPassword(values);

    if (res.success) {
      toast.success(res.message);
      setEmailSent(true);
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
          <Form.Field name="email" hidden={emailSent}>
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

          <Button
            disabled={loadingForm}
            hidden={emailSent}
            type="submit"
            className="bg-primary hover:bg-primary/80 text-primary-foreground"
            size="3"
          >
            Reestablecer
          </Button>

          <Text as="p" hidden={!emailSent}>
            Reviza tu bandeja de entrada o spam
          </Text>

          <Link
            hidden={!emailSent}
            href="/iniciar-sesion"
            className="text-primary hover:underline bg-white p-3 rounded-md"
          >
            Inicia sesión aquí
          </Link>

          <Text
            as="p"
            className="text-sm text-gray-500 bg-white p-3 rounded-md"
          >
            ¿No tienes una cuenta?{" "}
            <Link href="/registrarse" className="text-primary hover:underline">
              Regístrate aquí
            </Link>
          </Text>
        </Form.Root>
      </Flex>
    </HeaderGif>
  );
}
