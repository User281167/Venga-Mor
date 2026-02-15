export interface AppUser {
  uid: string; // UID de Firebase
  email: string;
  nombre: string;
  apellido: string;
  foto?: string | null;
  tipo: "cliente" | "colaborador";
  creado: number; // timestamp en ms
  descripcion?: string;
  verificado?: boolean;
}
