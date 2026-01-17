import { capitalizeFirstLetter } from "@/lib/utils";
import {
  collaboratorFormSchema,
  CollaboratorInfo,
} from "@/schema/collaborator";
import { useMemo, useState } from "react";

const initialData: CollaboratorInfo = {
  genero: "Femenino",
  orientacion_sexual: "",
  etnia: "Mestizo",
  altura: 0,
  edad: 18,
  profesion: "",
  intereses: [],
  redes: [],
};

export function useCollaboratorForm() {
  const [data, setData] = useState<CollaboratorInfo>(initialData);
  const [sending, setSending] = useState(false);
  const [currentInterest, setCurrentInterest] = useState("");

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

    // setters
    setField,
    setData,
    setSending,
    setCurrentInterest,

    // helpers
    addInterest,
    removeInterest,
    validate,
    reset,
  };
}
