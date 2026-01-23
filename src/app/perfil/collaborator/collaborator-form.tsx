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
import {
  createCollaborator,
  getCollaborator,
  updateCollaborator,
} from "./collaborator-handler";
import {
  categorias,
  orientaciones,
  useCollaboratorForm,
} from "./form-collaborator.hook";
import { useEffect } from "react";
import { ApiResponse } from "@/lib/api-response";
import { useUser } from "@/context/user-context";

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
    validate,
    setSending,
    setCurrentCategoria,
    addCategoria,
    removeCategoria,
  } = useCollaboratorForm();

  const { user, setUser } = useUser();

  useEffect(() => {
    if (user && user.tipo == "colaborador") {
      async function load() {
        setSending(true);
        const res = await getCollaborator();
        setSending(false);

        if (res.success && res.data) {
          setData(res.data);
        } else {
          toast.error(res.message);
        }
      }

      load();
    }
  }, [user]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      toast.error("Por favor revise los errores.");
      return;
    }

    setSending(true);
    let res: ApiResponse<CollaboratorInfo>;

    if (user?.tipo == "colaborador") {
      res = await updateCollaborator(data);
    } else {
      res = await createCollaborator(data);
    }

    setSending(false);

    if (res.success) {
      if (user) {
        setUser({ ...user, tipo: "colaborador" });
      }

      toast.success(res.message);
    } else {
      toast.error(res.message);
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

            <Button type="submit" disabled={sending}>
              {user?.tipo == "colaborador"
                ? "Actualizar información"
                : "Crear colaborador"}
            </Button>
          </Form.Root>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
