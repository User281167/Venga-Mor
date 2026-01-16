"use client";
import {
  Badge,
  Button,
  Dialog,
  Flex,
  Select,
  Text,
  TextField,
} from "@radix-ui/themes";
import { Form } from "radix-ui";
import { toast } from "sonner";
import { PlusIcon, XIcon } from "lucide-react";

import { useMemo, useState } from "react";

import {
  collaboratorFormSchema,
  CollaboratorInfo,
} from "@/schema/collaborator";
import { createCollaborator } from "./handler";
import { capitalizeFirstLetter } from "@/lib/utils";

export default function NewCollaborator({ loading }: { loading: boolean }) {
  const [sending, setSending] = useState(false);
  const [currentInterest, setCurrentInterest] = useState("");

  const [data, setData] = useState({
    genero: "Femenino",
    orientacion_sexual: "",
    etnia: "Mestizo",
    altura: 0,
    edad: 18,
    profesion: "",
    intereses: [],
    redes: [],
  } as CollaboratorInfo);

  const errors = useMemo(() => {
    const r = collaboratorFormSchema.safeParse(data);
    return r.success ? {} : r.error.flatten().fieldErrors;
  }, [data]);

  function addInterest() {
    const value = capitalizeFirstLetter(currentInterest.trim());

    if (value.length < 3) {
      return;
    }

    if (data.intereses.includes(value)) return;
    if (data.intereses.length >= 5) return;

    setData((prev) => ({
      ...prev,
      intereses: [...prev.intereses, value],
    }));

    setCurrentInterest("");
  }

  function handleRemoveInterest(index: number) {
    setData((prev) => ({
      ...prev,
      intereses: prev.intereses.filter((_, i) => i !== index),
    }));
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    const result = collaboratorFormSchema.safeParse(data);

    if (!result.success) {
      toast.error("Por favor, complete todos los campos correctamente.");
      return;
    }

    setSending(true);
    const res = await createCollaborator(data);
    setSending(false);

    if (res.success) {
      toast.success("Perfil creado correctamente.");
    } else {
      toast.error(res.message);
    }
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger aschild="true">
        <Button variant="outline" className="w-full" disabled={loading}>
          Crear perfil como colaborador
        </Button>
      </Dialog.Trigger>

      <Dialog.Content>
        <Dialog.Title>
          <Text as="h2" className="text-xl font-semibold">
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
                    setData((d) => ({
                      ...d,
                      genero: value as CollaboratorInfo["genero"],
                    }))
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
                  <TextField.Root
                    disabled={sending}
                    type="text"
                    onChange={(e) =>
                      setData((d) => ({
                        ...d,
                        orientacion_sexual: e.target.value,
                      }))
                    }
                  />
                </Form.Control>

                {errors.orientacion_sexual?.[0] && (
                  <Form.Message className="text-red-500 text-sm">
                    {errors.orientacion_sexual?.[0]}
                  </Form.Message>
                )}
              </Form.Field>

              <Form.Field name="etnia" className="w-full">
                <Form.Label>Etnia</Form.Label>

                <Select.Root
                  disabled={sending}
                  defaultValue={data.etnia}
                  onValueChange={(value) =>
                    setData((d) => ({
                      ...d,
                      etnia: value as CollaboratorInfo["etnia"],
                    }))
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
                    defaultValue={data.altura}
                    onChange={(e) =>
                      setData({ ...data, altura: parseFloat(e.target.value) })
                    }
                    className="bg-transparent px-2 py-1 border-2 rounded-sm border-gray-700"
                  />
                </Form.Control>

                {errors.altura?.[0] && (
                  <Form.Message className="text-red-500 text-sm">
                    {errors.altura?.[0]}
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
                    onChange={(e) =>
                      setData({
                        ...data,
                        edad:
                          e.target.value === "" ? 0 : Number(e.target.value),
                      })
                    }
                    className="bg-transparent px-2 py-1 border-2 rounded-sm border-gray-700"
                  />
                </Form.Control>

                {errors.edad?.[0] && (
                  <Form.Message className="text-red-500 text-sm">
                    {errors.edad?.[0]}
                  </Form.Message>
                )}
              </Form.Field>

              <Form.Field name="profesion" className="w-full">
                <Form.Label>Profesion</Form.Label>

                <Form.Control asChild className="w-full">
                  <TextField.Root
                    type="text"
                    disabled={sending}
                    onChange={(e) =>
                      setData({
                        ...data,
                        profesion: e.target.value,
                      })
                    }
                  />
                </Form.Control>

                {errors.profesion?.[0] && (
                  <Form.Message className="text-red-500 text-sm">
                    {errors.profesion?.[0]}
                  </Form.Message>
                )}
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
                    {errors.intereses?.[0]}
                  </Form.Message>
                )}

                <Flex gap="2" wrap="wrap">
                  {data.intereses.map((field, index) => (
                    <Badge size="3" id={field + index}>
                      {field}

                      <Button
                        type="button"
                        onClick={() => handleRemoveInterest(index)}
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
                          setData({ ...data, redes: newRedes });
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
              Crear cuenta
            </Button>
          </Form.Root>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
