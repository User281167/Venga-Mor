export interface AppUser {
  id: string; // UID de Firebase
  email: string;
  nombre: string;
  apellido: string;
  foto?: string | null;
  userType: "client";
  creado: number; // timestamp en ms
  descripcion?: string;
}
