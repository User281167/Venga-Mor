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
import { updateImage, updateUser } from "./user-handler";
import { toast } from "sonner";
import { useUser } from "@/context/user-context";

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
  const [file, setFile] = useState<File | null>(null);
  const { setUser } = useUser();

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
      const res = await updateUser(data);

      if (res.success) {
        toast.success("Perfil actualizado correctamente.");

        setUser({
          ...user,
          nombre: data.nombre,
          apellido: data.apellido,
          descripcion: data.descripcion,
        } as AppUser);
      } else {
        toast.error(res.message);
      }

      setLoading(false);
    } catch (error) {
      toast.error("Error al actualizar el perfil. Intentelo más tarde.");
    }

    setLoading(false);
  }

  function handleFileChange(e) {
    const file = e.target.files[0];
    const maxSize = 2 * 1024 * 1024; // 2MB

    if (file && file.size > maxSize) {
      toast.error("Imagen demasiado grande. Máximo tamaño es 2MB.");
      e.target.value = "";
      setFile(null);
      return;
    }

    setFile(file);
  }

  async function handleImageUpload() {
    if (!file) return;

    setLoading(true);
    toast.message("Subiendo imagen...");
    const res = await updateImage(file);

    if (res.success) {
      toast.success("Imagen actualizada correctamente.");

      setUser({
        ...user,
        foto: res.data,
      } as AppUser);
    } else {
      toast.error(res.message);
    }

    setLoading(false);
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger aschild="true">
        <Button variant="outline" className="w-full" disabled={loading}>
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
          <Flex
            wrap="wrap"
            gap="2"
            align="center"
            justify="center"
            className="w-full"
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full md:w-fit"
            />
            <Button
              disabled={loading || !file}
              className="w-full md:w-fit"
              onClick={handleImageUpload}
            >
              Actualizar Imagen
            </Button>
          </Flex>

          <Form.Root
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full max-w-md rounded-lg shadow-md flex flex-col gap-4"
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
