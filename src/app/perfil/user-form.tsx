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
import { XIcon } from "lucide-react";
import { toast } from "sonner";

import { useEffect, useState, useRef } from "react";

import z from "zod";
import { setInfoFormSchema } from "./schema";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUpdateUser } from "@/hooks/useUpdateUser";
import { useUpdateProfilePhoto } from "@/hooks/useUpdateProfilePhoto";

export default function FormUserInfo({ user }: { user: AppUser | null }) {
  const form = useForm<z.infer<typeof setInfoFormSchema>>({
    resolver: zodResolver(setInfoFormSchema),
    defaultValues: {
      nombre: user?.nombre || "",
      apellido: user?.apellido || "",
      descripcion: user?.descripcion || "",
    },
  });

  const updateUserMutation = useUpdateUser();
  const uploadPhoto = useUpdateProfilePhoto();

  const [file, setFile] = useState<File | null>(null);
  const isSubmittingRef = useRef(false);

  useEffect(() => {
    if (user) {
      form.reset({
        nombre: user.nombre ?? "",
        apellido: user.apellido ?? "",
        descripcion: user.descripcion ?? "",
      });
    }
  }, [user, form]);

  async function onSubmit(data: z.infer<typeof setInfoFormSchema>) {
    // Prevenir doble submit
    if (isSubmittingRef.current || updateUserMutation.isPending) {
      toast.warning("Ya hay una actualización en curso");
      return;
    }

    isSubmittingRef.current = true;

    try {
      await updateUserMutation.mutateAsync({
        nombre: data.nombre.trim(),
        apellido: data.apellido?.trim() || "",
        descripcion: data.descripcion?.trim() || "",
        foto: user?.foto || undefined, // Mantener foto actual
      });

      toast.success("Perfil actualizado correctamente.");
    } catch (error) {
      toast.error("Error al actualizar el perfil. Inténtelo más tarde.");
    } finally {
      isSubmittingRef.current = false;
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    const maxSize = 2 * 1024 * 1024; // 2MB

    if (file && file.size > maxSize) {
      toast.error("Imagen demasiado grande. Máximo tamaño es 2MB.");
      e.target.value = "";
      setFile(null);
      return;
    }

    setFile(file || null);
  }

  async function handleImageUpload() {
    if (!file) return;

    try {
      toast.message("Subiendo imagen...");

      await uploadPhoto.mutateAsync(file);

      toast.success("Imagen actualizada correctamente.");
      setFile(null);
    } catch (error) {
      console.error("Error al subir imagen:", error);
      toast.error("Error al actualizar la imagen.");
    }
  }

  const isLoading = updateUserMutation.isPending || uploadPhoto.isPending;

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button variant="outline" className="w-full" disabled={isLoading}>
          Editar Perfil
        </Button>
      </Dialog.Trigger>

      <Dialog.Content>
        <Dialog.Close className="absolute top-4 right-4 border-gray-400/30 border-2 rounded-md">
          <XIcon size={32} />
        </Dialog.Close>

        <Dialog.Title mt="6">
          <Text as="p" size="4" className="font-semibold">
            Tu información de tu perfil
          </Text>
        </Dialog.Title>

        <Flex className="flex flex-col items-center max-w-xl mx-auto" gap="4">
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
              disabled={isLoading}
              className="w-full md:w-fit"
            />
            <Button
              disabled={isLoading || !file}
              className="w-full md:w-fit"
              onClick={handleImageUpload}
            >
              {uploadPhoto.isPending ? "Subiendo..." : "Actualizar Imagen"}
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
                    disabled={isLoading}
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
                    disabled={isLoading}
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
                    disabled={isLoading}
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

            <Button type="submit" disabled={isLoading}>
              {updateUserMutation.isPending ? "Guardando..." : "Guardar"}
            </Button>
          </Form.Root>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
