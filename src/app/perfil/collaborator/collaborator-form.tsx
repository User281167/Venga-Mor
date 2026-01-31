"use client";
import {
  Badge,
  Button,
  Dialog,
  Flex,
  Grid,
  Select,
  Skeleton,
  Text,
  TextField,
} from "@radix-ui/themes";
import { Form } from "radix-ui";
import { toast } from "sonner";
import { PlusIcon, XIcon } from "lucide-react";

import {
  collaboratorFormSchema,
  CollaboratorInfo,
} from "@/schema/collaborator";

import { orientaciones, useCollaboratorForm } from "./form-collaborator.hook";
import { useEffect, useRef } from "react";
import { useUser } from "@/context/user-context";
import { categorias } from "@/types/categorias";
import {
  useCollaboratorProfile,
  useCreateCollaborator,
  useUpdateCollaborator,
} from "@/hooks/useCollaboratorData";

export default function CollaboratorForm({ loading }: { loading: boolean }) {
  const {
    data,
    errors,
    sending,
    currentInterest,
    setData,
    setField,
    setCurrentInterest,
    addInterest,
    removeInterest,
    setSending,
    setCurrentCategoria,
    addCategoria,
    removeCategoria,
    validate,
  } = useCollaboratorForm();

  const { user } = useUser();
  const isSubmittingRef = useRef(false);

  // Obtener datos del colaborador si existe
  const { data: collaboratorData } = useCollaboratorProfile();

  // Mutaciones
  const createMutation = useCreateCollaborator();
  const updateMutation = useUpdateCollaborator();

  const isCollaborator = user?.tipo === "colaborador";
  const isMutating = createMutation.isPending || updateMutation.isPending;

  // Cargar datos del colaborador cuando estén disponibles
  useEffect(() => {
    if (collaboratorData) {
      setData(collaboratorData);
    }
  }, [collaboratorData, setData]);

  // Sincronizar estado de sending con las mutaciones
  useEffect(() => {
    setSending(isMutating);
  }, [isMutating, setSending]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevenir doble submit
    if (isSubmittingRef.current || isMutating) {
      toast.warning("Ya hay una operación en curso");
      return;
    }

    if (!validate()) {
      toast.error("Por favor revise los errores.");
      return;
    }

    isSubmittingRef.current = true;

    try {
      if (isCollaborator) {
        // Actualizar colaborador existente
        await updateMutation.mutateAsync(data);
        toast.success("Colaborador actualizado correctamente");
      } else {
        // Crear nuevo colaborador
        await createMutation.mutateAsync(data);
        toast.success("Colaborador creado correctamente");
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Error al procesar colaborador",
      );
    } finally {
      isSubmittingRef.current = false;
    }
  };

  return (
    <Dialog.Root>
      <Skeleton loading={loading} width="260px" height="32px">
        <Dialog.Trigger aschild="true">
          <Button variant="outline" className="w-full" disabled={loading}>
            {user?.tipo == "colaborador" ? "Editar" : "Crear"} cuanta de
            colaborador
          </Button>
        </Dialog.Trigger>
      </Skeleton>

      <Dialog.Content>
        <Dialog.Close className="absolute top-4 right-4 border-gray-400/30 border-2 rounded-md">
          <XIcon size={32} />
        </Dialog.Close>

        <Dialog.Title>
          <Text as="p" className="text-xl font-semibold">
            Información del perfil
          </Text>
        </Dialog.Title>

        <Flex
          className="pt-6 flex flex-col items-center max-w-xl mx-auto"
          gap="4"
        >
          <Form.Root
            onSubmit={onSubmit}
            className="w-full max-w-md rounded-lg shadow-md flex flex-col gap-4"
            noValidate
          >
            <Flex direction="column" align="start" gap="2">
              <Form.Field name="genero" className="w-full">
                <Form.Label>Género</Form.Label>

                <Select.Root
                  defaultValue={data.genero}
                  onValueChange={(value) =>
                    setField("genero", value as CollaboratorInfo["genero"])
                  }
                >
                  <Select.Trigger className="w-full" />

                  <Select.Content>
                    {collaboratorFormSchema.shape.genero.options.map(
                      (option) => (
                        <Select.Item key={option} value={option}>
                          {option}
                        </Select.Item>
                      ),
                    )}
                  </Select.Content>
                </Select.Root>

                {errors.genero?.[0] && (
                  <Form.Message className="text-red-500 text-sm">
                    {errors.genero[0]}
                  </Form.Message>
                )}
              </Form.Field>

              <Form.Field name="orientacion_sexual" className="w-full">
                <Form.Label>Orientación sexual</Form.Label>

                <Form.Control asChild className="w-full">
                  <Select.Root
                    defaultValue={
                      orientaciones.includes(data.orientacion_sexual)
                        ? data.orientacion_sexual
                        : "Otro"
                    }
                    onValueChange={(value) =>
                      setField(
                        "orientacion_sexual",
                        value as CollaboratorInfo["orientacion_sexual"],
                      )
                    }
                  >
                    <Select.Trigger className="w-full" />

                    <Select.Content>
                      {orientaciones.map((option) => (
                        <Select.Item key={option} value={option}>
                          {option}
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root>
                </Form.Control>

                {(!orientaciones.includes(data.orientacion_sexual) ||
                  data.orientacion_sexual === "Otro") && (
                  <Form.Control asChild className="w-full mt-4">
                    <TextField.Root
                      disabled={sending}
                      defaultValue={data.orientacion_sexual}
                      type="text"
                      onChange={(e) =>
                        setField("orientacion_sexual", e.target.value)
                      }
                    />
                  </Form.Control>
                )}

                {errors.orientacion_sexual?.[0] && (
                  <Form.Message className="text-red-500 text-sm">
                    {errors.orientacion_sexual[0]}
                  </Form.Message>
                )}
              </Form.Field>

              <Form.Field name="etnia" className="w-full">
                <Form.Label>Etnia</Form.Label>

                <Select.Root
                  disabled={sending}
                  defaultValue={data.etnia}
                  onValueChange={(value) =>
                    setField("etnia", value as CollaboratorInfo["etnia"])
                  }
                >
                  <Select.Trigger className="w-full" />

                  <Select.Content>
                    <Select.Group>
                      {collaboratorFormSchema.shape.etnia.options.map(
                        (option) => (
                          <Select.Item key={option} value={option}>
                            {option}
                          </Select.Item>
                        ),
                      )}
                    </Select.Group>
                  </Select.Content>
                </Select.Root>
              </Form.Field>

              <Form.Field name="altura" className="w-full">
                <Form.Label>Altura (metros)</Form.Label>

                <Form.Control asChild className="w-full">
                  <input
                    disabled={sending}
                    type="number"
                    placeholder="Ej. 1.20"
                    min="0"
                    max="250"
                    defaultValue={data.altura || ""}
                    onChange={(e) =>
                      setField(
                        "altura",
                        e.target.value === "" ? 0 : parseFloat(e.target.value),
                      )
                    }
                    className="bg-transparent px-2 py-1 border-2 rounded-sm border-gray-700"
                  />
                </Form.Control>

                {errors.altura?.[0] && (
                  <Form.Message className="text-red-500 text-sm">
                    {errors.altura[0]}
                  </Form.Message>
                )}
              </Form.Field>

              <Form.Field name="edad" className="w-full">
                <Form.Label>Edad</Form.Label>

                <Form.Control asChild className="w-full">
                  <input
                    disabled={sending}
                    type="number"
                    min="18"
                    max="100"
                    defaultValue="18"
                    onChange={(e) =>
                      setField(
                        "edad",
                        e.target.value === "" ? 0 : Number(e.target.value),
                      )
                    }
                    className="bg-transparent px-2 py-1 border-2 rounded-sm border-gray-700"
                  />
                </Form.Control>

                {errors.edad?.[0] && (
                  <Form.Message className="text-red-500 text-sm">
                    {errors.edad[0]}
                  </Form.Message>
                )}
              </Form.Field>

              <Form.Field name="pais" className="w-full">
                <Form.Label>País</Form.Label>

                <Form.Control asChild className="w-full">
                  <TextField.Root
                    disabled={sending}
                    type="text"
                    value={data.direccion?.pais || ""}
                    onChange={(e) =>
                      setData({
                        ...data,
                        direccion: { ...data.direccion, pais: e.target.value },
                      })
                    }
                  />
                </Form.Control>

                {errors.direccion?.[0] && (
                  <Form.Message className="text-red-500 text-sm">
                    {errors.direccion[0]}
                  </Form.Message>
                )}
              </Form.Field>

              <Form.Field name="estado_region" className="w-full">
                <Form.Label>Estado / Región</Form.Label>

                <Form.Control asChild className="w-full">
                  <TextField.Root
                    disabled={sending}
                    type="text"
                    value={data.direccion?.estado_region || ""}
                    onChange={(e) =>
                      setData({
                        ...data,
                        direccion: {
                          ...data.direccion,
                          estado_region: e.target.value,
                        },
                      })
                    }
                  />
                </Form.Control>
              </Form.Field>

              <Form.Field name="ciudad_localidad" className="w-full">
                <Form.Label>Ciudad / Localidad</Form.Label>

                <Form.Control asChild className="w-full">
                  <TextField.Root
                    disabled={sending}
                    type="text"
                    value={data.direccion?.ciudad_localidad || ""}
                    onChange={(e) =>
                      setData({
                        ...data,
                        direccion: {
                          ...data.direccion,
                          ciudad_localidad: e.target.value,
                        },
                      })
                    }
                  />
                </Form.Control>
              </Form.Field>

              <Form.Field name="profesion" className="w-full">
                <Form.Label>Profesion</Form.Label>

                <Form.Control asChild className="w-full">
                  <TextField.Root
                    type="text"
                    disabled={sending}
                    defaultValue={data.profesion}
                    onChange={(e) => setField("profesion", e.target.value)}
                  />
                </Form.Control>

                {errors.profesion?.[0] && (
                  <Form.Message className="text-red-500 text-sm">
                    {errors.profesion[0]}
                  </Form.Message>
                )}
              </Form.Field>

              <Form.Field name="categorias" className="w-full">
                <Form.Label>Categorias</Form.Label>

                <Grid columns="5">
                  <Select.Root
                    disabled={
                      sending ||
                      (data.categorias && data.categorias.length >= 3)
                    }
                    onValueChange={(value) => setCurrentCategoria(value)}
                  >
                    <Select.Trigger className="col-span-4" />

                    <Select.Content>
                      <Select.Group>
                        {categorias.map((option) => (
                          <Select.Item key={option} value={option}>
                            {option}
                          </Select.Item>
                        ))}
                      </Select.Group>
                    </Select.Content>
                  </Select.Root>

                  <Button
                    disabled={
                      sending ||
                      (data.categorias && data.categorias.length >= 3)
                    }
                    type="button"
                    className="p-0 bg-transparent"
                    onClick={addCategoria}
                  >
                    <PlusIcon />
                  </Button>
                </Grid>

                {errors.categorias?.[0] && (
                  <Form.Message className="text-red-500 text-sm">
                    {errors.categorias[0]}
                  </Form.Message>
                )}

                <Flex gap="2" wrap="wrap" mt="1">
                  {data.categorias?.map((field, index) => (
                    <Badge size="3" key={field + index}>
                      {field}

                      <Button
                        type="button"
                        onClick={() => removeCategoria(index)}
                        size="1"
                        className="p-0"
                      >
                        <XIcon />
                      </Button>
                    </Badge>
                  ))}
                </Flex>
              </Form.Field>

              <Form.Field name="intereses" className="w-full">
                <Form.Label>Intereses</Form.Label>

                <Form.Control asChild className="w-full">
                  <TextField.Root
                    disabled={sending}
                    type="text"
                    value={currentInterest}
                    onChange={(e) => setCurrentInterest(e.target.value)}
                  >
                    <TextField.Slot side="right">
                      <Button
                        type="button"
                        className="bg-transparent"
                        onClick={addInterest}
                        disabled={
                          sending ||
                          currentInterest.trim().length < 3 ||
                          data.intereses.length >= 5
                        }
                      >
                        <PlusIcon />
                      </Button>
                    </TextField.Slot>
                  </TextField.Root>
                </Form.Control>

                {errors.intereses?.[0] && (
                  <Form.Message className="text-red-500 text-sm">
                    {errors.intereses[0]}
                  </Form.Message>
                )}

                <Flex gap="2" wrap="wrap" mt="1">
                  {data.intereses.map((field, index) => (
                    <Badge size="3" key={field + index}>
                      {field}

                      <Button
                        type="button"
                        onClick={() => removeInterest(index)}
                        size="1"
                        className="p-0"
                      >
                        <XIcon />
                      </Button>
                    </Badge>
                  ))}
                </Flex>
              </Form.Field>

              <Form.Field name="redes" className="w-full flex flex-col gap-2">
                <Form.Label>Redes sociales</Form.Label>

                {[0, 1, 2].map((index) => (
                  <div key={index}>
                    <Form.Control asChild className="w-full">
                      <TextField.Root
                        disabled={sending}
                        placeholder={`URL ${index + 1}`}
                        type="url"
                        value={data.redes[index] || ""}
                        onChange={(e) => {
                          const newRedes = [...data.redes];
                          newRedes[index] = e.target.value;
                          setField("redes", newRedes);
                        }}
                      />
                    </Form.Control>

                    {/* Mostrar error por índice */}
                    {errors.redes?.[index] && (
                      <Form.Message className="text-red-500 text-sm">
                        {errors.redes[index]}
                      </Form.Message>
                    )}
                  </div>
                ))}
              </Form.Field>
            </Flex>

            <Button type="submit" disabled={sending || isMutating}>
              {isMutating
                ? "Procesando..."
                : isCollaborator
                  ? "Actualizar información"
                  : "Crear colaborador"}
            </Button>
          </Form.Root>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
