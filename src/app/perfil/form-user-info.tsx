"use client";
import { AppUser } from "@/types/user";
import {
  Avatar,
  Button,
  Dialog,
  Flex,
  Text,
  TextArea,
  TextField,
} from "@radix-ui/themes";
import { Form } from "radix-ui";

import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";

import { setInfoFormSchema } from "./schema";

import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export default function FormUserInfo({ user }: { user: AppUser | null }) {
  const form = useForm<z.infer<typeof setInfoFormSchema>>({
    resolver: zodResolver(setInfoFormSchema),
    defaultValues: {
      nombre: user?.nombre || "",
      apellido: user?.apellido || "",
      descripcion: user?.descripcion || "",
    },
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      form.reset({
        nombre: user.nombre ?? "",
        apellido: user.apellido ?? "",
        descripcion: user.descripcion ?? "",
      });

      setLoading(false);
    }
  }, [user, form]);

  async function onSubmit(data: z.infer<typeof setInfoFormSchema>) {
    setLoading(true);

    try {
      await fetch("/api/user", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger aschild="true">
        <Button variant="outline" className="w-full">
          Editar Perfil
        </Button>
      </Dialog.Trigger>

      <Dialog.Content>
        <Dialog.Title>
          <Text as="p" className="text-xl font-semibold">
            Tu información de tu perfil
          </Text>
        </Dialog.Title>

        <Flex
          className="pt-6 flex flex-col items-center max-w-xl mx-auto"
          gap="4"
        >
          <Avatar
            className="h-24 w-24 border-2 border-primary"
            src={user?.foto || ""}
            fallback={user?.nombre?.charAt(0) || "U"}
          />

          <Form.Root
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full max-w-md p-6 rounded-lg shadow-md flex flex-col gap-4"
            noValidate
          >
            <Form.Field name="nombre">
              <Flex direction="column" align="start">
                <Form.Label>Nombre</Form.Label>

                <Form.Control asChild className="w-full">
                  <TextField.Root
                    disabled={loading}
                    {...form.register("nombre")}
                    type="text"
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
                    type="text"
                  />
                </Form.Control>

                {form.formState.errors.apellido && (
                  <Form.Message className="text-red-500 text-sm">
                    {form.formState.errors.apellido.message}
                  </Form.Message>
                )}
              </Flex>
            </Form.Field>

            <Form.Field name="descripcion">
              <Flex direction="column" align="start">
                <Form.Label>Descripción</Form.Label>

                <Form.Control asChild className="w-full">
                  <TextArea
                    size="3"
                    disabled={loading}
                    maxLength={50}
                    {...form.register("descripcion")}
                  />
                </Form.Control>

                {form.formState.errors.descripcion && (
                  <Form.Message className="text-red-500 text-sm">
                    {form.formState.errors.descripcion.message}
                  </Form.Message>
                )}
              </Flex>
            </Form.Field>

            <Button type="submit" disabled={loading}>
              Guardar
            </Button>
          </Form.Root>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
