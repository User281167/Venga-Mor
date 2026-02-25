import { Button, Flex, Text, TextArea } from "@radix-ui/themes";
import { Dialog as ThemeDialog } from "@radix-ui/themes";

import { Edit } from "lucide-react";

import React from "react";
import { PostData } from "@/types/post";
import { useUpdatePostDescription } from "./post.hook";
import { BusinessError } from "@/errors/errors";
import { toast } from "sonner";

interface PostEditDialogProps {
  post: PostData;
}

export function PostEditDialog({ post }: PostEditDialogProps) {
  const [newDescription, setNewDescription] = React.useState(post.descripcion);
  const { mutate, isPending } = useUpdatePostDescription();

  // Sincroniza si post.descripcion cambia desde afuera
  React.useEffect(() => {
    setNewDescription(post.descripcion);
  }, [post.descripcion]);

  const handleUpdateSave = () => {
    mutate(
      { postId: post.id, descripcion: newDescription },
      {
        onError: (err) => {
          if (err instanceof BusinessError) {
            toast.error(err.message);
          } else {
            toast.error("Error al actualizar la descripción");
          }
        },
      },
    );
  };

  return (
    <ThemeDialog.Root>
      <ThemeDialog.Trigger asChild>
        <Button
          variant="soft"
          color="gray"
          size="2"
          className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
        >
          <Edit size={20} />
        </Button>
      </ThemeDialog.Trigger>

      <ThemeDialog.Content maxWidth="450px">
        <ThemeDialog.Title>Editar publicación</ThemeDialog.Title>

        <ThemeDialog.Description size="2" mb="4">
          Cambia la descripción de tu publicación.
        </ThemeDialog.Description>

        <Flex direction="column" gap="3">
          <Text className="text-white/70">Nueva descripción</Text>

          <TextArea
            resize="none"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
          />
        </Flex>

        <Flex gap="3" mt="4" justify="end">
          <ThemeDialog.Close>
            <Button variant="soft" color="gray">
              Cancelar
            </Button>
          </ThemeDialog.Close>

          <ThemeDialog.Close>
            <Button onClick={handleUpdateSave} disabled={isPending}>
              {isPending ? "Guardando..." : "Guardar"}
            </Button>
          </ThemeDialog.Close>
        </Flex>
      </ThemeDialog.Content>
    </ThemeDialog.Root>
  );
}
