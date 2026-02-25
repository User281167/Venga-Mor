import { AlertDialog, Button, Flex } from "@radix-ui/themes";
import { Trash } from "lucide-react";

import { PostData } from "@/types/post";
import { useDeletePost } from "./post.hook";
import { BusinessError } from "@/errors/errors";
import { toast } from "sonner";

interface PostEditDialogProps {
  post: PostData;
}

export function PostDeleteDialog({ post }: PostEditDialogProps) {
  const { mutate, isPending } = useDeletePost();

  const handleDelete = () => {
    mutate(post.id, {
      onError: (err) => {
        if (err instanceof BusinessError) {
          toast.error(err.message);
        } else {
          toast.error("Error al eliminar la publicación");
        }
      },
    });
  };

  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger>
        <Button
          variant="soft"
          color="red"
          size="2"
          className="text-red-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
        >
          <Trash color="red" size={20} />
        </Button>
      </AlertDialog.Trigger>

      <AlertDialog.Content maxWidth="450px">
        <AlertDialog.Title>Eliminar post</AlertDialog.Title>

        <AlertDialog.Description size="2">
          ¿Estás seguro que quieres eliminar esta publicación? Esta acción no se
          puede deshacer.
        </AlertDialog.Description>

        <Flex gap="3" mt="4" justify="end">
          <AlertDialog.Cancel>
            <Button variant="soft" color="gray" disabled={isPending}>
              Cancelar
            </Button>
          </AlertDialog.Cancel>

          <AlertDialog.Action onClick={handleDelete}>
            <Button variant="solid" color="red" disabled={isPending}>
              {isPending ? "Eliminando..." : "Eliminar"}
            </Button>
          </AlertDialog.Action>
        </Flex>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
}
