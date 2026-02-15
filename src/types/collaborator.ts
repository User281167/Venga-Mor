import { LocationData } from "./location-data";

export interface Collaborator {
  uid: string;
  nombre: string;
  apellido: string;
  foto?: string | null;
  genero: string;
  orientacion_sexual: string;
  etnia: string;
  altura: number;
  edad: number;
  direccion: LocationData;
  profesion: string;
  descripcion: string;
  intereses: string[];
  categorias: string[];
  redes: string[];
  estrellas: number;
  verificado?: boolean;
}
