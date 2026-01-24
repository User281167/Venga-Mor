import { capitalizeFirstLetter } from "@/lib/utils";
import {
  collaboratorFormSchema,
  CollaboratorInfo,
} from "@/schema/collaborator";
import { categorias } from "@/types/categorias";
import { useMemo, useState } from "react";

export const orientaciones = [
  "Heterosexual",
  "Homosexual",
  "Gay",
  "Lesbiana",
  "Bisexual",
  "Pansexual",
  "Asexual",
  "Demisexual",
  "Queer",
  "Questioning (en exploración)",
  "Otro",
];

const initialData: CollaboratorInfo = {
  genero: "Femenino",
  orientacion_sexual: orientaciones[0],
  etnia: "Mestizo",
  altura: 0,
  edad: 18,
  direccion: {
    pais: "",
    estado_region: "",
    ciudad_localidad: "",
  },
  profesion: "",
  intereses: [],
  categorias: [],
  redes: [],
};

export function useCollaboratorForm() {
  const [data, setData] = useState<CollaboratorInfo>(initialData);
  const [sending, setSending] = useState(false);
  const [currentInterest, setCurrentInterest] = useState("");
  const [currentCategoria, setCurrentCategoria] = useState("");

  const errors = useMemo(() => {
    const r = collaboratorFormSchema.safeParse(data);
    return r.success ? {} : r.error.flatten().fieldErrors;
  }, [data]);

  function setField<K extends keyof CollaboratorInfo>(
    key: K,
    value: CollaboratorInfo[K],
  ) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  function addInterest() {
    const value = capitalizeFirstLetter(currentInterest.trim());

    if (value.length < 3) return;
    if (data.intereses.includes(value)) return;
    if (data.intereses.length >= 5) return;

    setData((prev) => ({
      ...prev,
      intereses: [...prev.intereses, value],
    }));

    setCurrentInterest("");
  }

  function removeInterest(index: number) {
    setData((prev) => ({
      ...prev,
      intereses: prev.intereses.filter((_, i) => i !== index),
    }));
  }

  function addCategoria() {
    const value = capitalizeFirstLetter(currentCategoria.trim());

    if (data.categorias?.includes(value) || !categorias.includes(value)) return;
    if (data.categorias && data.categorias.length >= 3) return;

    setData((prev) => ({
      ...prev,
      categorias: [...(prev.categorias ?? []), value],
    }));

    setCurrentCategoria("");
  }

  function removeCategoria(index: number) {
    setData((prev) => ({
      ...prev,
      categorias: prev.categorias?.filter((_, i) => i !== index),
    }));
  }

  function validate() {
    return collaboratorFormSchema.safeParse(data).success;
  }

  function reset() {
    setData(initialData);
    setCurrentInterest("");
  }

  return {
    // state
    data,
    errors,
    sending,
    currentInterest,
    currentCategoria,

    // setters
    setField,
    setData,
    setSending,
    setCurrentInterest,
    setCurrentCategoria,

    // helpers
    addInterest,
    removeInterest,
    addCategoria,
    removeCategoria,
    validate,
    reset,
  };
}
