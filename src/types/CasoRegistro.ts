import { Comentario } from "./Comentario";
import { Metastasis } from "./Metastasis";
import { Recurrencia } from "./Recurrencia";
import { Progresion } from "./Progresion";
import { Comite } from "./Comite";
import { TratamientoAntesFALP } from "./TratamientoAntesFALP";
import { TratamientoEnFALP } from "./TratamientoEnFALP";
import { TratamientoPostDuranteFALP } from "./TratamientoPostDuranteFALP";

export interface CasoRegistroBase {
  nombre: string;
  apellido: string;
  ficha: number;
  rut_dni: string;
  num_registro: string;
  categoria: string;
  subcategoria: string;
  fecha_dg: string;
  fecha_lugar_obtencion_dg: string;
  fecha_estimada_dg: boolean;
  lugar_obtencion_dg: string;
  sin_informacion_morfologia: boolean;
  grado_diferenciacion: string;
  morfologia: string;
  lugar_obtencion_morfologia: string;
  fecha_lugar_obtencion_morfologia: string;
  topografia: string;
  lugar_obtencion_topografia: string;
  fecha_lugar_obtencion_topografia: string;
  lateralidad: string;
  comportamiento: string;
  extension_dg: string;
  estadio_dg: string;
  clase_caso: string;
  clasificacion_dg_ttos: string;
  ultimo_contacto: string;
  sigue_atencion_otro_centro: string;
  estado_vital: string;
  fecha_defuncion: string | null;
  causa_defuncion: string | null;
}

export interface CasoRegistroCreate extends CasoRegistroBase {}

export interface CasoRegistro extends CasoRegistroBase {
  id: number;
  comentarios: Comentario[];
  metastasis: Metastasis[];
  recurrencias: Recurrencia[];
  progresiones: Progresion[];
  comites: Comite[];
  tratamientos_antes_falp: TratamientoAntesFALP[];
  tratamientos_en_falp: TratamientoEnFALP[];
  tratamientos_post_durante_falp: TratamientoPostDuranteFALP[];
}
