export interface AppUser {
  uid: string; // UID de Firebase
  email: string;
  nombre: string;
  apellido: string;
  foto?: string | null;
  tipo: "cliente" | "colaborador";
  creado: string; // ISO string de la fecha de creación
  descripcion?: string;
  verificado?: boolean;
}
